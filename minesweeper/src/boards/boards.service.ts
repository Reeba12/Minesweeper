import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BoardsService {
  constructor(@InjectModel('Board') private boardModel: Model<any>) { }


  private generateMinesweeperBoard(width: number, height: number, mines: number): number[][] {
    const board = Array(height).fill(null).map(() => Array(width).fill(0));

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      // generates random row index (0 to height-1)
      const row = Math.floor(Math.random() * height);
      // generates random column index (0 to width-1)
      const col = Math.floor(Math.random() * width);

      /**
       * Checks if the cell doesn't already contain a mine (!== -1)
       * Places mine (-1) and increments counter
       * If cell already contains a mine, it skips placing a new mine
       * Mines are represented as -1 in the board array
       */
      if (board[row][col] !== -1) {
        board[row][col] = -1;
        minesPlaced++;
      }
    }

    /**
     * Iterates through each cell in the board
     * If the cell doesn't contain a mine, it checks all 8 adjacent cells
     * If the adjacent cell contains a mine, it increments the count
     * The count is stored in the cell
     * Mines are represented as -1 in the board array
     * Numbers are represented as 0-8 in the board array
     */
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (board[row][col] !== -1) {
          let count = 0;
          for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
              const newRow = row + r;
              const newCol = col + c;
              /**
               * Checks if the adjacent cell is within the board boundaries
               * Checks if the adjacent cell contains a mine
               * If both conditions are true, increments the count
               */
              if (newRow >= 0 && newRow < height &&
                newCol >= 0 && newCol < width &&
                board[newRow][newCol] === -1) {
                count++;
              }
            }
          }
          board[row][col] = count;
        }
      }
    }

    return board;
  }

  async createBoard(body: any) {
    const { email, board_name, width, height, mines } = body;
    if (mines > width * height) {
      throw new BadRequestException('Number of mines cannot exceed board size');
    }

    const board = this.generateMinesweeperBoard(width, height, mines);

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
