import { useState } from 'react';
import { type MultiChoice } from '../aiQuery';
import Grading from './Grading';

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
        <Grading grading={q.grading} currentGrade={currentGrade} />
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
