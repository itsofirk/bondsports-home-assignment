import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccountId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const accountId = parseInt(request.params.accountId, 10);
    if (isNaN(accountId)) {
      throw new Error('Invalid accountId');
    }
    return accountId;
  },
);