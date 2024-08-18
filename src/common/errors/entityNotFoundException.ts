import { HttpException } from "@nestjs/common";

export class EntityNotFoundException extends HttpException {
    constructor(message: string = 'Cannot find any data.') {
        super(message, 400)
    }
}