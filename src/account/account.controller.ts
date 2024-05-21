import { Controller, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '../entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(@Body() newAccount: CreateAccountDto): Promise<Account> {
    return this.accountService.createAccount(newAccount.personId, newAccount.balance, newAccount.dailyWithdrawalLimit);
  }
}
