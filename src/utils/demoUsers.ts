export interface DemoUser {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  contactNumber: string
  role: 'user' | 'admin' | 'recruiter'
  profileImage?: string
}

const demoUsers: DemoUser[] = [
  {
    username: 'NidhiMusale',
    email: 'nidhi@foliogram.com',
    password: 'password123',
    firstName: 'Nidhi',
    lastName: 'Musale',
    contactNumber: '1234567890',
    role: 'user',
  },
  {
    username: 'RaviTejaGundu',
    email: 'ravi@foliogram.com',
    password: 'password123',
    firstName: 'Ravi Teja',
    lastName: 'Gundu',
    contactNumber: '1234567890',
    role: 'admin',
  },
  {
    username: 'BharathwajNedoumaran',
    email: 'bharathwaj@foliogram.com',
    password: 'password123',
    firstName: 'Bharathwaj',
    lastName: 'Nedoumaran',
    contactNumber: '0987654321',
    role: 'admin',
  },
  {
    username: 'YashadaAjitTembe',
    email: 'yashada@foliogram.com',
    password: 'password123',
    firstName: 'Yashada Ajit',
    lastName: 'Tembe',
    contactNumber: '5554443333',
    role: 'recruiter',
  },
]

export function findDemoUserByUsernameOrEmail(id: string) {
  // First try to find from localStorage users (managed users)
  const storedUsers = localStorage.getItem('appUsers')
  if (storedUsers) {
    const users: DemoUser[] = JSON.parse(storedUsers)
    const lower = id.trim().toLowerCase()
    const found = users.find((u) => u.username.toLowerCase() === lower || u.email.toLowerCase() === lower)
    if (found) return found
  }

  // Fallback to demo users
  const lower = id.trim().toLowerCase()
  return demoUsers.find((u) => u.username.toLowerCase() === lower || u.email.toLowerCase() === lower) ?? null
}

export default demoUsers
