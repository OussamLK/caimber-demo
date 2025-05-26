'use server';
import AiQuery from './aiQuery';
import { rawQuery } from './ServerActions';

export default async function Home() {
  return (
    <main className="m-0 h-full">
      <TypographyH1 className="text-center fixed bg-white mt-0">
        Homework Editor
      </TypographyH1>
      <br />
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
      className={`p-4 m-0 border-b-2 w-screen scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
    >
      {children}
    </h1>
  );
}
