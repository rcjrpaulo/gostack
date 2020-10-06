import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: await fakeHashProvider.generateHash('123456'),
    });

    const response = await authenticateUserService.run({
      email: 'usertest@mail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUserService.run({
        email: 'otheruser@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      authenticateUserService.run({
        email: 'otheruser@mail.com',
        password: '123456',
      }),
    ).rejects.toEqual(
      new AppError('Incorrect email/password combination.', 401),
    );
  });

  it('should not be able to authenticate with password incorrect', async () => {
    await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: await fakeHashProvider.generateHash('123456'),
    });

    expect(
      authenticateUserService.run({
        email: 'usertest@mail.com',
        password: 'passworincorrect',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(
      authenticateUserService.run({
        email: 'usertest@mail.com',
        password: 'passworincorrect',
      }),
    ).rejects.toEqual(
      new AppError('Incorrect email/password combination.', 401),
    );
  });
});
