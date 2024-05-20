import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '../entities/account.entity';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(@Body() createAccountDto: { personId: number; balance: number; dailyWithdrawalLimit: number }): Promise<Account> {
    return this.accountService.createAccount(createAccountDto.personId, createAccountDto.balance, createAccountDto.dailyWithdrawalLimit);
  }
}
