import { useState } from "react";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";

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
      newErrors.sessionCode = "Session code cannot be empty";
    }
    if (name.trim() === "") {
      newErrors.name = "Name cannot be empty";
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
  };

  return (
    <div>
      <h1>Join a Game</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Session Code"
            onChange={(e) => setSessionCode(e.target.value)}
          />
          {errors.sessionCode && (
            <span className="error">{errors.sessionCode}</span>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <button type="submit">Join</button>
      </form>
    </div>
  );
}
