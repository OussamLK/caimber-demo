'use client';
import { useState } from 'react';
import { type Question } from './page';

const lotrExerpt = `consulting  him  constantly  upon  the  growing  of  vegetables  - 
in  the  matter  of  ‘roots’,  especially  potatoes,  the  Gaffer  was 
recognized  as  the  leading  authority  by  all  in  the  neighbour¬ 
hood  (including  himself) . 

‘But  what  about  this  Frodo  that  lives  with  him?’  asked  Old 
Noakes  of  Bywater.  ‘Baggins  is  his  name,  but  he’s  more  than 
half  a  Brandybuck,  they  say.  It  beats  me  why  any  Baggins 
of  Hobbiton  should  go  looking  for  a  wife  away  there  in 
Buckland,  where  folks  are  so  queer.’ 

‘And  no  wonder  they’re  queer,’  put  in  Daddy  Twofoot 
(the  Gaffer’s  next-door  neighbour),  ‘if  they  live  on  the  wrong 
side  of  the  Brandywine  River,  and  right  agin  the  Old  Forest. 
That’s  a  dark  bad  place,  if  half  the  tales  be  true.’ 

‘You’re  right,  Dad!’  said  the  Gaffer.  ‘Not  that  the  Brandy- 
bucks  of  Buckland  live  in  the  Old  Forest;  but  they’re  a  queer 
breed,  seemingly.  They  fool  about  with  boats  on  that  big 
river  -  and  that  isn’t  natural.  Small  wonder  that  trouble  came 
of  it,  I  say.  But  be  that  as  it  may,  Mr.  Frodo  is  as  nice  a 
young  hobbit  as  you  could  wish  to  meet.  Very  much  like 
Mr.  Bilbo,  and  in  more  than  looks.  After  all  his  father  was 
a  Baggins.  A  decent  respectable  hobbit  was  Mr.  Drogo 
Baggins;  there  was  never  much  to  tell  of  him,  till  he  was 
drownded.’ 
`;

export default function AiQuery({
  askQuestion,
}: {
  askQuestion: (
    query: string,
    context: string,
    history: string[]
  ) => Promise<Question>;
}) {
  const [llmAnswer, setLlmAnswer] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState<string>('');
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [messages, setMessages] = useState<string[]>([]);
  const [textValue, setTextValue] = useState<string>(lotrExerpt);
  function parseAnswer(answer: Record<string, any>) {
    if (answer.type === 'TextAnswer') {
    }
  }
  return (
    <>
      <textarea
        className="border-solid border-2 m-2 p-4 "
        rows={10}
        cols={70}
        value={textValue}
        onChange={e => setTextValue(e.currentTarget.value)}
      />
      <br />
      <label>
        What question do you want to create?
        <input
          className="p-4"
          value={query}
          onChange={e => setQuery(e.currentTarget.value)}
          className="border-solid border-2 m-2"
        ></input>
      </label>
      <button
        onClick={() =>
          askQuestion(
            query,
            `This is an assessement for kids on the paragraph '''${textValue}'''`,
            []
          ).then(a => {
            console.log(`The llm answered ${JSON.stringify(a)}`);
            setQuestion(a);
          })
        }
        className="bg-sky-700 p-4 m-2 text-white rounded-lg"
      >
        Create
      </button>
      <br />
      {question && <QuestionSematic q={question} />}
      <Chat messages={messages} />
    </>
  );
}

function Chat({ messages }: { messages: string[] }) {
  return (
    <ul>
      {messages.map((m, key) => (
        <li key={key}>m</li>
      ))}
    </ul>
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
  } else if (q.type === 'FillIn') {
    throw 'not implemented';
  }
}
