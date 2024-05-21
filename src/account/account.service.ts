import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { Person } from '../entities/person.entity';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async createAccount(personId: number, balance: number, dailyWithdrawalLimit: number): Promise<Account> {
    const person = await this.personRepository.findOneBy({personId});
    if (!person) throw new Error('Person not found');

    const account = this.accountRepository.create({ person, balance, dailyWithdrawalLimit });
    return this.accountRepository.save(account);
  }

  getAccountTransactions(accountId: any): Transaction[] | PromiseLike<Transaction[]> {
    throw new Error('Method not implemented.');
  }
  activate(accountId: any) {
    throw new Error('Method not implemented.');
  }
  deactivate(accountId: any) {
    throw new Error('Method not implemented.');
  }
  getBalance(accountId: any): number | PromiseLike<number> {
    throw new Error('Method not implemented.');
  }
  deposit(accountId: any, amount: number) {
    throw new Error('Method not implemented.');
  }
  withdraw(accountId: any, amount: number) {
    throw new Error('Method not implemented.');
  }
}
