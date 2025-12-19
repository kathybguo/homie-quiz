import { useParams } from "react-router-dom";

export default function Lobby() {
  const { code } = useParams();
  return (
    <div>
      <h1>Lobby</h1>
      <h2>Session Code: {code}</h2>
    </div>
  );
}
