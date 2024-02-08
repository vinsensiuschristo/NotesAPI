import { Schema } from 'mongoose'

// Schema
export const notesSchema = new Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  author: { type: String, required: true },
  summary: { type: String, required: true },
  publisher: { type: String, required: true },
  pageCount: { type: Number, required: true },
  readPage: { type: Number, required: true },
  finished: { type: Boolean, required: true },
  reading: { type: Boolean, required: true },
  createdAt: { type: String, required: true },
  updatedAt: String
})
