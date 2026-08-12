declare global {
  var __mockDB: any
}

if (!globalThis.__mockDB) {
  globalThis.__mockDB = { proposals: [] }
}

const mockDB = globalThis.__mockDB

export async function mockInsert(table: string, data: any) {
  const id = 'prop_' + Math.random().toString(36).substr(2, 9)
  const record = { ...data, id, created_at: new Date().toISOString() }
  mockDB[table] = mockDB[table] || []
  mockDB[table].push(record)
  return { data: record, error: null }
}

export async function mockSelect(table: string, filters: any = {}) {
  mockDB[table] = mockDB[table] || []
  let results = [...mockDB[table]]
  if (filters.user_id) results = results.filter((r: any) => r.user_id === filters.user_id)
  if (filters.id) results = results.filter((r: any) => r.id === filters.id)
  return { data: results, error: null }
}

export async function mockUpdate(table: string, id: string, data: any) {
  const idx = mockDB[table]?.findIndex((r: any) => r.id === id)
  if (idx >= 0) mockDB[table][idx] = { ...mockDB[table][idx], ...data }
  return { data: mockDB[table]?.[idx], error: null }
}
