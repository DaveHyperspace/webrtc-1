import type { Response, Request } from 'express';
import type MessageResponse from '../interfaces/MessageResponse';
import type { TestReq } from '../models/test.schema';
import { doSomething } from '../services/test.service';

export const testApi = (_: Request, res: Response<MessageResponse>) => {
  res.status(200).json({ message: 'test' });
};

export const testPost = (req: Request<Record<string, unknown>, Record<string, unknown>, TestReq>, res: Response<TestReq>) => {
  const { name, age } = req.body;
  const user = doSomething(name, age);

  res.status(200).json(user);
};
