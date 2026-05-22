const USER_KEY = 'xbq_user_info'
const TOKEN_KEY = 'xbq_token'

export function setUserInfo(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem('token', user.token || '')
  localStorage.setItem('username', user.username || '')
}

export function getUserInfo() {
  const str = localStorage.getItem(USER_KEY)
  return str ? JSON.parse(str) : null
}

export function removeUserInfo() {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem('token')
  localStorage.removeItem('username')
}

export function isAdmin() {
  const user = getUserInfo()
  return user?.role === 'ADMIN'
}
