import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class GetByPeriodDto {
    @IsOptional()
    @IsDate()
    @Transform(({value}) => new Date(value))
    startDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({value}) => new Date(value))
    endDate?: Date;
}