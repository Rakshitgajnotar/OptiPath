import { GitGraph, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <GitGraph size={18} />
            <span>OptiPath</span>
          </Link>
          <p className={styles.tagline}>
            Graph algorithms, beautifully visualized.
          </p>
        </div>

        <div className={styles.links}>
          <Link to="/tsp">TSP Solver</Link>
          <Link to="/fuel">Fuel Optimizer</Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ghLink}
          >
            <Github size={14} />
            GitHub
          </a>
        </div>

        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} OptiPath. Built with React & Express.</p>
        </div>
      </div>
    </footer>
  );
}
