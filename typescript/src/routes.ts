import { Response, Request } from 'express';
import createUser from './services/CreateUser.service';

export function helloWorld(request: Request, response: Response) {
  const user = createUser({
    name: 'Guilherme',
    email: 'guiherme@mail.com',
    password: '123456',
    techs: [
      'NodeJS',
      'React Native',
      {
        title: 'Javascript',
        experience: 32,
      },
    ],
  });

  response.send('Hello World');
}
