import AnswerCarousel from "./AnswerCarousel/AnswerCarousel.js";
import PlayerSelector from "./PlayerSelector/PlayerSelector.js";
import { socket } from "../../../socket.js";
import { useState } from "react";
import Button from "../../../components/Button/Button.jsx";
import styles from "./LabelPhase.module.css";
import { shuffleArray } from "@hq/utils";

export default function LabelingPhase({
  allAnswers,
  sessionCode,
  onSubmitComplete,
  name,
}) {
  // Create filtered answers once on mount
  const [filteredAnswers] = useState(() =>
    Object.fromEntries(
      Object.entries(allAnswers).filter(([playerName]) => playerName !== name),
    ),
  );

  // Shuffle player names once
  const [allPlayerNames] = useState(() =>
    shuffleArray(Object.keys(allAnswers)),
  );

  const [filteredNames] = useState(() =>
    shuffleArray(allPlayerNames.filter((playerName) => playerName !== name)),
  );

  // State managed here
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [labelAssignments, setLabelAssignments] = useState({});

  // Shuffle the answer IDs once from the stable filteredAnswers
  const [answerIds] = useState(() =>
    shuffleArray(Object.keys(filteredAnswers)),
  );

  const currentAnswerId = answerIds[currentCardIndex];

  // Derive which labels are used
  const usedPlayerNames = new Set(Object.values(labelAssignments));
  const availablePlayerNames = filteredNames.filter(
    (playerName) => !usedPlayerNames.has(playerName),
  );

  // Handler for carousel navigation
  const handleNext = () => {
    setCurrentCardIndex((currentCardIndex + 1) % answerIds.length);
  };

  const handlePrevious = () => {
    setCurrentCardIndex(
      (currentCardIndex - 1 + answerIds.length) % answerIds.length,
    );
  };

  const handleTogglePlayer = (playerName) => {
    if (labelAssignments[currentAnswerId] === playerName) {
      // Unassign if clicking the same player
      const newAssignments = { ...labelAssignments };
      delete newAssignments[currentAnswerId];
      setLabelAssignments(newAssignments);
    } else {
      // Assign this player
      setLabelAssignments({
        ...labelAssignments,
        [currentAnswerId]: playerName,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(labelAssignments).length < answerIds.length) {
      alert("Please label all answers");
      return;
    }
    socket.emit("submit-labels", {
      code: sessionCode,
      assignments: labelAssignments,
      name: name,
    });
    onSubmitComplete();
  };

  return (
    <div className={styles.container}>
      <AnswerCarousel
        currentAnswer={filteredAnswers[currentAnswerId]}
        currentIndex={currentCardIndex}
        totalAnswers={answerIds.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <PlayerSelector
        playerNames={filteredNames}
        availablePlayerNames={availablePlayerNames}
        selectedPlayerName={labelAssignments[currentAnswerId]}
        onTogglePlayer={handleTogglePlayer}
      />

      <div className={styles.bottom}>
        <Button
          variant="primary"
          size="s"
          onClick={handleSubmit}
          disabled={Object.keys(labelAssignments).length < answerIds.length}
        >
          submit
        </Button>
        {Object.keys(labelAssignments).length} / {answerIds.length}
      </div>
    </div>
  );
}
