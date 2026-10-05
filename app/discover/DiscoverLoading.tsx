import styles from './Discover.module.css';
export default function DiscoverLoading(){return <section className={styles.loading} role="status" aria-busy="true"><div className={styles.loadingPortrait}/><div><h2>Đang tải những mảnh ghép…</h2><p>Danh sách thành viên đang được cập nhật.</p><div className={styles.loadingLine}/><div className={styles.loadingLine}/></div></section>;}
