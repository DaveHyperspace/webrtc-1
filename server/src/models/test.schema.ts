import { z } from 'zod';

export const TestReq = z.object({
  name: z.string(),
  age: z.number(),
});

export type TestReq = z.TypeOf<typeof TestReq>;
