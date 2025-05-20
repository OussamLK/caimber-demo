'use client';
import { useEffect, useMemo, useState } from 'react';
import MLL from '../mll';

const lotrExcerpt = `Consulting  him  constantly  upon  the  growing  of  vegetables in  the  matter  of  ‘roots’,  especially  potatoes,  the  Gaffer  was recognized  as  the  leading  authority  by  all  in  the  neighbourhood  (including  himself). 

‘But  what  about  this  Frodo  that  lives  with  him?’  asked  Old Noakes  of  Bywater.  ‘Baggins  is  his  name,  but  he’s  more  than half  a  Brandybuck,  they  say.  It  beats  me  why  any  Baggins of  Hobbiton  should  go  looking  for  a  wife  away  there  in Buckland,  where  folks  are  so  queer.’ 

‘And  no  wonder  they’re  queer,’  put  in  Daddy  Twofoot (the  Gaffer’s  next-door  neighbour),  ‘if  they  live  on  the  wrong side  of  the  Brandywine  River,  and  right  agin  the  Old  Forest. That’s  a  dark  bad  place,  if  half  the  tales  be  true.’ 

‘You’re  right,  Dad!’  said  the  Gaffer.  ‘Not  that  the  Brandybucks  of  Buckland  live  in  the  Old  Forest;  but  they’re  a  queer breed,  seemingly.  They  fool  about  with  boats  on  that  big river  -  and  that  isn’t  natural.  Small  wonder  that  trouble  cameof  it,  I  say.  But  be  that  as  it  may,  Mr.  Frodo  is  as  nice  a young  hobbit  as  you  could  wish  to  meet.  Very  much  like Mr.  Bilbo,  and  in  more  than  looks.  After  all  his  father  was a  Baggins.  A  decent  respectable  hobbit  was  Mr.  Drogo Baggins;  there  was  never  much  to  tell  of  him,  till  he  was drownded.’ 
`;

export type Question = FillInGaps | MultiChoice | FreeForm;
type FillInGaps = {
  type: 'FillInGaps';
  questionStatement: string;
  textToFill: string;
  gaps: Gap[];
  grading: Grading;
};
type MultiChoice = {
  type: 'MultiChoice';
  questionStatement: string;
  choices: Choice[];
  correctAnswerId: number;
  grading: Grading;
};
type FreeForm = {
  type: 'FreeForm';
  questionStatement: string;
  AnswerExpectedToContain: string;
  grading: Grading;
};
type Grading = { correct: number; wrong: number };
type Gap = { Prompt: string; correctAnswer: string };
type Choice = { id: number; prompt: string };

const QuestionSyntaxString = `
  type Questions = FillInGaps | MultiChoice | FreeForm
type Grading = {correct: number, wrong: number}
type Gap = {Prompt: string, correctAnswer: string}
type FillInGaps = {
	type: "FillInGaps",
	questionStatement: string,
	textToFill: string,
	gaps: Gap[],
	grading: Grading
}
type MultiChoice = {
	type: "MultiChoice",
	questionStatement: string,
	choices: Choice[],
	correctAnswerId: number,
	grading: Grading
}
type FreeForm = {
	type: "FreeForm",
	questionStatement: string,
	AnswerExpectedToContain: string,
	grading: Grading

}

type Grading = { correct: number; wrong: number };
type Gap = { Prompt: string; correctAnswer: string };
type Choice = { id: number; prompt: string };

`;

export default function AiQuery({
  queryServerAction,
}: {
  queryServerAction: (q: string) => Promise<Object>;
}) {
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [textValue, setTextValue] = useState<string>(lotrExcerpt);
  const mll = useMemo<MLL<Question>>(
    //MLL has an internal history state that I want to keep between renders
    () => new MLL<Question>(queryServerAction, QuestionSyntaxString),
    []
  );
  function parseAnswer(answer: Record<string, any>) {
    if (answer.type === 'TextAnswer') {
    }
  }
  return (
    <div className="flex gap-2">
      <div className="flex-2 order-2">
        <textarea
          className="border-solid border-2 ml-2 p-4 "
          rows={10}
          cols={70}
          value={textValue}
          onChange={e => setTextValue(e.currentTarget.value)}
        />
        {question && (
          <div className="m-2 mt-4">
            <QuestionSematic q={question} />
          </div>
        )}
      </div>
      <ChatBox
        className="border-2 p-2 flex-1 order-1 min-w-min h-screen"
        setQuestion={(question: Question) => {
          setQuestion(question);
        }}
        askQuestion={mll.makeQuery}
        textValue={textValue}
      />
    </div>
  );
}

export function QuestionSematic({ q }: { q: Question }) {
  if (q.type === 'MultiChoice') {
    return (
      <div>
        <p>{q.questionStatement}</p>
        <fieldset>
          <legend className="font-bold">Choose one answer:</legend>
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
  } else if (q.type === 'FreeForm') {
    return (
      <div>
        <p>{q.questionStatement}</p>
        <input
          type="text"
          id="freeform_answer"
          name="freeform_answer"
          placeholder="Your answer here"
        />
      </div>
    );
  } else if (q.type === 'FillInGaps') {
    return (
      <div>
        <p className="font-bold">{q.questionStatement}</p>
        <p>{q.textToFill}</p>
      </div>
    );
  }
}

function ChatBox({
  setQuestion,
  textValue,
  askQuestion,
  className,
}: {
  className: string;
  setQuestion: (question: Question) => void;
  askQuestion: (
    query: string,
    context: string,
    State?: Record<string, any>
  ) => Promise<Question>;
  textValue: string;
}) {
  const [query, setQuery] = useState<string>('');
  function doAskQuestion() {
    askQuestion(
      query,
      `This is an assessement for kids on the paragraph '''${textValue}'''`
    ).then(a => {
      console.log(`The llm answered ${JSON.stringify(a)}`);
      setQuestion(a);
    });
  }
  return (
    <div className={className}>
      <div className="mt-auto mb-1">
        <br />
        <label>
          What question do you want to create?
          <input
            value={query}
            onKeyDown={e => {
              if (e.key == 'Enter') doAskQuestion();
            }}
            onChange={e => setQuery(e.currentTarget.value)}
            className="border-solid border-2 m-2 p-2 min-w-1/2"
          ></input>
        </label>
        <button
          onClick={() => doAskQuestion()}
          className="bg-sky-700 p-4 m-2 text-white rounded-lg"
        >
          Create
        </button>
      </div>
    </div>
  );
}
