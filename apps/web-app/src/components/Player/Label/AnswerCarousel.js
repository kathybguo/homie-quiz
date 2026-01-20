import { useSwipeable } from "react-swipeable";

export default function AnswerCarousel({
  currentAnswer,
  currentIndex,
  totalAnswers,
  onNext,
  onPrevious,
}) {
  const handlers = useSwipeable({
    onSwipedLeft: () => onNext(),
    onSwipedRight: () => onPrevious(),
    preventScrollOnSwipe: true,
    trackMouse: true, // allows testing with mouse on desktop
  });
  return (
    <div className="carousel" {...handlers}>
      <button onClick={onPrevious}>← Previous</button>

      <div className="answer-card">
        <p>{currentAnswer}</p>
      </div>

      <button onClick={onNext}>Next →</button>

      {/* Optional: dot indicators */}
      <div className="dots">
        {Array.from({ length: totalAnswers }).map((_, i) => (
          <span key={i} className={i === currentIndex ? "dot active" : "dot"} />
        ))}
      </div>
    </div>
  );
}
