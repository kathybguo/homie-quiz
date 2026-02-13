import styles from "./GradientBackground.module.css";

export default function GradientBackground({
  children,
  variant = "host-landing",
}) {
  return (
    <div className={styles.background} data-variant={variant}>
      {children}
    </div>
  );
}
