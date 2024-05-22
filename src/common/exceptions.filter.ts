import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;
      response.status(status).json({ statusCode: status, message: message });
    } else {
      response.status(HttpStatus.BAD_REQUEST).json({
        message: exception.message || 'Internal server error',
      });
    }
  }
}
