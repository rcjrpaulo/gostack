import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.run({
      email: 'usertest@mail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user pasword', async () => {
    await expect(
      sendForgotPasswordEmailService.run({
        email: 'usertest@mail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      sendForgotPasswordEmailService.run({
        email: 'usertest@mail.com',
      }),
    ).rejects.toEqual(new AppError('E-mail does not exists'));
  });

  it('should generate a forgot password token', async () => {
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.run({ email: 'usertest@mail.com' });

    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
