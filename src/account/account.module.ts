import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Person } from 'src/entities/person.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Person, Transaction]),
  ],
  providers: [AccountService, TransactionService],
  controllers: [AccountController]
})
export class AccountModule {}
