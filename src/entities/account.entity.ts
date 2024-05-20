import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Person } from './person.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @ManyToOne(() => Person, person => person.accounts)
  person: Person;

  @Column('decimal')
  balance: number;

  @Column('decimal')
  dailyWithdrawalLimit: number;
}
