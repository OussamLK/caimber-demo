import 'server-only';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default class MLL {
  private _client: GoogleGenAI;
  private _histories: Record<string, string[]>;
  constructor() {
    this._client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    this._histories = new Proxy({}, _historyProxyHandler);
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
    AbstractSyntaxString: string,
    topicId: string
  ): ((
    query: string,
    context: string,
    state?: Record<string, any>
  ) => Promise<AbstractSyntax>) => {
    const f = async (
      query: string,
      context: string,
      state?: Record<string, any>
    ) => {
      const q = `This is the context for the query '''${context}'''
      ${state && `this is the current state of things '''${serialize(state, 'state')}'''`}
      This is the history for context '''${JSON.stringify(this._histories[topicId])}'''
      You are going to answer the query '''${query}'''
      Answer with a single object (not a list) following this schema: '''${AbstractSyntaxString}'''`;

      console.debug(`Querying the llm with \n\n''''''''\n ${q} \n'''''''\n\n`);

      const resp = await this.rawQuery(q);
      this._histories[topicId].push(query);
      this._histories[topicId].push(JSON.stringify(resp));
      return resp;
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

//Making histories a bit easier to handle
const _historyProxyHandler = {
  get(target: Record<string, any>, property: string) {
    if (target[property] === undefined) {
      target[property] = [];
    }
    return target[property];
  },
  set(target: Record<string, any>, property: string, value: any) {
    throw 'Do not directly mutate histories, only pushing strings allowed';
  },
};

function serialize(obj: Record<any, any>, objectName: string) {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error(`can not serialize ${objectName}`);
  }
}
