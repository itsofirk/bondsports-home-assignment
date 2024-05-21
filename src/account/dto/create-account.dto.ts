import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsNumber()
  personId: number;

  @IsNumber()
  balance: number = 0;

  @IsNumber()
  @Min(0)
  dailyWithdrawalLimit: number = 0;
}
