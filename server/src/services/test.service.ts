import type { TestReq } from './../models/test.schema';

export const doSomething = (username: string, age: number): TestReq => {
  return { name: username, age };
};
