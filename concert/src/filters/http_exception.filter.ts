import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseException = exception.getResponse();
    if ((ctx as unknown as any)?.contextType === 'telegraf') return;
    response?.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof responseException === 'object' && responseException !== null
        ? responseException
        : { message: responseException }),
    });
  }
}
