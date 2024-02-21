import { Schema } from 'mongoose'

export const usersSchema = new Schema({
  nim: { type: 'String', unique: true, required: true },
  name: { type: 'String', required: true },
  password: { type: 'String', required: true },
  alamat: { type: 'String', required: true },
  email: { type: 'String', required: true, unique: true }
})
