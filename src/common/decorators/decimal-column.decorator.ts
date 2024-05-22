import { Column, ColumnOptions } from 'typeorm';

export function DecimalColumn(options: ColumnOptions = {}):
    PropertyDecorator {
        return Column({
            type: 'decimal',
            precision: 10,
            scale: 2,
            transformer: {
                to: (value) => value,
                from: (value) => parseFloat(value)
            },
            ...options
        });
}