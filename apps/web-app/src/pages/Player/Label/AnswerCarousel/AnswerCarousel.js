import { useSwipeable } from "react-swipeable";
import Button from "../../../../components/Button/Button.jsx";
import styles from "./AnswerCarousel.module.css";

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
    <div className={styles.carousel} {...handlers}>
      <Button
        variant="just-text"
        size="m"
        customColor="--base-black"
        onClick={onPrevious}
      >
        {"<"}
      </Button>

      <div className={styles.answer}>{currentAnswer}</div>

      <Button
        variant="just-text"
        size="m"
        customColor="--base-black"
        onClick={onNext}
      >
        {">"}
      </Button>
    </div>
  );
}
