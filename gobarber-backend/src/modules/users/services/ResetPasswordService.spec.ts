import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.run({
      token,
      password: '654321',
    });

    const userPasswordReseted = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('654321');
    expect(userPasswordReseted?.password).toBe('654321');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.run({
        token: 'non-existing-token',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      resetPasswordService.run({
        token: 'non-existing-token',
        password: '654321',
      }),
    ).rejects.toEqual(new AppError('User token does not exists.', 404));
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );

    expect(
      resetPasswordService.run({
        token,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(
      resetPasswordService.run({
        token,
        password: '654321',
      }),
    ).rejects.toEqual(new AppError('User does not exists.', 404));
  });

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.run({
        token,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      resetPasswordService.run({
        token,
        password: '654321',
      }),
    ).rejects.toEqual(new AppError('Token to reset password expired.'));
  });
});
