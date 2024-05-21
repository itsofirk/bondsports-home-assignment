import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Person } from './person.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('increment')
  accountId: number;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'personId' })
  person: Person;

  @Column('decimal')
  balance: number;

  @Column('decimal')
  dailyWithdrawalLimit: number;
}
