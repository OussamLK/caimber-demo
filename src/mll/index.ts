import 'server-only';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default class MLL {
  private _client: GoogleGenAI;
  constructor() {
    this._client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  rawQuery = async (q: string): Promise<Object> => {
    const resp = await this._client.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: q,
      config: {
        responseMimeType: 'application/json',
      },
    });
    if (resp.text === undefined) {
      throw 'gemini answer undefined';
    }
    return JSON.parse(resp.text);
  };
  createQueryFunction = <AbstractSyntax>(
    AbstractSyntaxString: string
  ): ((
    query: string,
    context: string,
    history: string[]
  ) => Promise<AbstractSyntax>) => {
    const f = async (query: string, context: string, history: string[]) => {
      const q = `This is the context for the query '''${context}'''
      You are going to answer the query '''${query}'''
      This is the history for context '''${JSON.stringify(history)} of the interaction'''
      Answer with a single object (not a list) following this schema: '''${AbstractSyntaxString}'''`;
      return await this.rawQuery(q);
    };
    //@ts-ignore
    return f;
  };
  extractGrammar = (name: string, filePath: string): string => {
    //right up 99 hackey alley
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(content);
    const lines = content.split('\n');
    let grammar_lines = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`${name}-grammar-start`)) {
        grammar_lines.push(lines[i]);
      } else if (lines[i].includes(`${name}-grammar-end`)) {
        grammar_lines.push(lines[i]);
        break;
      }
    }
    const res = grammar_lines.join('\n');
    console.log(`extracted grammar ${res}`);
    return res;
  };
}
