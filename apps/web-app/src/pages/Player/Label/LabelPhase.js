import AnswerCarousel from "./AnswerCarousel/AnswerCarousel.js";
import PlayerSelector from "./PlayerSelector/PlayerSelector.js";
import { socket } from "../../../socket.js";
import { useState } from "react";
import Button from "../../../components/Button/Button.jsx";
import styles from "./LabelPhase.module.css";
import { jsx } from "react/jsx-runtime";

export default function LabelingPhase({
  allAnswers,
  sessionCode,
  onSubmitComplete,
  name,
}) {
  const answerEntries = Object.entries(allAnswers).filter(
    ([playerName]) => playerName !== name,
  );

  const sortedAnswerTexts = answerEntries.map(([_, answer]) => answer).sort();

  const playerNamesSorted = Object.keys(allAnswers)
    .filter((playerName) => playerName !== name)
    .sort();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [labelAssignments, setLabelAssignments] = useState({});
  console.log(`sorted answers - self ${sortedAnswerTexts}`);
  console.log(`sorted player names - self ${playerNamesSorted}`);

  const currentAuthorName = playerNamesSorted[currentCardIndex];

  const usedPlayerNames = new Set(Object.values(labelAssignments));
  const availablePlayerNames = playerNamesSorted.filter(
    (playerName) => !usedPlayerNames.has(playerName),
  );

  const handleNext = () => {
    setCurrentCardIndex((currentCardIndex + 1) % sortedAnswerTexts.length);
  };

  const handlePrevious = () => {
    setCurrentCardIndex(
      (currentCardIndex - 1 + sortedAnswerTexts.length) %
        sortedAnswerTexts.length,
    );
  };

  const handleTogglePlayer = (playerName) => {
    if (labelAssignments[currentAuthorName] === playerName) {
      const newAssignments = { ...labelAssignments };
      delete newAssignments[currentAuthorName];
      setLabelAssignments(newAssignments);
    } else {
      setLabelAssignments({
        ...labelAssignments,
        [currentAuthorName]: playerName,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(labelAssignments).length < sortedAnswerTexts.length) {
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
        currentAnswer={sortedAnswerTexts[currentCardIndex]}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <PlayerSelector
        playerNames={playerNamesSorted}
        availablePlayerNames={availablePlayerNames}
        selectedPlayerName={labelAssignments[currentAuthorName]}
        onTogglePlayer={handleTogglePlayer}
      />

      <div className={styles.bottom}>
        <Button
          variant="primary"
          size="s"
          onClick={handleSubmit}
          disabled={
            Object.keys(labelAssignments).length < sortedAnswerTexts.length
          }
        >
          submit
        </Button>
        {Object.keys(labelAssignments).length} / {sortedAnswerTexts.length}
      </div>
    </div>
  );
}
