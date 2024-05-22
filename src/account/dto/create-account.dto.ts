import { IsBoolean, IsEmpty, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsNumber()
  personId: number;

  @IsNumber()
  balance: number = 0;

  @IsNumber()
  @Min(0)
  dailyWithdrawalLimit: number = 0;

  @IsBoolean()
  activeFlag: boolean = true;

  @IsNumber()
  accountType: number = 1;  // TODO: use enum

  @IsEmpty({ message: 'createDate is not allowed' })
  createDate: Date;
}
