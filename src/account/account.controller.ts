import { Controller, Post, Body, Put, Get, Query, Logger } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '../entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { AmountDto } from './dto/amount.dto';
import { GetByPeriodDto } from './dto/get-by-period.dto';
import { AccountId } from '../common/decorators/account-id.decorator';

@Controller('accounts')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) { }

  @Post()
  async createAccount(@Body() newAccount: CreateAccountDto): Promise<Account> {
    this.logger.log(`Creating account for personId: ${newAccount.personId}`);
    return this.accountService.createAccount(
      newAccount.personId, 
      newAccount.balance,
      newAccount.dailyWithdrawalLimit,
      newAccount.activeFlag,
      newAccount.accountType
    );
  }

  @Put(':accountId/withdraw')
  async withdraw(@AccountId() accountId, @Body() amountDto: AmountDto) {
    this.logger.log(`Withdrawing amount: ${amountDto.amount} from accountId: ${accountId}`);
    return this.accountService.withdraw(accountId, amountDto.amount);
  }

  @Put(':accountId/deposit')
  async deposit(@AccountId() accountId, @Body() amountDto: AmountDto) {
    this.logger.log(`Depositing amount: ${amountDto.amount} to accountId: ${accountId}`);
    return this.accountService.deposit(accountId, amountDto.amount);
  }

  @Get(':accountId/balance')
  async getBalance(@AccountId() accountId): Promise<{ accountId: number, balance: number }> {
    this.logger.log(`Getting balance for accountId: ${accountId}`);
    const balance = await this.accountService.getBalance(accountId);
    return { accountId, balance };
  }

  @Put(':accountId/deactivate')
  async deactivate(@AccountId() accountId) {
    this.logger.log(`Deactivating accountId: ${accountId}`);
    return this.accountService.deactivate(accountId);
  }

  @Put(':accountId/activate')
  async activate(@AccountId() accountId) {
    this.logger.log(`Activating accountId: ${accountId}`);
    return this.accountService.activate(accountId);
  }

  @Get(':accountId/transactions')
  async getAccountTransactions(@AccountId() accountId, @Query() getByPeriodDto: GetByPeriodDto) {
    this.logger.log(`Getting transactions for accountId: ${accountId} from ${getByPeriodDto.startDate} to ${getByPeriodDto.endDate}`);
    const { startDate, endDate } = getByPeriodDto;
    const transactions = await this.accountService.getAccountTransactions(accountId, startDate, endDate);
    return transactions.map(transaction => ({
      transactionId: transaction.transactionId,
      accountId: transaction.account.accountId,
      value: transaction.value,
      transactionDate: transaction.transactionDate,
    }));
  }
}
