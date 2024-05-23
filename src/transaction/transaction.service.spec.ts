import { Between } from 'typeorm';
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

    it('should call transactionRepository.find with Date(0) and Date() when from and to are not provided', async () => {
      const accountId = 1;
      const mockTransactions = [];

      jest.spyOn(transactionRepository, 'find').mockResolvedValue(mockTransactions);

      await service.getAccountTransactions(accountId);

      expect(transactionRepository.find).toHaveBeenCalledWith({
        where: {
          account: { accountId },
          transactionDate: Between(new Date(0), expect.any(Date)),
        },
        relations: ['account'],
      });
    });

    it('should call transactionRepository.find with provided from and to dates', async () => {
      const accountId = 1;
      const from = new Date('2023-01-01');
      const to = new Date('2023-12-31');
      const mockTransactions = [];

      jest.spyOn(transactionRepository, 'find').mockResolvedValue(mockTransactions);

      await service.getAccountTransactions(accountId, from, to);

      expect(transactionRepository.find).toHaveBeenCalledWith({
        where: {
          account: { accountId },
          transactionDate: Between(from, to),
        },
        relations: ['account'],
      });
    });

    it('should return an empty array if no transactions are found', async () => {
      const accountId = 1;
      const from = new Date('2023-01-01');
      const to = new Date('2023-12-31');

      jest.spyOn(transactionRepository, 'find').mockResolvedValue([]);

      const result = await service.getAccountTransactions(accountId, from, to);

      expect(result).toEqual([]);
    });

    it('should handle errors thrown by transactionRepository.find', async () => {
      const accountId = 1;
      const from = new Date('2023-01-01');
      const to = new Date('2023-12-31');

      jest.spyOn(transactionRepository, 'find').mockRejectedValue(new Error('Database error'));

      await expect(service.getAccountTransactions(accountId, from, to)).rejects.toThrow('Database error');
    });
  });
});
