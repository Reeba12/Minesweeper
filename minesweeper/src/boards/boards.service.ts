import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BoardsService {
  constructor(@InjectModel('Board') private boardModel: Model<any>) {}

  async createBoard(body: any) {
    const { email, board_name, width, height, mines } = body;
    if (
      !email ||
      !board_name ||
      !width ||
      !height ||
      !mines ||
      mines > width * height
    ) {
      throw new BadRequestException('Invalid input');
    }

    // Generate board: 0 = empty, 1 = mine
    const board = Array.from({ length: height }, () => Array(width).fill(0));
    let placed = 0;
    while (placed < mines) {
      const rows = Math.floor(Math.random() * height);
      const cols = Math.floor(Math.random() * width);
      if (board[rows][cols] === 0) {
        board[rows][cols] = 1;
        placed++;
      }
    }

    const created = await this.boardModel.create({
      email,
      board_name,
      width,
      height,
      mines,
      generated_board: board,
    });

    return {
      id: created._id,
      email: created.email,
      board_name: created.board_name,
      generated_board: created.generated_board,
      created_at: created.created_at,
    };
  }

  async getRecentBoards() {
    const boards = await this.boardModel
      .find({}, { email: 1, board_name: 1, created_at: 1 })
      .sort({ created_at: -1 })
      .limit(10)
      .lean();

    return boards.map(b => ({
      id: b._id,
      email: b.email,
      board_name: b.board_name,
      created_at: b.created_at,
    }));
  }

  async getBoards(board_name?: string, page?: string, perPage?: string) {
    const filter: any = {};
    if (board_name) {
      filter.board_name = { $regex: board_name, $options: 'i' };
    }

    const pageNum = Math.max(parseInt(page || '1', 10), 1);
    const perPageNum = Math.max(parseInt(perPage || '10', 10), 1);

    const skip = (pageNum - 1) * perPageNum;

    const [boards, total] = await Promise.all([
      this.boardModel
        .find(filter, { email: 1, board_name: 1, created_at: 1 })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(perPageNum)
        .lean(),
      this.boardModel.countDocuments(filter),
    ]);

    return {
      total,
      page: pageNum,
      perPage: perPageNum,
      boards: boards.map(b => ({
        id: b._id,
        email: b.email,
        board_name: b.board_name,
        created_at: b.created_at,
      })),
    };
  }
}
