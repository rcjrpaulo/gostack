import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string;

  @Column()
  user_id: string;

  @Column('time with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User) // indica a cardinalidade do relacionamento
  @JoinColumn({ name: 'provider_id' }) // informa qual coluna identfica o relacionamento
  provider: User;

  @ManyToOne(() => User) // indica a cardinalidade do relacionamento
  @JoinColumn({ name: 'user_id' }) // informa qual coluna identfica o relacionamento
  user: User;
}

export default Appointment;
