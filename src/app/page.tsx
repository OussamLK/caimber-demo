'use server';
import AiQuery from './aiQuery';
import { rawQuery } from './ServerActions';

export default async function Home() {
  return (
    <main className="m-0 p-0 h-screen">
      <TypographyH1 className="text-center fixed bg-white mt-0">
        Homework Editor
      </TypographyH1>
      <AiQuery queryServerAction={rawQuery} />
    </main>
  );
}

function TypographyH1({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <h1
      className={`p-2 m-0 border-b-2 border-b-black w-screen scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl ${className}`}
    >
      {children}
    </h1>
  );
}
