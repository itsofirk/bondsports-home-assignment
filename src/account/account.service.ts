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
  ) { }

  async createAccount(personId: number, balance: number, dailyWithdrawalLimit: number): Promise<Account> {
    const person = await this.personRepository.findOneBy({ personId });
    if (!person) throw new Error('Person not found');

    const account = this.accountRepository.create({ person, balance, dailyWithdrawalLimit });
    return this.accountRepository.save(account);
  }

  getAccountTransactions(accountId: any): Transaction[] | PromiseLike<Transaction[]> {
    throw new Error('Method not implemented.');
  }
  
  async activate(accountId: any) {
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');
    
    if (account.activeFlag){
       // TODO: log that account is already active
       return account
    }
    account.activeFlag = true;
    return this.accountRepository.save(account);
  }

  async deactivate(accountId: any) {
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');
    
    if (!account.activeFlag){
       // TODO: log that account is already inactive
       return account;
    }
    account.activeFlag = false;
    return this.accountRepository.save(account);
  }

  async getBalance(accountId: any): Promise<number> {
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');

    return account.balance
  }

  async deposit(accountId: any, amount: number) {
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');

    account.balance += amount;
    return this.accountRepository.save(account);
  }

  async withdraw(accountId: any, amount: number) {
    // TODO: check daily withdrawal limit
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');
    if (account.balance < amount) throw new Error('Insufficient funds');
    
    account.balance -= amount;
    return this.accountRepository.save(account);
  }
}
