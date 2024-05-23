import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AmountDto } from './dto/amount.dto';
import { GetByPeriodDto } from './dto/get-by-period.dto';
import { Account } from '../entities/account.entity';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            createAccount: jest.fn(),
            withdraw: jest.fn(),
            deposit: jest.fn(),
            getBalance: jest.fn(),
            deactivate: jest.fn(),
            activate: jest.fn(),
            getAccountTransactions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    service = module.get<AccountService>(AccountService);
  });

  it('should create an account', async () => {
    // arrange
    const dto: CreateAccountDto = { personId: 1, balance: 1000, dailyWithdrawalLimit: 500, activeFlag: true, accountType: 1, createDate: new Date() };
    const result = { accountId: 1 } as any;
    jest.spyOn(service, 'createAccount').mockResolvedValue(result);

    // act and assertions
    expect(await controller.createAccount(dto)).toBe(result);
    expect(service.createAccount).toHaveBeenCalledWith(dto.personId, dto.balance, dto.dailyWithdrawalLimit, dto.activeFlag, dto.accountType);
  });

  it('should withdraw money from an account', async () => {
    // arrange
    const accountId = 1;
    const dto: AmountDto = { amount: 500 };
    jest.spyOn(service, 'withdraw').mockResolvedValue(undefined);

    // act
    await controller.withdraw(accountId, dto);

    // assertions
    expect(service.withdraw).toHaveBeenCalledWith(accountId, dto.amount);
  });

  it('should deposit money into an account', async () => {
    // arrange
    const accountId = 1;
    const dto: AmountDto = { amount: 500 };
    jest.spyOn(service, 'deposit').mockResolvedValue(undefined);

    // act
    await controller.deposit(accountId, dto);

    // assertions
    expect(service.deposit).toHaveBeenCalledWith(accountId, dto.amount);
  });

  it('should get account balance', async () => {
    // arrange
    const accountId = 1;
    const balance = 1000;
    jest.spyOn(service, 'getBalance').mockResolvedValue(balance);

    // act
    const result = await controller.getBalance(accountId);

    // assertions
    expect(result).toEqual({ accountId, balance });
    expect(service.getBalance).toHaveBeenCalledWith(accountId);
  });

  it('should deactivate an account', async () => {
    // arrange
    const accountId = 1;
    jest.spyOn(service, 'deactivate').mockResolvedValue(undefined);

    // act
    await controller.deactivate(accountId);

    // assertions
    expect(service.deactivate).toHaveBeenCalledWith(accountId);
  });

  it('should activate an account', async () => {
    // arrange
    const accountId = 1;
    jest.spyOn(service, 'activate').mockResolvedValue(undefined);

    // act
    await controller.activate(accountId);

    // assertions
    expect(service.activate).toHaveBeenCalledWith(accountId);
  });

  it('should get account transactions by period', async () => {
    // arrange
    const accountId = 1;
    const dto: GetByPeriodDto = { startDate: new Date(), endDate: new Date() };
    const account = new Account();
    account.accountId = accountId;
    const transactions = [{ transactionId: 1, account: account, value: 100, transactionDate: new Date() }];
    jest.spyOn(service, 'getAccountTransactions').mockResolvedValue(transactions);

    // act
    const result = await controller.getAccountTransactions(accountId, dto);

    // assertions
    expect(result).toEqual(transactions.map(transaction => ({
      transactionId: transaction.transactionId,
      accountId: transaction.account.accountId,
      value: transaction.value,
      transactionDate: transaction.transactionDate,
    })));
    expect(service.getAccountTransactions).toHaveBeenCalledWith(accountId, dto.startDate, dto.endDate);
  });

  it('should get account transactions without a period', async () => {
    // arrange
    const accountId = 1;
    const dto: GetByPeriodDto = { };
    const account = new Account();
    account.accountId = accountId;
    const transactions = [{ transactionId: 1, account: account, value: 100, transactionDate: new Date() }];
    jest.spyOn(service, 'getAccountTransactions').mockResolvedValue(transactions);

    // act
    const result = await controller.getAccountTransactions(accountId, dto);

    // assertions
    expect(result).toEqual(transactions.map(transaction => ({
      transactionId: transaction.transactionId,
      accountId: transaction.account.accountId,
      value: transaction.value,
      transactionDate: transaction.transactionDate,
    })));
    expect(service.getAccountTransactions).toHaveBeenCalledWith(accountId, undefined, undefined);
  });
});