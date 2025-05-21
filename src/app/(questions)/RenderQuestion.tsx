import { type Question } from '../aiQuery';
import MultiChoice from './MultiChoice';
import FreeForm from './FreeForm';
import FillInGapsComp from './FillInGaps';

export default function RenderQuestion({ q }: { q: Question }) {
  if (q.type === 'MultiChoice') {
    return <MultiChoice q={q} />;
  } else if (q.type === 'FreeForm') {
    return <FreeForm q={q} />;
  } else if (q.type === 'FillInGaps') {
    return <FillInGapsComp q={q} />;
  } else {
    const e: never = q;
  }
}
