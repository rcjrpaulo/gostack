import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: IUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show profile user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    const userProfile = await showProfileService.run({
      user_id: user.id,
    });

    expect(userProfile.name).toBe('User Test');
    expect(userProfile.email).toBe('usertest@mail.com');
  });

  it('should not be able to show profile when user not found', async () => {
    await expect(
      showProfileService.run({
        user_id: 'id-not-found',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      showProfileService.run({
        user_id: 'id-not-found',
      }),
    ).rejects.toEqual(new AppError('User not found.', 404));
  });
});
