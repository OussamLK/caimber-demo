import { useState } from 'react';
import { type MultiChoice } from '../aiQuery';
import Grading from './Grading';

export default function MultiChoice({
  q,
  id,
}: {
  q: MultiChoice;
  id: string | number;
}) {
  const [currentChoice, setCurrentChoice] = useState<number | undefined>(
    undefined
  );
  const currentGrade =
    currentChoice === q.correctAnswerId ? q.grading.correct : q.grading.wrong;
  return (
    <div>
      <fieldset>
        <p className="font-bold">{q.questionStatement} </p>
        <Grading grading={q.grading} currentGrade={currentGrade} />
        {q.choices.map(choice => (
          <div key={choice.id}>
            <label
              className={`${choice.id === q.correctAnswerId ? 'font-semibold' : ''}`}
              htmlFor={choice.id.toString()}
            >
              {choice.prompt}
            </label>
            <input
              className="ml-2 accent-slate-600"
              type="radio"
              id={choice.id.toString()}
              name={`choices_${id}`}
              value={choice.id}
              onChange={() => setCurrentChoice(choice.id)}
            />
          </div>
        ))}
      </fieldset>
    </div>
  );
}
