import { Controller, Post, Body, Put, Param, Get, ParseIntPipe } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '../entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountId } from '../common/decorators/account-id.decorator';


@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post()
  async createAccount(@Body() newAccount: CreateAccountDto): Promise<Account> {
    return this.accountService.createAccount(newAccount.personId, newAccount.balance, newAccount.dailyWithdrawalLimit);
  }

  @Put(':accountId/withdraw')
  async withdraw(@AccountId() accountId, @Body() { amount }: { amount: number }) {
    return this.accountService.withdraw(accountId, amount);
  }

  @Put(':accountId/deposit')
  async deposit(@AccountId() accountId, @Body() { amount }: { amount: number }) {
    return this.accountService.deposit(accountId, amount);
  }

  @Get(':accountId/balance')
  async getBalance(@AccountId() accountId): Promise<{ accountId: number, balance: number }> {
    const balance = await this.accountService.getBalance(accountId);
    return { accountId, balance };
  }

  @Put(':accountId/deactivate')
  async deactivate(@AccountId() accountId) {
    return this.accountService.deactivate(accountId);
  }

  @Put(':accountId/activate')
  async activate(@AccountId() accountId) {
    return this.accountService.activate(accountId);
  }

  @Get(':accountId/transactions')
  async getAccountTransactions(@AccountId() accountId): Promise<TransactionDto[]> {
    const transactions = await this.accountService.getAccountTransactions(accountId);
    return transactions.map(transaction => ({
      transactionId: transaction.transactionId,
      accountId: transaction.account.accountId,
      value: transaction.value,
      transactionDate: transaction.transactionDate,
    }));
  }
}
