import { type FillInGaps } from '../(questions)/FillInGaps';

export default function FillInGapsComp({ q }: { q: FillInGaps }) {
  return (
    <div>
      <p className="font-bold">{q.questionStatement}</p>
      <FillInGapsText text={q.textToFill} />
    </div>
  );
}

function FillInGapsText({ text }: { text: string }) {
  const slices = splitTextAtGaps(text);
  const inputSandwich = [<span key={0}>{slices[0]}</span>];
  slices.slice(1).forEach((slice, key) => {
    inputSandwich.push(
      <input key={`${key + 1}-input`} className="border-1 m-1 rounded-sm" />
    );
    inputSandwich.push(<span key={`${key + 1}-span`}>{slice}</span>);
  });
  return <p>{...inputSandwich}</p>;
}

type GapLocation = { start: number; end: number }; //end exlusive

function splitTextAtGaps(text: string): string[] {
  const chuncks: string[] = [];
  let lastGapEnd = 0;
  console.debug(`gaps are ${getGaps(text)}`);
  getGaps(text).forEach(gapLocation => {
    const chunck = text.slice(lastGapEnd, gapLocation.start);
    chuncks.push(chunck);
    lastGapEnd = gapLocation.end;
  });
  chuncks.push(text.slice(lastGapEnd));
  console.debug(`returning chuncks ${JSON.stringify(chuncks)}`);
  return chuncks;
}

function getGaps(text: string): GapLocation[] {
  // match all substrings that are at least 3 underscores long
  const regex = /_{3,}/g;
  const matches = text.matchAll(regex);
  return [...matches].map(m => ({
    start: m.index,
    end: m.index + m[0].length,
  }));
}
