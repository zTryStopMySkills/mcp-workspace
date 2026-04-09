const ADMIN_KEY = 'dn_admin'
const ADMIN_PASS = 'divernature2025'

export function login(password: string): boolean {
  if (password === ADMIN_PASS) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_KEY, '1')
    }
    return true
  }
  return false
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_KEY)
  }
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ADMIN_KEY) === '1'
}
