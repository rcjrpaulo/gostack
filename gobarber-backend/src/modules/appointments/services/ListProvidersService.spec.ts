import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'User Test',
      email: 'usertest@mail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'User Test 2',
      email: 'usertest2@mail.com',
      password: '123456',
    });

    const user3 = await fakeUsersRepository.create({
      name: 'User Test3',
      email: 'usertest3@mail.com',
      password: '123456',
    });

    const userLogged = await fakeUsersRepository.create({
      name: 'User Test4',
      email: 'usertest4@mail.com',
      password: '123456',
    });

    const providers = await listProvidersService.run({
      user_id: userLogged.id,
    });

    expect(providers).toEqual([user1, user2, user3]);
  });
});
