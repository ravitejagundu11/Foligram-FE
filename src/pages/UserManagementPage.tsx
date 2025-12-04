import { useState, useMemo } from 'react'
import { useUserManagement } from '@contexts/UserManagementContext'
import { useAuth } from '@contexts/AuthContext'
import { Users, Search, UserCheck, UserX, Shield, Briefcase } from 'lucide-react'
import PageHeader from '@components/PageHeader'
import '../styles/UserManagementPage.css'
import '../styles/PageHeader.css'

const UserManagementPage = () => {
  const { users, updateUserRole, removeUser } = useUserManagement()
  const { user: currentUser } = useAuth()
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'recruiter'>('user')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin' | 'recruiter'>('all')

  const handleEditRole = (username: string, currentRole: 'user' | 'admin' | 'recruiter') => {
    setEditingUser(username)
    setSelectedRole(currentRole)
  }

  const handleSaveRole = (username: string) => {
    updateUserRole(username, selectedRole)
    setEditingUser(null)
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
  }

  const handleDeleteUser = (username: string) => {
    removeUser(username)
    setConfirmDelete(null)
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'role-badge role-badge-admin'
      case 'recruiter':
        return 'role-badge role-badge-recruiter'
      default:
        return 'role-badge role-badge-user'
    }
  }

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === 'all' || user.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length
    const adminCount = users.filter((u) => u.role === 'admin').length
    const recruiterCount = users.filter((u) => u.role === 'recruiter').length
    const regularUserCount = users.filter((u) => u.role === 'user').length

    return {
      total: totalUsers,
      admins: adminCount,
      recruiters: recruiterCount,
      users: regularUserCount,
    }
  }, [users])

  return (
    <div className="user-management-container">
      <PageHeader
        title="User Management"
        subtitle="Manage user roles and permissions"
        icon={Users}
      />

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card stat-card-purple">
          <div className="stat-icon">
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Admins</p>
            <p className="stat-value">{stats.admins}</p>
          </div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-icon">
            <Briefcase size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Recruiters</p>
            <p className="stat-value">{stats.recruiters}</p>
          </div>
        </div>

        <div className="stat-card stat-card-orange">
          <div className="stat-icon">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Regular Users</p>
            <p className="stat-value">{stats.users}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by username, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="role-filter-tabs">
          <button
            onClick={() => setRoleFilter('all')}
            className={`role-tab ${roleFilter === 'all' ? 'role-tab-active' : ''}`}
          >
            <Users size={16} />
            All
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`role-tab ${roleFilter === 'user' ? 'role-tab-active role-tab-user' : ''}`}
          >
            <UserCheck size={16} />
            Users
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`role-tab ${roleFilter === 'admin' ? 'role-tab-active role-tab-admin' : ''}`}
          >
            <Shield size={16} />
            Admins
          </button>
          <button
            onClick={() => setRoleFilter('recruiter')}
            className={`role-tab ${roleFilter === 'recruiter' ? 'role-tab-active role-tab-recruiter' : ''}`}
          >
            <Briefcase size={16} />
            Recruiters
          </button>
        </div>

        <div className="filter-results">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.username}>
                <td className="font-medium">{user.username}</td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.contactNumber}</td>
                <td>
                  {editingUser === user.username ? (
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as 'user' | 'admin' | 'recruiter')}
                      className="role-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="recruiter">Recruiter</option>
                    </select>
                  ) : (
                    <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingUser === user.username ? (
                      <>
                        <button onClick={() => handleSaveRole(user.username)} className="btn-save">
                          Save
                        </button>
                        <button onClick={handleCancelEdit} className="btn-cancel">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditRole(user.username, user.role)}
                          className="btn-edit"
                          disabled={user.username === currentUser?.username}
                        >
                          Edit Role
                        </button>
                        {confirmDelete === user.username ? (
                          <>
                            <button onClick={() => handleDeleteUser(user.username)} className="btn-confirm-delete">
                              Confirm
                            </button>
                            <button onClick={() => setConfirmDelete(null)} className="btn-cancel">
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(user.username)}
                            className="btn-delete"
                            disabled={user.username === currentUser?.username}
                          >
                            Remove
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  {user.username === currentUser?.username && (
                    <p className="text-xs text-gray-500 mt-1">(Current user)</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            {users.length === 0 ? (
              <>
                <UserX size={48} className="text-gray-400" />
                <p className="text-gray-500 mt-2">No users found</p>
              </>
            ) : (
              <>
                <UserX size={48} className="text-gray-400" />
                <p className="text-gray-500 mt-2">No users match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setRoleFilter('all')
                  }}
                  className="btn-primary mt-3"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagementPage
