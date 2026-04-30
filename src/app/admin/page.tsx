import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../login/actions'
import styles from './page.module.css'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Verify the user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all profiles (this will respect RLS - if they aren't admin, maybe they can only see themselves)
  // For simplicity, let's fetch their own profile to show their name
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>Admin<span>Panel</span></h2>
        </div>
        <nav className={styles.nav}>
          <a href="#" className={styles.active}>Dashboard Overview</a>
          <a href="#">Users</a>
          <a href="#">Settings</a>
        </nav>
        <form action={logout} className={styles.logoutForm}>
          <button type="submit" className={styles.logoutBtn}>Sign Out</button>
        </form>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Welcome, {profile?.display_name || user.email}</h1>
          <div className={styles.userBadge}>
            <span className={styles.role}>{profile?.role || 'User'}</span>
          </div>
        </header>

        <div className={styles.dashboardGrid}>
          <div className={styles.card}>
            <h3>Total Users</h3>
            <p className={styles.metric}>1,234</p>
          </div>
          <div className={styles.card}>
            <h3>Active Sessions</h3>
            <p className={styles.metric}>56</p>
          </div>
          <div className={styles.card}>
            <h3>System Status</h3>
            <p className={styles.metric} style={{ color: '#22c55e' }}>Healthy</p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <h2>Recent Activity</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.id.substring(0, 8)}...</td>
                <td>{user.email}</td>
                <td><span className={styles.badge}>{profile?.role || 'user'}</span></td>
                <td>Just now</td>
              </tr>
              {/* Add more dynamic rows here eventually */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
