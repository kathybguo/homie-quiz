import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  size = "large",
  onClick,
  disabled = false,
  ...props
}) {
  return (
    <button
      className={styles.button}
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
