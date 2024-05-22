import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { Person } from '../entities/person.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';


@Injectable()
export class AccountService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    private transactionService: TransactionService
  ) { }

  async createAccount(personId: number, balance: number, dailyWithdrawalLimit: number, activeFlag: boolean, accountType: number): Promise<Account> {
    const person = await this.personRepository.findOneBy({ personId });
    if (!person) throw new Error('Person not found');

    const account = this.accountRepository.create({ person, balance, dailyWithdrawalLimit, activeFlag, accountType });
    return this.accountRepository.save(account);
  }

  async getAccountTransactions(accountId: any, from?: Date, to?: Date): Promise<Transaction[]> {
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');
    
    return await this.transactionService.getAccountTransactions(accountId, from, to);
  }
  
  async activate(accountId: any) {
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');
    
    if (!account.activeFlag){
       account.activeFlag = true;
       this.accountRepository.save(account);
      }
  }

  async deactivate(accountId: any) {
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');
    
    if (account.activeFlag){
      account.activeFlag = false;
      this.accountRepository.save(account);
    }
  }

  async getBalance(accountId: any): Promise<number> {
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');

    return account.balance
  }

  async deposit(accountId: any, amount: number) {
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');
    if (!account.activeFlag) throw new Error('Account not active');
    
    await this.dataSource.transaction(async manager => {
      account.balance += amount;
      await manager.save(account);
      await this.transactionService.createTransaction(manager, accountId, amount);
    });
  }

  async withdraw(accountId: any, amount: number) {
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) throw new Error('Account not found');
    if (!account.activeFlag) throw new Error('Account not active');
    if (account.balance < amount) throw new Error('Insufficient funds');
   
    const dailyWithdrawalSum = await this.transactionService.getDailyWithdrawalSum(accountId);
    if (dailyWithdrawalSum + amount > account.dailyWithdrawalLimit) throw new Error('Daily withdrawal limit exceeded');
    if (account.balance <= amount) throw new Error('Insufficient balance');

    await this.dataSource.transaction(async manager => {
      account.balance -= amount;
      await this.accountRepository.save(account);
      await this.transactionService.createTransaction(manager, accountId, -amount);
    })
  }
}
