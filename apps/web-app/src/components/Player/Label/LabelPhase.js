import AnswerCarousel from "./AnswerCarousel.js";
import PlayerSelector from "./PlayerSelector.js";
import { socket } from "../../../socket.js";
import { useState } from "react";

export default function LabelingPhase({
  allAnswers,
  playerNames,
  sessionCode,
  onSubmitComplete,
}) {
  const currentSocketId = socket.id;

  // State managed here
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [labelAssignments, setLabelAssignments] = useState({});
  // labelAssignments = { answerSocketId: guessedPlayerSocketId }

  const answerIds = Object.keys(allAnswers);
  const currentAnswerId = answerIds[currentCardIndex];

  // Derive which labels are used
  const usedPlayerIds = new Set(Object.values(labelAssignments));
  const availablePlayerIds = Object.keys(playerNames).filter(
    (id) => id !== currentSocketId && !usedPlayerIds.has(id)
  );

  // Handler for carousel navigation
  const handleNext = () => {
    setCurrentCardIndex((currentCardIndex + 1) % answerIds.length);
  };

  const handlePrevious = () => {
    setCurrentCardIndex(
      (currentCardIndex - 1 + answerIds.length) % answerIds.length
    );
  };

  const handleTogglePlayer = (playerSocketId) => {
    if (labelAssignments[currentAnswerId] === playerSocketId) {
      // Unassign if clicking the same player
      const newAssignments = { ...labelAssignments };
      delete newAssignments[currentAnswerId];
      setLabelAssignments(newAssignments);
    } else {
      // Assign this player
      setLabelAssignments({
        ...labelAssignments,
        [currentAnswerId]: playerSocketId,
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
    });
    onSubmitComplete();
  };

  return (
    <div>
      <h1>Who wrote this?</h1>

      <AnswerCarousel
        currentAnswer={allAnswers[currentAnswerId]}
        currentIndex={currentCardIndex}
        totalAnswers={answerIds.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <PlayerSelector
        playerNames={playerNames}
        availablePlayerIds={availablePlayerIds}
        selectedPlayerId={labelAssignments[currentAnswerId]}
        onTogglePlayer={handleTogglePlayer}
        currentSocketId={currentSocketId}
      />

      <div>
        Labeled: {Object.keys(labelAssignments).length} / {answerIds.length}
      </div>

      <button
        onClick={handleSubmit}
        disabled={Object.keys(labelAssignments).length < answerIds.length}
      >
        Submit Labels
      </button>
    </div>
  );
}
