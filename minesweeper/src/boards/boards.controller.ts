import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './boards.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async createBoard(@Body() body: CreateBoardDto) {
    return this.boardsService.createBoard(body);
  }

  @Get('recent')
  async getRecentBoards() {
    return this.boardsService.getRecentBoards();
  }

  @Get()
  async getBoards(
    @Query('board_name') board_name?: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    return this.boardsService.getBoards(board_name, page, perPage);
  }
}
