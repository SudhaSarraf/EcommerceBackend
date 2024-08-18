import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}