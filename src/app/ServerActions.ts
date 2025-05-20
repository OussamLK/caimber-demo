'use server';
import MLL from '../mll';
export async function rawQuery(q: string): Promise<object> {
  return await MLL.serverSideRawQuery(q);
}
