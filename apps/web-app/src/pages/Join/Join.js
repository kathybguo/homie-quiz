import { useState } from "react";
import { socket } from "../../socket.js";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button.jsx";
import InputField from "../../components/InputField/InputField.jsx";
import styles from "./Join.module.css";

export default function Join() {
  const [sessionCode, setSessionCode] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    // default reloads the page on form submit, we don't want that
    e.preventDefault();

    // check that inputs are not blank
    const newErrors = {};

    if (sessionCode.trim() === "") {
      newErrors.sessionCode = "game code cannot be empty";
    }
    if (name.trim() === "") {
      newErrors.name = "name cannot be empty";
    }

    // return if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // passed the checks so clear the errors
    setErrors({});
    console.log("Valid! Submitting:", {
      sessionCode: sessionCode.toUpperCase(),
      name: name,
    });

    // do a check that the name and session code are not just empty strings
    console.log("Joining session...", sessionCode, name);
    socket.emit("join-session", {
      code: sessionCode.toUpperCase(),
      name: name,
    });

    socket.once("join-success", ({ code }) => {
      navigate(`/${code}/${name}`);
    });

    socket.once("join-failure", ({ message }) => {
      setErrors({ general: message });
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errors.general && <div className={styles.error}>{errors.general}</div>}
        {errors.sessionCode && (
          <span className={styles.error}>{errors.sessionCode}</span>
        )}
        <InputField
          placeholder="code"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
          error={errors.sessionCode}
        />

        <InputField
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}

        <Button variant="glass" size="s" type="submit">
          play
        </Button>
      </form>
    </div>
  );
}
