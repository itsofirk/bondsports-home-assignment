import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AccountService } from './account.service';
import { Account } from '../entities/account.entity';
import { Person } from '../entities/person.entity';
import { Transaction } from '../entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: Repository<Account>;
  let personRepository: Repository<Person>;
  let transactionService: TransactionService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Person),
          useClass: Repository,
        },
        {
          provide: TransactionService,
          useValue: {
            getAccountTransactions: jest.fn(),
            createTransaction: jest.fn(),
            getDailyWithdrawalSum: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    accountRepository = module.get<Repository<Account>>(getRepositoryToken(Account));
    personRepository = module.get<Repository<Person>>(getRepositoryToken(Person));
    transactionService = module.get<TransactionService>(TransactionService);
    dataSource = module.get<DataSource>(DataSource);
  });

  describe('createAccount', () => {
    it('should create and save a new account', async () => {
      // arrange
      const personId = 1;
      const balance = 1000;
      const dailyWithdrawalLimit = 500;
      const activeFlag = true;
      const accountType = 1;
      const person = new Person();
      person.personId = personId;
      
      const account = new Account();
      jest.spyOn(personRepository, 'findOneBy').mockResolvedValue(person);
      jest.spyOn(accountRepository, 'create').mockReturnValue(account);
      jest.spyOn(accountRepository, 'save').mockResolvedValue(account);

      // act
      const result = await service.createAccount(personId, balance, dailyWithdrawalLimit, activeFlag, accountType);

      // assertions
      expect(personRepository.findOneBy).toHaveBeenCalledWith({ personId });
      expect(accountRepository.create).toHaveBeenCalledWith({ person, balance, dailyWithdrawalLimit, activeFlag, accountType });
      expect(accountRepository.save).toHaveBeenCalledWith(account);
      expect(result).toBe(account);
    });

    it('should throw an error if person is not found', async () => {
      // arrange
      jest.spyOn(personRepository, 'findOneBy').mockResolvedValue(null);

      // act and assertions
      await expect(service.createAccount(1, 1000, 500, true, 1)).rejects.toThrow('Person not found');
    });
  });

  describe('getAccountTransactions', () => {
    it('should return account transactions', async () => {
      // arrange
      const accountId = 1;
      const account = new Account();
      account.accountId = accountId;
      const transactions = [new Transaction()];

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);
      jest.spyOn(transactionService, 'getAccountTransactions').mockResolvedValue(transactions);

      // act
      const result = await service.getAccountTransactions(accountId);

      // assertions
      // calls assertions
      expect(accountRepository.findOneBy).toHaveBeenCalledWith({ accountId });
      expect(transactionService.getAccountTransactions).toHaveBeenCalledWith(accountId, undefined, undefined);
      // result assertions
      expect(result).toEqual(transactions);
      expect(result.length).toBe(1);
      expect(result[0]).toBe(transactions[0]);
    });

    it('should throw an error if account is not found', async () => {
      // arrange
      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(null);

      // act and assertions
      await expect(service.getAccountTransactions(1)).rejects.toThrow('Account not found');
    });
  });

  describe('activate', () => {
    it('should activate an account', async () => {
      // arrange
      const accountId = 1;
      const account = new Account();
      account.accountId = accountId;
      account.activeFlag = false;

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);
      jest.spyOn(accountRepository, 'save').mockResolvedValue(account);

      // act
      await service.activate(accountId);

      // assertions
      expect(accountRepository.findOneBy).toHaveBeenCalledWith({ accountId });
      expect(account.activeFlag).toBe(true);
      expect(accountRepository.save).toHaveBeenCalledWith(account);
    });

    it('should not activate an already active account', async () => {
      // arrange
      const accountId = 1;
      const account = new Account();
      account.accountId = accountId;
      account.activeFlag = true;

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);
      jest.spyOn(accountRepository, 'save');

      // act
      await service.activate(accountId);

      // assertions
      expect(accountRepository.findOneBy).toHaveBeenCalledWith({ accountId });
      expect(accountRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error if account is not found', async () => {
      // arrange
      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(null);

      // act and assertions
      await expect(service.activate(1)).rejects.toThrow('Account not found');
    });
  });

  describe('deactivate', () => {
    it('should deactivate an account', async () => {
      // arrange
      const accountId = 1;
      const account = new Account();
      account.accountId = accountId;
      account.activeFlag = true;

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);
      jest.spyOn(accountRepository, 'save').mockResolvedValue(account);

      // act
      await service.deactivate(accountId);

      // assertions
      expect(accountRepository.findOneBy).toHaveBeenCalledWith({ accountId });
      expect(account.activeFlag).toBe(false);
      expect(accountRepository.save).toHaveBeenCalledWith(account);
    });

    it('should not deactivate an already inactive account', async () => {
      // arrange
      const accountId = 1;
      const account = new Account();
      account.accountId = accountId;
      account.activeFlag = false;

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);
      jest.spyOn(accountRepository, 'save');

      // act
      await service.deactivate(accountId);

      // assertions
      expect(accountRepository.findOneBy).toHaveBeenCalledWith({ accountId });
      expect(accountRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error if account is not found', async () => {
      // arrange
      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(null);

      // act and assertions
      await expect(service.deactivate(1)).rejects.toThrow('Account not found');
    });
  });

  describe('getBalance', () => {
    it('should return the account balance', async () => {
      // arrange
      const accountId = 1;
      const account = new Account();
      account.accountId = accountId;
      account.balance = 1000;

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);

      // act
      const result = await service.getBalance(accountId);

      // assertions
      expect(accountRepository.findOneBy).toHaveBeenCalledWith({ accountId });
      expect(result).toBe(1000);
    });

    it('should throw an error if account is not found', async () => {
      // arrange
      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(null);

      // act and assertions
      await expect(service.getBalance(1)).rejects.toThrow('Account not found');
    });
  });

  describe('deposit', () => {
    it('should deposit money into an active account', async () => {
      // arrange
      const accountId = 1;
      const amount = 500;
      const account = new Account();
      account.accountId = accountId;
      account.balance = 1000;
      account.activeFlag = true;
  
      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);
      jest.spyOn(dataSource, 'transaction').mockImplementation(dataSourceTransactionMock(account));
  
      // act
      await service.deposit(accountId, amount);
  
      // assertions
      expect(accountRepository.findOneBy).toHaveBeenCalledWith({ accountId });
      expect(account.balance).toBe(1500);
      expect(transactionService.createTransaction).toHaveBeenCalledWith(expect.anything(), accountId, amount);
    });

    it('should throw an error if account is not found', async () => {
      // arrange
      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(null);

      // act and assertions
      await expect(service.deposit(1, 500)).rejects.toThrow('Account not found');
    });

    it('should throw an error if account is not active', async () => {
      // arrange
      const accountId = 1;
      const account = new Account();
      account.accountId = accountId;
      account.activeFlag = false;

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);

      // act and assertions
      await expect(service.deposit(accountId, 500)).rejects.toThrow('Account not active');
    });
  });

  describe('withdraw', () => {
    it('should withdraw money from an active account', async () => {
      // arrange
      const accountId = 1;
      const amount = 500;
      const account = new Account();
      account.accountId = accountId;
      account.balance = 1000;
      account.dailyWithdrawalLimit = 700;
      account.activeFlag = true;

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);
      jest.spyOn(accountRepository, 'save').mockResolvedValue(account);
      jest.spyOn(transactionService, 'getDailyWithdrawalSum').mockResolvedValue(100);
      jest.spyOn(dataSource, 'transaction').mockImplementation(dataSourceTransactionMock(account));

      // act
      await service.withdraw(accountId, amount);

      // assertions
      expect(accountRepository.findOneBy).toHaveBeenCalledWith({ accountId });
      expect(account.balance).toBe(500);
      expect(transactionService.createTransaction).toHaveBeenCalledWith(expect.anything(), accountId, -amount);
    });

    it('should throw an error if account is not found', async () => {
      // arrange
      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(null);

      // act and assertions
      await expect(service.withdraw(1, 500)).rejects.toThrow('Account not found');
    });

    it('should throw an error if account is not active', async () => {
      // arrange
      const accountId = 1;
      const account = new Account();
      account.accountId = accountId;
      account.activeFlag = false;

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);

      // act and assertions
      await expect(service.withdraw(accountId, 500)).rejects.toThrow('Account not active');
    });

    it('should throw an error if account balance is insufficient', async () => {
      // arrange
      const accountId = 1;
      const account = new Account();
      account.accountId = accountId;
      account.balance = 100;
      account.activeFlag = true;

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);

      // act and assertions
      await expect(service.withdraw(accountId, 500)).rejects.toThrow('Insufficient funds');
    });

    it('should throw an error if daily withdrawal limit is exceeded', async () => {
      // arrange
      const accountId = 1;
      const amount = 500;
      const account = new Account();
      account.accountId = accountId;
      account.balance = 1000;
      account.dailyWithdrawalLimit = 200;
      account.activeFlag = true;

      jest.spyOn(accountRepository, 'findOneBy').mockResolvedValue(account);
      jest.spyOn(transactionService, 'getDailyWithdrawalSum').mockResolvedValue(100);

      // act and assertions
      await expect(service.withdraw(accountId, amount)).rejects.toThrow('Daily withdrawal limit exceeded');
    });
  });
});
function dataSourceTransactionMock(account: Account) {
  return async (transactionalFunction) => {
    await transactionalFunction({
      save: jest.fn().mockResolvedValue(account),
    } as any);
  };
}

