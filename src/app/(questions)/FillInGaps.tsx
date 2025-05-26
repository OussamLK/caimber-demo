import { useEffect, useState } from 'react';
import { type FillInGaps } from '../aiQuery';
import Grading from './Grading';

export default function FillInGapsComp({ q }: { q: FillInGaps }) {
  const [currentGrade, setCurrentGrade] = useState<number>(0);
  return (
    <div>
      <p className="font-bold">{q.questionStatement}</p>
      <Grading grading={q.grading} currentGrade={currentGrade} />
      <FillInGapsText q={q} setCurrentGrade={grade => setCurrentGrade(grade)} />
    </div>
  );
}

function FillInGapsText({
  q,
  setCurrentGrade,
}: {
  q: FillInGaps;
  setCurrentGrade: (grade: number) => void;
}) {
  const slices = splitTextAtGaps(q.textToFill);
  const inputSandwich = [<span key={0}>{slices[0]}</span>];
  const [gapValues, setGapValues] = useState<string[]>(
    Array(slices.length - 1).fill('')
  );
  const currentGrade = gapValues
    .map((v, i) =>
      v.toLocaleLowerCase() === q.gaps[i].correctAnswer.toLocaleLowerCase()
        ? q.grading.correct
        : q.grading.wrong
    )
    .reduce((s, i) => s + i);
  useEffect(() => {
    setCurrentGrade(currentGrade);
  }, [currentGrade]);
  const inputs: React.ReactNode[] = [];
  slices.slice(1).forEach((slice, key) => {
    const newInput = (
      <input
        value={gapValues[key]}
        onChange={e => {
          setGapValues(prev => [
            ...prev.slice(0, key),
            e.target.value,
            ...prev.slice(key + 1),
          ]);
        }}
        key={`${key + 1}-input`}
        className="border-1 m-1 rounded-sm"
      />
    );
    inputSandwich.push(newInput);
    inputs.push(newInput);
    inputSandwich.push(<span key={`${key + 1}-span`}>{slice}</span>);
  });

  return <p>{...inputSandwich}</p>;
}

type GapLocation = { start: number; end: number }; //end exlusive

function splitTextAtGaps(text: string): string[] {
  const chuncks: string[] = [];
  let lastGapEnd = 0;
  getGaps(text).forEach(gapLocation => {
    const chunck = text.slice(lastGapEnd, gapLocation.start);
    chuncks.push(chunck);
    lastGapEnd = gapLocation.end;
  });
  chuncks.push(text.slice(lastGapEnd));
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
