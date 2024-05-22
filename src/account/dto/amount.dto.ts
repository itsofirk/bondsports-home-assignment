import { IsNotEmpty, IsNumber } from 'class-validator';

export class AmountDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
