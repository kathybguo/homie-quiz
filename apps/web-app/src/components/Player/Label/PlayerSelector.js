export default function PlayerSelector({
  playerNames,
  availablePlayerIds,
  selectedPlayerId,
  onTogglePlayer,
  currentSocketId,
}) {
  return (
    <div className="player-selector">
      <h3>Select a player:</h3>

      <div className="player-buttons">
        {Object.entries(playerNames)
          .filter(([socketId]) => socketId !== currentSocketId)
          .map(([socketId, name]) => {
            const isSelected = selectedPlayerId === socketId;
            const isAvailable = availablePlayerIds.includes(socketId);
            const isDisabled = !isSelected && !isAvailable;

            return (
              <button
                key={socketId}
                onClick={() => onTogglePlayer(socketId)}
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
