import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const BoardSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  email: { type: String, required: true },
  board_name: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  mines: { type: Number, required: true },
  generated_board: { type: [[Number]], required: true },
  created_at: { type: Date, default: Date.now },
});
