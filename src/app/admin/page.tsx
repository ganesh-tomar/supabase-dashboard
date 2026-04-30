import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../login/actions'
import styles from './page.module.css'
import DashboardCharts from './charts'
import UserRowActions from './UserRowActions'
import { LayoutDashboard, Users, Settings, LogOut, ShieldCheck, Activity } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Verify the user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the current user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch all signed-up users (profiles)
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true }) // Changed to ascending for chronological chart data

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>Admin<span>Panel</span></h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.active}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="#">
            <Users size={18} /> User Directory
          </Link>
          <Link href={`/admin/profile?name=${profile?.display_name || ''}`}>
            <Settings size={18} /> Profile Settings
          </Link>
        </nav>
        <form action={logout} className={styles.logoutForm}>
          <button type="submit" className={styles.logoutBtn}>
            <LogOut size={18} /> Sign Out
          </button>
        </form>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1>Welcome back, {profile?.display_name || user.email?.split('@')[0]}</h1>
            <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>Here's what's happening with your platform today.</p>
          </div>
          <div className={styles.userBadge}>
            <ShieldCheck size={18} style={{ marginRight: '0.5rem', color: 'var(--primary)' }} />
            <span className={styles.role}>{profile?.role || 'User'}</span>
          </div>
        </header>

        <div className={styles.dashboardGrid}>
          <div className={styles.card}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} /> Total Users</h3>
            <p className={styles.metric}>{allProfiles?.length || 0}</p>
          </div>
          <div className={styles.card}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> Active Sessions</h3>
            <p className={styles.metric}>1</p>
          </div>
          <div className={styles.card}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={18} /> System Status</h3>
            <p className={styles.metric} style={{ color: '#22c55e' }}>Healthy</p>
          </div>
        </div>

        {allProfiles && <DashboardCharts data={allProfiles} />}

        <div className={styles.tableContainer} style={{ marginTop: '2rem' }}>
          <h2>Registered Users</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProfiles?.slice().reverse().map((p) => (
                <tr key={p.id}>
                  <td><code style={{ background: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{p.id.substring(0, 8)}</code></td>
                  <td style={{ fontWeight: 500 }}>{p.display_name || 'Anonymous'}</td>
                  <td>
                    <span className={styles.badge} style={{
                      backgroundColor: p.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: p.role === 'admin' ? '#ef4444' : '#3b82f6'
                    }}>
                      {p.role || 'user'}
                    </span>
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td style={{ width: '80px' }}>
                    <UserRowActions userId={p.id} currentRole={p.role} isAdmin={profile?.role === 'admin'} isSelf={p.id === user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
