'use server';
import AiQuery from './aiQuery';
import { rawQuery } from './ServerActions';

export default async function Home() {
  return (
    <main className="m-2 h-full">
      <p className="text-center text-4xl">Homework Editor</p>
      <br />
      <AiQuery queryServerAction={rawQuery} />
    </main>
  );
}
