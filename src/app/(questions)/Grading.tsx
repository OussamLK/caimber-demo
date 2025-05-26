function pointsLabel(points: number) {
  if (points === 1 || points === -1) return `${points} point`;
  else return `${points} points`;
}
export default function Grading({
  grading,
  currentGrade,
}: {
  grading: { correct: number; wrong: number };
  currentGrade: number;
}) {
  return (
    <>
      <p className="text-gray-600 text-sm italic mb-2">
        Current grade is <span className="font-bold">{currentGrade}</span> (
        <span className="font-bold">Grading</span>: correct answer gets{' '}
        {pointsLabel(grading.correct)}, wrong answer gets{' '}
        {pointsLabel(grading.wrong)})
      </p>
    </>
  );
}
