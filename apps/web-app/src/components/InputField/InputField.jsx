import styles from "./InputField.module.css";

export default function InputField({
  placeholder = "",
  value,
  onChange,
  error,
  type = "text",
  variant = "default",
}) {
  return (
    <div className={styles.inputWrapper}>
      <input
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        data-variant={variant}
      />
    </div>
  );
}
