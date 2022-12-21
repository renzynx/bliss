import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { NormalError, UserResponse } from "../../lib/types";
import { toFieldError } from "../../lib/utils";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const messages = (exception.getResponse() as NormalError).message;

    console.log(messages);

    response.status(status).json({
      user: null,
      errors:
        messages && messages instanceof Array
          ? toFieldError(messages)
          : (exception.getResponse() as UserResponse).errors,
    });
  }
}
