import styles from "./PlayerSelector.module.css";
import Button from "../../../../components/Button/Button.jsx";

export default function PlayerSelector({
  playerNames,
  availablePlayerNames,
  selectedPlayerName,
  onTogglePlayer,
}) {
  return (
    <div className={styles.playerSelector}>
      <div className={styles.playerButtons}>
        {playerNames.map((name, index) => {
          const isSelected = selectedPlayerName === name;
          const isAvailable = availablePlayerNames.includes(name);
          const isDisabled = !isSelected && !isAvailable;

          const bgColor = isDisabled
            ? "var(--base-medium-grey)"
            : `var(--player-color-${(index % 6) + 1})`;

          return (
            <Button
              key={name}
              onClick={() => onTogglePlayer(name)}
              disabled={isDisabled}
              variant="primary"
              size="s"
              backgroundColor={bgColor}
              className={isSelected ? styles.selected : ""}
            >
              {name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
