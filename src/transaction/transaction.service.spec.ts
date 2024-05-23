import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOperator, Repository } from 'typeorm';
import { TransactionService } from './transaction.service';
import { Transaction } from '../entities/transaction.entity';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  describe('getAccountTransactions', () => {
    it('should return transactions for a given account', async () => {
      const accountId = 1;

      const transactions = [
        { transactionId: 1, account: { accountId }, value: 100, transactionDate: new Date() },
        { transactionId: 1, account: { accountId }, value: 200, transactionDate: new Date() },
      ] as Transaction[];

      jest.spyOn(transactionRepository, 'find').mockResolvedValue(transactions);

      const result = await service.getAccountTransactions(accountId);

      expect(result).toEqual(transactions);
      expect(transactionRepository.find).toHaveBeenCalledWith({
        where: {
          account: { accountId },
          transactionDate: expect.any(FindOperator),
        },
        relations: ['account'],
      });
    });
  });
});
