import { Catch, ArgumentsHost, HttpStatus, HttpException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response, response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { EmptyRecordException } from './common/empty-record.exception';
import { LoggerService } from './logger.service.ts/logger.service';


type MyResponseObj = {
    statusCode: number;
    timeStamp: string,
    path: string,
    response: string | object,
};

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new LoggerService(AllExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const myResponseObj: MyResponseObj = {
            statusCode: 500,
            timeStamp: new Date().toISOString(),
            path: request.url,
            response: ''
        };

        if (exception instanceof HttpException) {
            myResponseObj.statusCode = exception.getStatus();
            myResponseObj.response = exception.getResponse();
        }
        else if (exception instanceof QueryFailedError) {
            if (exception.driverError.code === "ER_DUP_ENTRY") {
                myResponseObj.statusCode = HttpStatus.CONFLICT;
                myResponseObj.response = "Record already exists in database";
            }

        }
        else if (exception instanceof EmptyRecordException) {
            myResponseObj.statusCode = HttpStatus.BAD_REQUEST;
            myResponseObj.response = exception.message;
        }else if(exception instanceof BadRequestException){
            myResponseObj.statusCode = HttpStatus.BAD_REQUEST;
            myResponseObj.response = exception.message;
        }
        else {
            myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            myResponseObj.response = 'Internal Server Error';
        }

        response
            .status(myResponseObj.statusCode)
            .json(myResponseObj);

        this.logger.error(JSON.stringify(myResponseObj.response), AllExceptionFilter.name);

        super.catch(exception, host);
    }
}