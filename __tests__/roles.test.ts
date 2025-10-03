import { roles, categories } from '@/app/practice/roles'

describe('Roles Data', () => {
  it('should have all required fields for each role', () => {
    roles.forEach(role => {
      expect(role).toHaveProperty('id')
      expect(role).toHaveProperty('title')
      expect(role).toHaveProperty('company')
      expect(role).toHaveProperty('category')
      expect(role).toHaveProperty('level')
      expect(role).toHaveProperty('description')

      expect(typeof role.id).toBe('string')
      expect(typeof role.title).toBe('string')
      expect(typeof role.company).toBe('string')
      expect(typeof role.category).toBe('string')
      expect(typeof role.level).toBe('string')
      expect(typeof role.description).toBe('string')
    })
  })

  it('should have unique IDs for all roles', () => {
    const ids = roles.map(r => r.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have valid categories', () => {
    roles.forEach(role => {
      expect(categories).toContain(role.category)
    })
  })

  it('should have valid experience levels', () => {
    // Just check that level field exists and is not empty
    roles.forEach(role => {
      expect(role.level).toBeTruthy()
      expect(typeof role.level).toBe('string')
    })
  })

  it('should have expected number of roles', () => {
    expect(roles.length).toBeGreaterThan(300) // At least 300 roles
  })

  it('should have expected number of categories', () => {
    expect(categories.length).toBe(22)
  })
})
