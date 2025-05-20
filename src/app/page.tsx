'use server';
import AiQuery from './aiQuery';
import MLL from '../mll';

export default async function Home() {
  return (
    <main className="m-2 h-full">
      <p className="text-center text-4xl">Homework Editor</p>
      <br />
      <AiQuery queryServerAction={rawQuery} />
    </main>
  );
}

export async function rawQuery(q: string): Promise<object> {
  return await MLL.serverSideRawQuery(q);
}
