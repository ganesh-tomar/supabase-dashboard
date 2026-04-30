'use client'

import { deleteUser, updateUserRole } from './actions'
import { Trash2, Shield, ShieldOff } from 'lucide-react'
import { useState } from 'react'

export default function UserRowActions({ userId, currentRole, isAdmin, isSelf }: { userId: string, currentRole: string, isAdmin: boolean, isSelf: boolean }) {
  const [loading, setLoading] = useState(false)

  if (!isAdmin || isSelf) return null // Don't allow admins to delete/demote themselves from here

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return
    setLoading(true)
    await deleteUser(userId)
    setLoading(false)
  }

  const handleToggleRole = async () => {
    setLoading(true)
    await updateUserRole(userId, currentRole === 'admin' ? 'user' : 'admin')
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', opacity: loading ? 0.5 : 1 }}>
      <button 
        onClick={handleToggleRole} 
        disabled={loading}
        title={currentRole === 'admin' ? 'Remove Admin' : 'Make Admin'}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--foreground)', opacity: 0.7 }}
      >
        {currentRole === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
      </button>
      <button 
        onClick={handleDelete}
        disabled={loading}
        title="Delete User"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.8 }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
