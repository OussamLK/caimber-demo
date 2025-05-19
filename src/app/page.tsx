'use server';
import AiQuery from './aiQuery';
import MLL from '../mll';
import { useState } from 'react';

const mll = new MLL();

export default async function Home() {
  return (
    <main className="m-2">
      <p className="text-center text-4xl">Homework Editor</p>
      <br />
      <AiQuery askQuestion={genQuertion} />
    </main>
  );
}

export type Question = FillIn | MultiChoice | FreeForm;
type FillIn = {
  type: 'FillIn';
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
  type Questions = FillIn | MultiChoice | FreeForm
type Grading = {correct: number, wrong: number}
type Gap = {Prompt: string, correctAnswer: string}
type FillIn = {
	type: "FillIn",
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

export const genQuertion = mll.createQueryFunction<Question>(
  QuestionSyntaxString,
  'question-generation'
);
