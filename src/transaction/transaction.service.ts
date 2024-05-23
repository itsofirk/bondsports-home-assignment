import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, FindOptionsWhere, Between } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>
  ) {}

  async getDailyWithdrawalSum(accountId: number): Promise<number> {
    this.logger.log(`Getting daily withdrawal sum for accountId: ${accountId}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { sum } = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.value)', 'sum')
      .where('transaction.accountId = :accountId', { accountId })
      .andWhere('transaction.transactionDate >= :today', { today })
      .andWhere('transaction.value < 0') // Only consider withdrawals
      .getRawOne();

    this.logger.debug(`Daily withdrawal sum for accountId: ${accountId} is ${sum}`);
    return Math.abs(sum) || 0;
  }

  async createTransaction(manager: EntityManager, accountId: number, value: number): Promise<Transaction> {
    this.logger.log(`Creating transaction for accountId: ${accountId} with value: ${value}`);
    const transaction = manager.create(Transaction, {
      account: { accountId },
      value
    });
    return manager.save(Transaction, transaction);
  }

  async getAccountTransactions(accountId: any, from?: Date, to?: Date): Promise<Transaction[]> {
    this.logger.log(`Getting transactions for accountId: ${accountId} from ${from} to ${to}`);
    if (!from){
      this.logger.debug('from not provided, setting it to epoch 0');
      from = new Date(0);
    }
    if (!to){
      this.logger.debug('to not provided, setting it to now');
      to = new Date();
    }

    const where: FindOptionsWhere<Transaction> = {
      account: { accountId },
      transactionDate: Between(from, to),
    }
    
    this.logger.debug(`Retrieving transactions for accountId: ${accountId} from ${from} to ${to}`);
    return await this.transactionRepository.find({
      where,
      relations: ['account'],
    });
  }
}
