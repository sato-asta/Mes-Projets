import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { userService } from '../services/userService'

const ROLES = ['QC', 'LC', 'CD']

export function TeamPermissionsPage() {
  const [users, setUsers] = useState([])
  const [districts, setDistricts] = useState([])
  const [error, setError] = useState('')
  const [savingUserId, setSavingUserId] = useState(null)

  useEffect(() => {
    fetch('/api/districts')
      .then((response) => response.json())
      .then(setDistricts)
      .catch(() => setDistricts([]))

    userService.listUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
  }, [])

  async function handleRoleChange(userId, role) {
    setSavingUserId(userId)
    setError('')
    try {
      const updated = await userService.updateRole(userId, role)
      setUsers((current) => current.map((user) => (user.id === userId ? updated : user)))
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingUserId(null)
    }
  }

  async function handleDistrictToggle(user, districtId) {
    const alreadyAssigned = user.district_ids.includes(districtId)
    const nextDistrictIds = alreadyAssigned
      ? user.district_ids.filter((id) => id !== districtId)
      : [...user.district_ids, districtId]

    setSavingUserId(user.id)
    setError('')
    try {
      const updated = await userService.updateScopes(user.id, nextDistrictIds)
      setUsers((current) => current.map((item) => (item.id === user.id ? updated : item)))
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingUserId(null)
    }
  }

  return (
    <div className="page-stack">
      <Card title="Team Permissions" subtitle="Manage each user's role and assigned quarters" className="card--full">
        {error && <p className="form-error">{error}</p>}

        <div className="table-block">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Assigned quarters</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      disabled={savingUserId === user.id}
                      onChange={(event) => handleRoleChange(user.id, event.target.value)}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {user.role === 'CD' ? (
                      <Badge variant="stable">Citywide access</Badge>
                    ) : (
                      <div className="quarter-checkbox-group">
                        {districts.map((district) => (
                          <label key={district.id} className="quarter-checkbox">
                            <input
                              type="checkbox"
                              checked={user.district_ids.includes(district.id)}
                              disabled={savingUserId === user.id}
                              onChange={() => handleDistrictToggle(user, district.id)}
                            />
                            {district.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
