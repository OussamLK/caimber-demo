import { useState } from 'react';
import { type MultiChoice } from '../aiQuery';

function pointsLabel(points: number) {
  if (points === 1 || points === -1) return `${points} point`;
  else return `${points} points`;
}

export default function MultiChoice({ q }: { q: MultiChoice }) {
  const [currentChoice, setCurrentChoice] = useState<number | undefined>(
    undefined
  );
  const currentGrade =
    currentChoice === q.correctAnswerId ? q.grading.correct : q.grading.wrong;
  console.debug(currentChoice);
  return (
    <div>
      <fieldset>
        <p className="font-bold">{q.questionStatement} </p>
        <p className="text-blue-800">
          Current grade is <span className="font-bold">{currentGrade}</span> (
          <span className="font-bold">Grading</span>: correct answer gets{' '}
          {pointsLabel(q.grading.correct)}, wrong answer gets{' '}
          {pointsLabel(q.grading.wrong)})
        </p>

        {q.choices.map(choice => (
          <div key={choice.id}>
            <label
              className={
                choice.id === q.correctAnswerId ? 'text-green-600' : ''
              }
              htmlFor={choice.id.toString()}
            >
              {choice.prompt}
            </label>
            <input
              type="radio"
              id={choice.id.toString()}
              name={`choices`}
              value={choice.id}
              onChange={() => setCurrentChoice(choice.id)}
            />
          </div>
        ))}
      </fieldset>
    </div>
  );
}
