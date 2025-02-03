import { IsString, MaxLength, MinLength } from "class-validator";

export class requestTable{
    @IsString()
    @MinLength(4)
    @MaxLength(255)
    tableName:string
}