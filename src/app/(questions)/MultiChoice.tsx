import { type MultiChoice } from '../aiQuery';

export default function MultiChoice({ q }: { q: MultiChoice }) {
  return (
    <div>
      <fieldset>
        <p className="font-bold">{q.questionStatement}</p>
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
            />
          </div>
        ))}
      </fieldset>
    </div>
  );
}
