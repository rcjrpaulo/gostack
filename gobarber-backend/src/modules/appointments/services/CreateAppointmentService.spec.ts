import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;

let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.run({
      date: new Date(),
      user_id: 'user-id',
      provider_id: 'a1s2a45d1a',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('a1s2a45d1a');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const date = new Date(2020, 4, 10, 11);

    await createAppointment.run({
      date,
      user_id: 'user-id',
      provider_id: 'a1s2a45d1a',
    });

    await expect(
      createAppointment.run({
        date,
        user_id: 'user-id',
        provider_id: 'a1s2a45d1a',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.run({
        date,
        user_id: 'user-id',
        provider_id: 'a1s2a45d1a',
      }),
    ).rejects.toEqual(new AppError('This appointment is already booked'));
  });
});
