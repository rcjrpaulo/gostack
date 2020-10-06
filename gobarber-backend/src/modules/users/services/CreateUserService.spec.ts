import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersrepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersrepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersrepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.run({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.password === '123456').toBeTruthy();
  });

  it('should not be able to create a new user with same email from another', async () => {
    await createUserService.run({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    expect(
      createUserService.run({
        name: 'User Test',
        email: 'usertest@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(
      createUserService.run({
        name: 'User Test',
        email: 'usertest@mail.com',
        password: '123456',
      }),
    ).rejects.toEqual(new AppError('Email address already used.'));
  });
});
