import "./ScoresPhase.css";

export default function ScoresPhase({ playerScores, onComplete }) {
  // Convert to array and sort by score descending
  const sortedPlayers = Object.entries(playerScores)
    .map(([name, score]) => ({
      name,
      score,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Take top 10

  return (
    <div className="scores-container">
      <div className="scores-header">
        <h1>🏆 Leaderboard 🏆</h1>
      </div>

      <div className="leaderboard">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.name}
            className={`leaderboard-row ${index < 3 ? `rank-${index + 1}` : ""}`}
          >
            <div className="rank">
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `#${index + 1}`}
            </div>
            <div className="player-name">{player.name}</div>
            <div className="player-score">{player.score}</div>
          </div>
        ))}
      </div>

      <button className="continue-button" onClick={onComplete}>
        Continue
      </button>
    </div>
  );
}
