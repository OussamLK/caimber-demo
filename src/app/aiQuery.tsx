'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import MLL from '../mll';
import SubmitButton from './SubmitButton';
import FillInGapsComp from './(questions)/FillInGaps';
import MultiChoice from './(questions)/MultiChoice';
import FreeForm from './(questions)/FreeForm';
import RenderQuestion from './(questions)/RenderQuestion';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const lotrExcerpt = `Consulting  him  constantly  upon  the  growing  of  vegetables in  the  matter  of  ‘roots’,  especially  potatoes,  the  Gaffer  was recognized  as  the  leading  authority  by  all  in  the  neighbourhood  (including  himself). 

‘But  what  about  this  Frodo  that  lives  with  him?’  asked  Old Noakes  of  Bywater.  ‘Baggins  is  his  name,  but  he’s  more  than half  a  Brandybuck,  they  say.  It  beats  me  why  any  Baggins of  Hobbiton  should  go  looking  for  a  wife  away  there  in Buckland,  where  folks  are  so  queer.’ 

‘And  no  wonder  they’re  queer,’  put  in  Daddy  Twofoot (the  Gaffer’s  next-door  neighbour),  ‘if  they  live  on  the  wrong side  of  the  Brandywine  River,  and  right  agin  the  Old  Forest. That’s  a  dark  bad  place,  if  half  the  tales  be  true.’ 

‘You’re  right,  Dad!’  said  the  Gaffer.  ‘Not  that  the  Brandybucks  of  Buckland  live  in  the  Old  Forest;  but  they’re  a  queer breed,  seemingly.  They  fool  about  with  boats  on  that  big river  -  and  that  isn’t  natural.  Small  wonder  that  trouble  cameof  it,  I  say.  But  be  that  as  it  may,  Mr.  Frodo  is  as  nice  a young  hobbit  as  you  could  wish  to  meet.  Very  much  like Mr.  Bilbo,  and  in  more  than  looks.  After  all  his  father  was a  Baggins.  A  decent  respectable  hobbit  was  Mr.  Drogo Baggins;  there  was  never  much  to  tell  of  him,  till  he  was drownded.’ 
`;

export type Question = FillInGaps | MultiChoice | FreeForm;
export type FillInGaps = {
  //use underscores ______ to mark the gaps in the text
  type: 'FillInGaps';
  questionStatement: string;
  textToFill: string;
  gaps: Gap[];
  grading: Grading;
};
export type MultiChoice = {
  type: 'MultiChoice';
  questionStatement: string;
  choices: Choice[];
  correctAnswerId: number;
  grading: Grading;
};
export type FreeForm = {
  type: 'FreeForm';
  questionStatement: string;
  AnswerExpectedToContain: string;
  grading: Grading;
};
type Grading = { correct: number; wrong: number };
type Gap = { id: number; Prompt: string; correctAnswer: string };
type Choice = { id: number; prompt: string };

const questionSyntaxString = `
  type Questions = FillInGaps | MultiChoice | FreeForm
type Grading = {correct: number, wrong: number}
type Gap = {id: number, Prompt: string, correctAnswer: string}
type FillInGaps = {
  //use underscores _______ to mark the gaps in the text
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
  queryServerAction: (q: string) => Promise<object>;
}) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(
    undefined
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [textValue, setTextValue] = useState<string>(lotrExcerpt);
  const currentQuestionRef = useRef<HTMLDivElement | null>(null);
  const mll = useMemo<MLL<Question>>(
    //MLL has an internal history state that I want to keep between renders
    () => new MLL<Question>(queryServerAction, questionSyntaxString),
    [questionSyntaxString]
  );
  function keepCurrentQuestion() {
    if (currentQuestion === undefined) {
      throw 'adding an undefined question';
    }
    setQuestions(questions => [...questions, currentQuestion]);
    setCurrentQuestion(undefined);
  }

  useEffect(() => {
    if (currentQuestionRef.current !== null) {
      currentQuestionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestion]);

  return (
    <div className="flex gap-8 box-border">
      <div className="flex-2 order-2 pt-28 h-screen overflow-y-scroll m-auto">
        <div className="w-4/5 m-auto">
          <textarea
            className="border-solid border-2 ml-2 mb-4 p-4 rounded-xl"
            rows={13}
            cols={60}
            value={textValue}
            onChange={e => setTextValue(e.currentTarget.value)}
          />
          {questions && <QuestionList questions={questions} />}
          {currentQuestion && (
            <div ref={currentQuestionRef} className="m-2 mt-4">
              <RenderQuestion q={currentQuestion} />
              <button
                onClick={keepCurrentQuestion}
                className="bg-blue-900 block text-white mt-8 mr-0 ml-auto p-2 rounded-md font-bold"
              >
                Keep this question
              </button>
            </div>
          )}
        </div>
      </div>
      <ChatBox
        className="border-r-2 p-20 pl-3 pr-4 flex-1 order-1 min-w-min h-screen"
        setQuestion={(question: Question) => {
          setCurrentQuestion(question);
        }}
        askQuestion={mll.makeQuery}
        textValue={textValue}
      />
    </div>
  );
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
    State?: Record<string, object>
  ) => Promise<Question>;
  textValue: string;
}) {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  function doAskQuestion() {
    setIsLoading(true);
    askQuestion(
      query,
      `This is an assessement for kids on the paragraph '''${textValue}'''`
    )
      .then(a => {
        console.log(`The llm answered ${JSON.stringify(a)}`);
        setQuestion(a);
      })
      .catch(e =>
        console.error(`error when interogating llm ${(e as Error).message}`)
      )
      .finally(() => {
        setIsLoading(false);
        setQuery('');
      });
  }

  return (
    <div className={className}>
      <div className="mt-auto mb-1 p-2">
        <br />
        <Label htmlFor={'query'} className="mb-4 flex-col text-lg">
          <span className="font-bold">
            What question do you want to create?
          </span>{' '}
          <span className="text-sm">
            (I can do free form, multiple choice, and fill in the gaps
            questions)
          </span>
        </Label>
        <Textarea
          value={query}
          id={'query'}
          onKeyDown={e => {
            if (e.key == 'Enter') doAskQuestion();
          }}
          onChange={e => setQuery(e.currentTarget.value)}
          className="border-solid box-border border-2 mr-4 mb-4 p-2 min-w-full resize-none"
        ></Textarea>
        <SubmitButton
          className="block box-border mr-0 ml-auto"
          isLoading={isLoading}
          onClick={doAskQuestion}
        />
      </div>
    </div>
  );
}

function QuestionList({ questions }: { questions: Question[] }) {
  return (
    <ul className="m-4">
      {questions.map((q, key) => (
        <li className="list-decimal mb-8" key={key}>
          <RenderQuestion q={q} />
        </li>
      ))}
    </ul>
  );
}
