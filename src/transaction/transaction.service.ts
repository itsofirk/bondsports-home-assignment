import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Account } from '../entities/account.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>
  ) {}

  async getDailyWithdrawalSum(accountId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { sum } = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.value)', 'sum')
      .where('transaction.accountId = :accountId', { accountId })
      .andWhere('transaction.transactionDate >= :today', { today })
      .andWhere('transaction.value < 0') // Only consider withdrawals
      .getRawOne();

    return Math.abs(sum) || 0;
  }

  async createTransaction(accountId: number, value: number): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
    account:{accountId},
      value,
      transactionDate: new Date(),
    });
    return this.transactionRepository.save(transaction);
  }
}
