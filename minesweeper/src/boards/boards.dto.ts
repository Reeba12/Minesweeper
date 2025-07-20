import { IsNumber, IsNotEmpty, Min, IsString } from "class-validator";

export class CreateBoardDto {
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    width: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    height: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    mines: number;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    board_name: string;
}