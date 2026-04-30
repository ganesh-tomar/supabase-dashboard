'use client'

import { useState } from 'react'
import { updateProfile } from './actions'
import styles from '../../auth.module.css'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ProfileSettings({ searchParams }: { searchParams: { name?: string } }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error'|'success', text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    const result = await updateProfile(formData)
    
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result?.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--primary)', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className={styles.title}>Profile Settings</h1>
        <p className={styles.subtitle}>Update your personal information.</p>
        
        {message && (
          <div className={styles.error} style={{ 
            backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : undefined,
            color: message.type === 'success' ? '#22c55e' : undefined,
            borderColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : undefined
          }}>
            {message.text}
          </div>
        )}
        
        <form action={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="display_name">Display Name</label>
            <input id="display_name" name="display_name" type="text" required placeholder="John Doe" defaultValue={searchParams.name || ''} />
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
