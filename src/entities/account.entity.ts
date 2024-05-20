import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Person } from './person.entity';
import { Transaction } from './transaction.entity';

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

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];
}
