import { type Question } from '../aiQuery';
import MultiChoice from './MultiChoice';
import FreeForm from './FreeForm';
import FillInGapsComp from './FillInGaps';

export default function RenderQuestion({
  q,
  key,
}: {
  q: Question;
  key: string | number;
}) {
  if (q.type === 'MultiChoice') {
    return <MultiChoice key={key} q={q} />;
  } else if (q.type === 'FreeForm') {
    return <FreeForm q={q} />;
  } else if (q.type === 'FillInGaps') {
    return <FillInGapsComp q={q} />;
  } else {
    //checking whether the if block exhausts the Question type
    const e: never = q;
  }
}
