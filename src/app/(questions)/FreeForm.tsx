import { type FreeForm } from '../aiQuery';

export default function FreeForm({ q }: { q: FreeForm }) {
  return (
    <div>
      <p className="font-bold">{q.questionStatement}</p>
      <input
        className="border-1 rounded-sm p-2 mt-2 w-1/2"
        type="text"
        id="freeform_answer"
        name="freeform_answer"
        placeholder="Your answer here"
      />
    </div>
  );
}
