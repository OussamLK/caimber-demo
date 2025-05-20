import { GoogleGenAI } from '@google/genai';

export default class MLL<AbstractSyntax> {
  private _history: string[];
  private _rawQuery: (q: string) => Promise<object>;
  private _AbstractSyntaxString: string;
  constructor(
    queryFunction: (q: string) => Promise<object>,
    AbstractSyntaxString: string
  ) {
    this._history = [];
    this._rawQuery = queryFunction;
    this._AbstractSyntaxString = AbstractSyntaxString;
  }
  static serverSideRawQuery = async (q: string): Promise<object> => {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const resp = await client.models.generateContent({
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
  makeQuery = async (
    query: string,
    context: string,
    state?: Record<string, object>
  ): Promise<AbstractSyntax> => {
    const q = `This is the context for the query '''${context}'''
      ${state && `this is the current state of things '''${serialize(state, 'state')}'''`}
      This is the history for context '''${JSON.stringify(this._history)}'''
      You are going to answer the query '''${query}'''
      Answer with a single object (not a list) following this schema: '''${this._AbstractSyntaxString}'''`;

    console.debug(`Querying the llm with \n\n''''''''\n ${q} \n'''''''\n\n`);

    const resp = (await this._rawQuery(q)) as AbstractSyntax;
    this._history.push(JSON.stringify({ user: query }));
    this._history.push(JSON.stringify({ system: resp }));
    return resp;
  };
}

function serialize(obj: Record<string, object>, objectName: string) {
  try {
    return JSON.stringify(obj);
  } catch {
    console.error(`can not serialize ${objectName}`);
  }
}
