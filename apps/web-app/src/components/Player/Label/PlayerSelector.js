export default function PlayerSelector({
  playerNames,
  availablePlayerNames,
  selectedPlayerName,
  onTogglePlayer,
}) {
  return (
    <div className="player-selector">
      <h3>Select a player:</h3>

      <div className="player-buttons">
        {playerNames.map((name) => {
          const isSelected = selectedPlayerName === name;
          const isAvailable = availablePlayerNames.includes(name);
          const isDisabled = !isSelected && !isAvailable;

          return (
            <button
              key={name}
              onClick={() => onTogglePlayer(name)}
              disabled={isDisabled}
              className={isSelected ? "selected" : ""}
            >
              {name}
              {isSelected && " ✓"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
