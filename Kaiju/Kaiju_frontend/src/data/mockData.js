export const mockUser = {
  id: 'officer-sato',
  name: 'Officer Sato',
  role: 'Quarter Coordinator',
  roleCode: 'QC',
  assignedQuarter: 'Apex',
  email: 'officer.sato@tokyork.gov'
}

export const catastropheState = {
  level: 3,
  title: 'Emergency',
  summary: 'Infrastructure stress remains elevated while recovery measures are underway.'
}

export const mockQuarters = [
  {
    id: 'Apex',
    short: 'A',
    label: 'Apex',
    status: 'Stable',
    threatLevel: 'Moderate',
    resources: 'Healthy',
    seaAccess: false,
    connections: ['Echo', 'Warden', 'Xeno']
  },
  {
    id: 'Echo',
    short: 'E',
    label: 'Echo',
    status: 'Watch',
    threatLevel: 'Elevated',
    resources: 'Limited',
    seaAccess: true,
    connections: ['Apex', 'Xeno', 'Sea']
  },
  {
    id: 'Warden',
    short: 'W',
    label: 'Warden',
    status: 'Stable',
    threatLevel: 'Moderate',
    resources: 'Stable',
    seaAccess: false,
    connections: ['Apex', 'Xeno', 'Zion']
  },
  {
    id: 'Xeno',
    short: 'X',
    label: 'Xeno',
    status: 'Critical',
    threatLevel: 'High',
    resources: 'At risk',
    seaAccess: true,
    hub: true,
    connections: ['Apex', 'Echo', 'Warden', 'Zion', 'Sea']
  },
  {
    id: 'Zion',
    short: 'Z',
    label: 'Zion',
    status: 'Watch',
    threatLevel: 'Elevated',
    resources: 'Recovering',
    seaAccess: true,
    connections: ['Warden', 'Xeno', 'Sea']
  }
]

export const mockResources = [
  {
    id: 'medical-personnel',
    name: 'Medical Personnel',
    total: 240,
    available: 170,
    reserved: 42,
    minimumRetention: 72,
    status: 'Stable',
    description: 'Clinical and support staff available for field deployment and mobile triage units.',
    quarterBreakdown: {
      Apex: { total: 48, available: 36, reserved: 8, minRetention: 14, transferable: 22 },
      Echo: { total: 52, available: 31, reserved: 12, minRetention: 16, transferable: 15 },
      Warden: { total: 46, available: 35, reserved: 9, minRetention: 14, transferable: 21 },
      Xeno: { total: 54, available: 38, reserved: 7, minRetention: 16, transferable: 22 },
      Zion: { total: 40, available: 30, reserved: 6, minRetention: 12, transferable: 18 }
    }
  },
  {
    id: 'rescue-teams',
    name: 'Rescue Teams',
    total: 180,
    available: 118,
    reserved: 36,
    minimumRetention: 54,
    status: 'Warning',
    description: 'Urban search and rescue teams coordinating extraction and structural response.',
    quarterBreakdown: {
      Apex: { total: 34, available: 24, reserved: 7, minRetention: 10, transferable: 14 },
      Echo: { total: 39, available: 22, reserved: 8, minRetention: 12, transferable: 10 },
      Warden: { total: 36, available: 26, reserved: 6, minRetention: 11, transferable: 15 },
      Xeno: { total: 41, available: 27, reserved: 9, minRetention: 12, transferable: 15 },
      Zion: { total: 30, available: 19, reserved: 6, minRetention: 9, transferable: 10 }
    }
  },
  {
    id: 'transport-vehicles',
    name: 'Transport Vehicles',
    total: 220,
    available: 142,
    reserved: 50,
    minimumRetention: 66,
    status: 'Stable',
    description: 'Heavy transport and utility vehicles assigned to deconfliction and supply lines.',
    quarterBreakdown: {
      Apex: { total: 42, available: 31, reserved: 7, minRetention: 13, transferable: 18 },
      Echo: { total: 48, available: 29, reserved: 11, minRetention: 14, transferable: 15 },
      Warden: { total: 40, available: 27, reserved: 9, minRetention: 12, transferable: 15 },
      Xeno: { total: 55, available: 35, reserved: 15, minRetention: 17, transferable: 18 },
      Zion: { total: 35, available: 20, reserved: 8, minRetention: 11, transferable: 9 }
    }
  },
  {
    id: 'emergency-shelters',
    name: 'Emergency Shelters',
    total: 150,
    available: 96,
    reserved: 28,
    minimumRetention: 45,
    status: 'Watch',
    description: 'Temporary lodging and command staging capacity across city districts.',
    quarterBreakdown: {
      Apex: { total: 32, available: 24, reserved: 4, minRetention: 10, transferable: 14 },
      Echo: { total: 26, available: 18, reserved: 6, minRetention: 8, transferable: 10 },
      Warden: { total: 30, available: 18, reserved: 6, minRetention: 9, transferable: 9 },
      Xeno: { total: 38, available: 21, reserved: 8, minRetention: 11, transferable: 10 },
      Zion: { total: 24, available: 15, reserved: 4, minRetention: 7, transferable: 8 }
    }
  },
  {
    id: 'food-water-supplies',
    name: 'Food & Water Supplies',
    total: 610,
    available: 410,
    reserved: 115,
    minimumRetention: 183,
    status: 'Stable',
    description: 'Consumables and water reserves for shelters, field teams, and stabilized zones.',
    quarterBreakdown: {
      Apex: { total: 120, available: 84, reserved: 21, minRetention: 36, transferable: 48 },
      Echo: { total: 130, available: 88, reserved: 24, minRetention: 39, transferable: 49 },
      Warden: { total: 110, available: 70, reserved: 25, minRetention: 33, transferable: 37 },
      Xeno: { total: 150, available: 100, reserved: 28, minRetention: 45, transferable: 55 },
      Zion: { total: 100, available: 68, reserved: 17, minRetention: 30, transferable: 38 }
    }
  },
  {
    id: 'communication-equipment',
    name: 'Communication Equipment',
    total: 210,
    available: 124,
    reserved: 44,
    minimumRetention: 63,
    status: 'Warning',
    description: 'Repeaters, radio stacks, and resilient network gear for emergency communications.',
    quarterBreakdown: {
      Apex: { total: 40, available: 24, reserved: 8, minRetention: 12, transferable: 12 },
      Echo: { total: 52, available: 26, reserved: 10, minRetention: 16, transferable: 10 },
      Warden: { total: 36, available: 20, reserved: 8, minRetention: 11, transferable: 9 },
      Xeno: { total: 48, available: 32, reserved: 10, minRetention: 14, transferable: 18 },
      Zion: { total: 34, available: 22, reserved: 8, minRetention: 10, transferable: 12 }
    }
  },
  {
    id: 'power-generators',
    name: 'Power Generators',
    total: 170,
    available: 96,
    reserved: 27,
    minimumRetention: 51,
    status: 'Warning',
    description: 'Portable and fixed generators keeping shelters and command posts operational.',
    quarterBreakdown: {
      Apex: { total: 30, available: 18, reserved: 6, minRetention: 9, transferable: 9 },
      Echo: { total: 38, available: 22, reserved: 7, minRetention: 11, transferable: 11 },
      Warden: { total: 32, available: 18, reserved: 5, minRetention: 10, transferable: 8 },
      Xeno: { total: 42, available: 24, reserved: 6, minRetention: 13, transferable: 11 },
      Zion: { total: 28, available: 14, reserved: 3, minRetention: 8, transferable: 6 }
    }
  },
  {
    id: 'engineering-crews',
    name: 'Engineering Crews',
    total: 160,
    available: 95,
    reserved: 31,
    minimumRetention: 48,
    status: 'Stable',
    description: 'Field engineers and civil works specialists supporting infrastructure repair.',
    quarterBreakdown: {
      Apex: { total: 30, available: 21, reserved: 5, minRetention: 9, transferable: 12 },
      Echo: { total: 36, available: 18, reserved: 7, minRetention: 11, transferable: 7 },
      Warden: { total: 32, available: 20, reserved: 6, minRetention: 10, transferable: 10 },
      Xeno: { total: 38, available: 23, reserved: 8, minRetention: 11, transferable: 12 },
      Zion: { total: 24, available: 13, reserved: 5, minRetention: 7, transferable: 6 }
    }
  },
  {
    id: 'security-units',
    name: 'Security Units',
    total: 200,
    available: 126,
    reserved: 38,
    minimumRetention: 60,
    status: 'Stable',
    description: 'Security patrols and civil protection teams for checkpoint and perimeter control.',
    quarterBreakdown: {
      Apex: { total: 40, available: 25, reserved: 9, minRetention: 12, transferable: 13 },
      Echo: { total: 44, available: 25, reserved: 9, minRetention: 13, transferable: 12 },
      Warden: { total: 38, available: 26, reserved: 6, minRetention: 11, transferable: 15 },
      Xeno: { total: 46, available: 29, reserved: 8, minRetention: 14, transferable: 15 },
      Zion: { total: 32, available: 21, reserved: 6, minRetention: 10, transferable: 11 }
    }
  },
  {
    id: 'hazmat-equipment',
    name: 'Hazmat Equipment',
    total: 140,
    available: 84,
    reserved: 22,
    minimumRetention: 42,
    status: 'Critical',
    description: 'Containment kits, decontamination units, and specialist protection gear.',
    quarterBreakdown: {
      Apex: { total: 28, available: 16, reserved: 5, minRetention: 8, transferable: 8 },
      Echo: { total: 32, available: 16, reserved: 6, minRetention: 10, transferable: 6 },
      Warden: { total: 26, available: 17, reserved: 4, minRetention: 8, transferable: 9 },
      Xeno: { total: 34, available: 22, reserved: 4, minRetention: 10, transferable: 12 },
      Zion: { total: 20, available: 13, reserved: 3, minRetention: 6, transferable: 7 }
    }
  }
]

export const mockTransfers = [
  { id: 'TR-2041', resource: 'Medical Personnel', source: 'Xeno', destination: 'Zion', quantity: 18, status: 'Pending' },
  { id: 'TR-2042', resource: 'Food & Water Supplies', source: 'Apex', destination: 'Echo', quantity: 42, status: 'Approved' },
  { id: 'TR-2043', resource: 'Power Generators', source: 'Warden', destination: 'Xeno', quantity: 10, status: 'Pending' },
  { id: 'TR-2044', resource: 'Communication Equipment', source: 'Echo', destination: 'Apex', quantity: 14, status: 'Rejected' }
]

export const mockActivity = [
  { id: 1, title: 'Apex approved transfer', time: '3 minutes ago', detail: 'Medical Personnel to Echo — 18 units', status: 'Approved' },
  { id: 2, title: 'Storage warning', time: '18 minutes ago', detail: 'Power reserves under 12% in Xeno', status: 'Warning' },
  { id: 3, title: 'Shelter capacity check', time: '42 minutes ago', detail: 'Zion shelter inventory updated', status: 'Stable' },
  { id: 4, title: 'Hazmat alert raised', time: '1 hour ago', detail: 'Additional containment needed in Echo', status: 'Critical' }
]

export const mockRequests = [
  { id: 'REQ-712', type: 'Incoming', resource: 'Medical Personnel', from: 'Echo', amount: 12, status: 'Pending' },
  { id: 'REQ-713', type: 'Outgoing', resource: 'Food & Water Supplies', to: 'Warden', amount: 36, status: 'Approved' },
  { id: 'REQ-714', type: 'Incoming', resource: 'Power Generators', from: 'Zion', amount: 8, status: 'Rejected' },
  { id: 'REQ-715', type: 'Outgoing', resource: 'Security Units', to: 'Xeno', amount: 5, status: 'Pending' }
]

export const futureNavItems = [
  { path: '/transfers', label: 'Transfers', future: true },
  { path: '/calendar', label: 'Calendar', future: true },
  { path: '/notifications', label: 'Notifications', future: true },
  { path: '/permissions', label: 'Permissions', future: true },
  { path: '/catastrophe', label: 'Catastrophe', future: true },
  { path: '/transfer-details', label: 'Transfer Details', future: true }
]
