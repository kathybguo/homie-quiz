import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  size = "large",
  customColor,
  backgroundColor,
  onClick,
  disabled = false,
  className = "",
  ...props
}) {
  const style = {};

  if (customColor) {
    style["--custom-color"] = customColor;
  }

  if (backgroundColor) {
    style["--bg-color"] = backgroundColor;
  }

  return (
    <button
      className={`${styles.button} ${className}`}
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
