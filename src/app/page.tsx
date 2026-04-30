import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.description}>
          Welcome to the new premium admin dashboard.
        </p>
        <div className={styles.actions}>
          <a href="/login" className={styles.primaryButton}>
            Login
          </a>
          <a href="/signup" className={styles.secondaryButton}>
            Sign Up
          </a>
        </div>
      </main>
    </div>
  );
}
