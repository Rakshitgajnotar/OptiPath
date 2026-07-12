import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Route as RouteIcon,
  Fuel,
  Sparkles,
  MousePointerClick,
  Layers,
  ArrowRight,
  Cpu,
  GitGraph,
} from 'lucide-react';
import Badge from '../components/common/Badge.jsx';
import styles from './HomePage.module.css';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        {/* Animated background nodes */}
        <div className={styles.bgDecoration} aria-hidden="true">
          <div className={styles.floatNode} style={{ top: '15%', left: '10%', animationDelay: '0s' }} />
          <div className={styles.floatNode} style={{ top: '70%', left: '8%', animationDelay: '1.5s' }} />
          <div className={styles.floatNode} style={{ top: '20%', right: '12%', animationDelay: '0.8s' }} />
          <div className={styles.floatNode} style={{ top: '65%', right: '15%', animationDelay: '2s' }} />
          <div className={styles.floatNode} style={{ top: '40%', right: '5%', animationDelay: '0.4s' }} />
          <div className={styles.floatLine} style={{ top: '25%', left: '15%', width: '120px', transform: 'rotate(35deg)' }} />
          <div className={styles.floatLine} style={{ top: '60%', right: '18%', width: '100px', transform: 'rotate(-20deg)' }} />
        </div>

        <motion.div
          className={styles.heroContent}
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <Badge variant="default" size="lg" dot>
              Algorithm Visualizer
            </Badge>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Visualize Graph
            <br />
            Algorithms in{' '}
            <span className="gradient-text">Real-Time</span>
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore the Traveling Salesman Problem and Fuel Optimization with
            interactive, step-by-step visualizations powered by advanced
            algorithms.
          </motion.p>

          <motion.div
            className={styles.heroActions}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/tsp" className={styles.ctaCard}>
              <div className={styles.ctaIconWrap} data-variant="secondary">
                <RouteIcon size={24} />
              </div>
              <div className={styles.ctaText}>
                <span className={styles.ctaTitle}>TSP Solver</span>
                <span className={styles.ctaDesc}>
                  Find the shortest tour
                </span>
              </div>
              <ArrowRight size={18} className={styles.ctaArrow} />
            </Link>

            <Link to="/fuel" className={styles.ctaCard}>
              <div className={styles.ctaIconWrap} data-variant="accent">
                <Fuel size={24} />
              </div>
              <div className={styles.ctaText}>
                <span className={styles.ctaTitle}>Fuel Optimizer</span>
                <span className={styles.ctaDesc}>
                  Minimize traversal fuel
                </span>
              </div>
              <ArrowRight size={18} className={styles.ctaArrow} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <motion.div
          className={styles.featuresInner}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.h2
            className={styles.sectionTitle}
            variants={fadeUp}
            transition={{ duration: 0.4 }}
          >
            Why OptiPath?
          </motion.h2>

          <div className={styles.featureGrid}>
            {[
              {
                icon: MousePointerClick,
                title: 'Interactive Graphs',
                desc: 'Drag, zoom, and pan SVG-rendered graphs. Build your graph and watch it come alive.',
                color: 'var(--color-primary)',
              },
              {
                icon: Sparkles,
                title: 'Step-by-Step Simulation',
                desc: 'Watch algorithms execute with animated path tracing and node highlighting at your own pace.',
                color: 'var(--color-secondary)',
              },
              {
                icon: Cpu,
                title: 'Optimized Algorithms',
                desc: 'Floyd-Warshall + DP Bitmask for TSP, DFS with bottom-up collection for Fuel optimization.',
                color: 'var(--color-accent)',
              },
              {
                icon: Layers,
                title: 'Beautiful Design',
                desc: 'Dark theme with glassmorphism, smooth animations, and a responsive layout across all devices.',
                color: 'var(--color-warning)',
              },
              {
                icon: GitGraph,
                title: 'Smart Layouts',
                desc: 'Force-directed layout for general graphs, hierarchical tree layout for fuel optimizer.',
                color: 'var(--color-primary-hover)',
              },
              {
                icon: RouteIcon,
                title: 'Path Visualization',
                desc: 'See the optimal path highlighted with animated glowing edges and detailed cost breakdown.',
                color: 'var(--color-secondary-hover)',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className={styles.featureCard}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div
                  className={styles.featureIcon}
                  style={{ '--feature-color': feature.color }}
                >
                  <feature.icon size={22} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Algorithm Overview */}
      <section className={styles.algorithms}>
        <motion.div
          className={styles.algoInner}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.h2
            className={styles.sectionTitle}
            variants={fadeUp}
            transition={{ duration: 0.4 }}
          >
            Algorithms
          </motion.h2>

          <div className={styles.algoGrid}>
            <motion.div
              className={styles.algoCard}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.algoHeader}>
                <RouteIcon size={20} style={{ color: 'var(--color-secondary)' }} />
                <h3>Traveling Salesman Problem</h3>
                <Badge variant="secondary" size="sm">O(n² × 2ⁿ)</Badge>
              </div>
              <p className={styles.algoDesc}>
                Uses <strong>Floyd-Warshall</strong> for all-pairs shortest paths combined with{' '}
                <strong>Dynamic Programming + Bitmask</strong> to find the minimum-cost Hamiltonian
                cycle through all nodes.
              </p>
            </motion.div>

            <motion.div
              className={styles.algoCard}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className={styles.algoHeader}>
                <Fuel size={20} style={{ color: 'var(--color-accent)' }} />
                <h3>Fuel Optimization</h3>
                <Badge variant="accent" size="sm">O(n)</Badge>
              </div>
              <p className={styles.algoDesc}>
                Uses <strong>Depth-First Search (DFS)</strong> with bottom-up traversal to calculate
                the minimum fuel needed to transport representatives from leaf nodes to the root,
                optimizing car pooling.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
