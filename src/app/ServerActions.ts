'use server';
import { serverSideRawQuery } from '../mll';

export async function rawQuery(q: string): Promise<object> {
  return await serverSideRawQuery(q);
}
