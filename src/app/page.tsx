'use server';
import AiQuery from './aiQuery';
import MLL from '../mll';

export default async function Home() {
  return (
    <main className="m-2">
      <p className="text-center text-4xl">Homework Editor</p>
      <br />
      <AiQuery queryServerAction={getLangGen} />
    </main>
  );
}

export const getLangGen = MLL.serverSideRawQuery;
