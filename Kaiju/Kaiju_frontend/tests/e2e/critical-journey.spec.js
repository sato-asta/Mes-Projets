import { test, expect, request as playwrightRequest } from '@playwright/test'

const BACKEND_URL = process.env.E2E_BACKEND_URL || 'http://localhost:8000'

function uniqueEmail(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}@kaiju.com`
}

async function registerAndLogin(api, role, name) {
  const email = uniqueEmail(role.toLowerCase())
  const password = 'secret123'

  await api.post('/auth/register', { data: { name, email, password, role } })
  const loginResponse = await api.post('/auth/login', { data: { email, password } })
  const { access_token: token } = await loginResponse.json()

  const meResponse = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
  const me = await meResponse.json()

  return { email, password, token, id: me.id }
}

test.describe('Critical journey: login -> request -> approval -> real-time update', () => {
  let api
  let cd
  let qc
  let sourceDistrict
  let destinationDistrict
  let resource
  const createdUserEmails = []
  const createdTransferIds = []

  test.beforeAll(async () => {
    api = await playwrightRequest.newContext({ baseURL: BACKEND_URL })

    cd = await registerAndLogin(api, 'CD', 'E2E City Director')
    qc = await registerAndLogin(api, 'QC', 'E2E Quarter Coordinator')
    createdUserEmails.push(cd.email, qc.email)

    const districts = await (await api.get('/districts')).json()
    destinationDistrict = districts.find((d) => d.code === 'A')
    sourceDistrict = districts.find((d) => d.code === 'E')

    await api.put(`/users/${qc.id}/scopes`, {
      headers: { Authorization: `Bearer ${cd.token}` },
      data: { district_ids: [destinationDistrict.id] },
    })

    await api.post('/disaster-level', {
      headers: { Authorization: `Bearer ${cd.token}` },
      data: { level: 3 },
    })

    const inventory = await (await api.get(`/districts/${sourceDistrict.id}/inventory`)).json()
    const suitable = inventory.find((item) => item.available_to_transfer >= 1)
    const resources = await (await api.get('/resources')).json()
    resource = resources.find((r) => r.id === suitable.resource_id)
  })

  test.afterAll(async () => {
    for (const transferId of createdTransferIds) {
      await api.post(`/transfers/${transferId}/reject`, {
        headers: { Authorization: `Bearer ${cd.token}` },
      }).catch(() => {})
    }

    await api.post('/disaster-level', {
      headers: { Authorization: `Bearer ${cd.token}` },
      data: { level: 1 },
    }).catch(() => {})

    await api.dispose()
  })

  test('QC logs in, requests a transfer; CD logs in and approves it; QC sees the update live', async ({ browser }) => {
    const qcContext = await browser.newContext()
    const cdContext = await browser.newContext()
    const qcPage = await qcContext.newPage()
    const cdPage = await cdContext.newPage()

    await qcPage.goto('/login')
    await qcPage.getByLabel('Email').fill(qc.email)
    await qcPage.getByLabel('Password').fill(qc.password)
    await qcPage.getByRole('button', { name: /log in/i }).click()
    await expect(qcPage).toHaveURL(/\/dashboard/)

    await cdPage.goto('/login')
    await cdPage.getByLabel('Email').fill(cd.email)
    await cdPage.getByLabel('Password').fill(cd.password)
    await cdPage.getByRole('button', { name: /log in/i }).click()
    await expect(cdPage).toHaveURL(/\/dashboard/)

    await qcPage.goto('/new-resource-request')
    await qcPage.getByLabel('Source quarter').selectOption({ label: sourceDistrict.name })
    await qcPage.getByLabel('Destination quarter').selectOption({ label: destinationDistrict.name })
    await qcPage.getByLabel('Resource type').selectOption({ label: resource.name })
    await qcPage.getByLabel('Quantity').fill('1')

    const [createResponse] = await Promise.all([
      qcPage.waitForResponse((response) => response.url().includes('/api/transfers') && response.request().method() === 'POST'),
      qcPage.getByRole('button', { name: /validate and submit/i }).click(),
    ])
    const created = await createResponse.json()
    createdTransferIds.push(created.id)

    await expect(qcPage).toHaveURL(/\/transfers$/)
    const qcRow = qcPage.locator('tr', { has: qcPage.getByText(`TR-${created.id}`) })
    await expect(qcRow).toContainText('pending')

    await cdPage.goto(`/transfers/${created.id}`)
    await expect(cdPage.getByText('pending', { exact: true })).toBeVisible()
    await cdPage.getByRole('button', { name: /^approve$/i }).click()
    await expect(cdPage.getByText('approved', { exact: true })).toBeVisible()

    await expect(qcRow).toContainText('approved', { timeout: 10000 })

    await qcContext.close()
    await cdContext.close()
  })
})
