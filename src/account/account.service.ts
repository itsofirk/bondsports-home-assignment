import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { Person } from '../entities/person.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    private transactionService: TransactionService
  ) { }

  async createAccount(personId: number, balance: number, dailyWithdrawalLimit: number, activeFlag: boolean, accountType: number): Promise<Account> {
    this.logger.log(`Creating account for personId: ${personId}`);
    const person = await this.personRepository.findOneBy({ personId });
    if (!person) {
      this.logger.error(`Person not found with personId: ${personId}`);
      throw new Error('Person not found');
    }

    const account = this.accountRepository.create({ person, balance, dailyWithdrawalLimit, activeFlag, accountType });
    return this.accountRepository.save(account);
  }

  async getAccountTransactions(accountId: any, from?: Date, to?: Date): Promise<Transaction[]> {
    this.logger.log(`Getting transactions for accountId: ${accountId} from ${from} to ${to}`);
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) {
      this.logger.error(`Account not found with accountId: ${accountId}`);
      throw new Error('Account not found');
    }

    return await this.transactionService.getAccountTransactions(accountId, from, to);
  }

  async activate(accountId: any) {
    this.logger.log(`Activating account with accountId: ${accountId}`);
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) {
      this.logger.error(`Account not found with accountId: ${accountId}`);
      throw new Error('Account not found');
    }

    if (!account.activeFlag) {
      account.activeFlag = true;
      await this.accountRepository.save(account);
      this.logger.log(`Account with accountId: ${accountId} activated`);
    }
  }

  async deactivate(accountId: any) {
    this.logger.log(`Deactivating account with accountId: ${accountId}`);
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) {
      this.logger.error(`Account not found with accountId: ${accountId}`);
      throw new Error('Account not found');
    }

    if (account.activeFlag) {
      account.activeFlag = false;
      await this.accountRepository.save(account);
      this.logger.log(`Account with accountId: ${accountId} deactivated`);
    }
  }

  async getBalance(accountId: any): Promise<number> {
    this.logger.log(`Getting balance for accountId: ${accountId}`);
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) {
      this.logger.error(`Account not found with accountId: ${accountId}`);
      throw new Error('Account not found');
    }

    return account.balance;
  }

  async deposit(accountId: any, amount: number) {
    this.logger.log(`Depositing amount: ${amount} to accountId: ${accountId}`);
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) {
      this.logger.error(`Account not found with accountId: ${accountId}`);
      throw new Error('Account not found');
    }
    if (!account.activeFlag) {
      this.logger.error(`Account not active with accountId: ${accountId}`);
      throw new Error('Account not active');
    }

    await this.dataSource.transaction(async manager => {
      account.balance += amount;
      await manager.save(account);
      await this.transactionService.createTransaction(manager, accountId, amount);
    });
    this.logger.log(`Deposited amount: ${amount} to accountId: ${accountId}`);
  }

  async withdraw(accountId: any, amount: number) {
    this.logger.log(`Withdrawing amount: ${amount} from accountId: ${accountId}`);
    const account = await this.accountRepository.findOneBy({ accountId });
    if (!account) {
      this.logger.error(`Account not found with accountId: ${accountId}`);
      throw new Error('Account not found');
    }
    if (!account.activeFlag) {
      this.logger.error(`Account not active with accountId: ${accountId}`);
      throw new Error('Account not active');
    }
    if (account.balance < amount) {
      this.logger.error(`Insufficient funds for accountId: ${accountId}`);
      throw new Error('Insufficient funds');
    }

    const dailyWithdrawalSum = await this.transactionService.getDailyWithdrawalSum(accountId);
    if (dailyWithdrawalSum + amount > account.dailyWithdrawalLimit) {
      this.logger.error(`Daily withdrawal limit exceeded for accountId: ${accountId}`);
      throw new Error('Daily withdrawal limit exceeded');
    }
    if (account.balance <= amount) {
      this.logger.error(`Insufficient balance for accountId: ${accountId}`);
      throw new Error('Insufficient balance');
    }

    await this.dataSource.transaction(async manager => {
      account.balance -= amount;
      await this.accountRepository.save(account);
      await this.transactionService.createTransaction(manager, accountId, -amount);
    });
    this.logger.log(`Withdrew amount: ${amount} from accountId: ${accountId}`);
  }
}
