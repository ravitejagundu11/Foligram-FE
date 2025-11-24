import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import demoUsers, { DemoUser } from '@utils/demoUsers'

interface UserManagementContextType {
  users: DemoUser[]
  updateUserRole: (username: string, newRole: 'user' | 'admin' | 'recruiter') => void
  removeUser: (username: string) => void
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined)

export const UserManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<DemoUser[]>([])

  useEffect(() => {
    // Load users from localStorage or use demo users
    const storedUsers = localStorage.getItem('appUsers')
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    } else {
      setUsers([...demoUsers])
      localStorage.setItem('appUsers', JSON.stringify(demoUsers))
    }
  }, [])

  const updateUserRole = (username: string, newRole: 'user' | 'admin' | 'recruiter') => {
    const updatedUsers = users.map((user) =>
      user.username === username ? { ...user, role: newRole } : user
    )
    setUsers(updatedUsers)
    localStorage.setItem('appUsers', JSON.stringify(updatedUsers))

    // Update current user in auth context if they're the one being updated
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const currentUser = JSON.parse(storedUser)
      if (currentUser.username === username) {
        const updatedCurrentUser = { ...currentUser, role: newRole }
        localStorage.setItem('user', JSON.stringify(updatedCurrentUser))
        // Trigger a page reload to update the auth context
        window.location.reload()
      }
    }
  }

  const removeUser = (username: string) => {
    const updatedUsers = users.filter((user) => user.username !== username)
    setUsers(updatedUsers)
    localStorage.setItem('appUsers', JSON.stringify(updatedUsers))

    // Check if the removed user is the current user
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const currentUser = JSON.parse(storedUser)
      if (currentUser.username === username) {
        // Log them out
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
        window.location.href = '/login'
      }
    }
  }

  return (
    <UserManagementContext.Provider value={{ users, updateUserRole, removeUser }}>
      {children}
    </UserManagementContext.Provider>
  )
}

export const useUserManagement = () => {
  const context = useContext(UserManagementContext)
  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider')
  }
  return context
}
