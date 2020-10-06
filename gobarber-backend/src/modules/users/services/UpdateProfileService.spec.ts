import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: IUsersRepository;
let fakeHashProvider: IHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    const userUpdated = await updateProfileService.run({
      user_id: user.id,
      name: 'User Test Updated',
      email: 'usertestupdated@mail.com',
    });

    expect(userUpdated.name).toBe('User Test Updated');
    expect(userUpdated.email).toBe('usertestupdated@mail.com');
  });

  it('should not be able to update the profile when user not found', async () => {
    await expect(
      updateProfileService.run({
        user_id: 'id-not-found',
        name: 'User Test Updated',
        email: 'usertestupdated@mail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      updateProfileService.run({
        user_id: 'id-not-found',
        name: 'User Test Updated',
        email: 'usertestupdated@mail.com',
      }),
    ).rejects.toEqual(new AppError('User not found.', 404));
  });

  it('should not be able to update email for email existing', async () => {
    await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'User Test Two',
      email: 'usertesttwo@mail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.run({
        user_id: user.id,
        name: 'User Test Two Updated',
        email: 'usertest@mail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      updateProfileService.run({
        user_id: user.id,
        name: 'User Test Two Updated',
        email: 'usertest@mail.com',
      }),
    ).rejects.toEqual(new AppError('E-mail already in use.'));
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    const userUpdated = await updateProfileService.run({
      user_id: user.id,
      name: 'User Test Updated',
      email: 'usertestupdated@mail.com',
      old_password: '123456',
      password: '654321',
    });

    expect(userUpdated.password).toBe('654321');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.run({
        user_id: user.id,
        name: 'User Test Updated',
        email: 'usertestupdated@mail.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      updateProfileService.run({
        user_id: user.id,
        name: 'User Test Updated',
        email: 'usertestupdated@mail.com',
        password: '654321',
      }),
    ).rejects.toEqual(
      new AppError(
        'You need to inform the old password to set a new password.',
      ),
    );
  });

  it('should not be able to update the password whit wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.run({
        user_id: user.id,
        name: 'User Test Updated',
        email: 'usertestupdated@mail.com',
        old_password: 'wrong-old-password',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      updateProfileService.run({
        user_id: user.id,
        name: 'User Test Updated',
        email: 'usertestupdated@mail.com',
        old_password: 'wrong-old-password',
        password: '654321',
      }),
    ).rejects.toEqual(
      new AppError('Old password does not match current password.'),
    );
  });
});
