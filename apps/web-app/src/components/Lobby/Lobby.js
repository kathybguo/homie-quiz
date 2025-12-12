import { useParams } from "react-router-dom";

export default function Lobby() {
  const { sessionCode } = useParams();
  console.log("Lobby session code:", sessionCode);
  return (
    <div>
      <h1>Lobby</h1>
      <h2>Session Code: {sessionCode}</h2>
    </div>
  );
}
