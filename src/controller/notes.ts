import type express from 'express'
import { type RequestHandler } from 'express'

import { notesSchema } from '../schema/notes'
import { model } from 'mongoose'

const Notes = model('Notes', notesSchema)

const getNotes = (async (req: express.Request, res: express.Response) => {
  try {
    if (req.query.reading === '1') {
      const notesWithFind = await Notes.find({ reading: true }).select({ _id: 1, name: 1, publisher: 1 })

      return res.status(200).send({
        status: 'success',
        data: {
          books: notesWithFind
        }
      })
    } else if (req.query.reading === '0') {
      const notesWithFind = await Notes.find({ reading: false }).select({ _id: 1, name: 1, publisher: 1 })

      return res.status(200).send({
        status: 'success',
        data: {
          books: notesWithFind
        }
      })
    }

    // IF FINISHED
    if (req.query.finished === '1') {
      const notesWithFind = await Notes.find({ finished: true }).select({ _id: 1, name: 1, publisher: 1 })

      return res.status(200).send({
        status: 'success',
        data: {
          books: notesWithFind
        }
      })
    } else if (req.query.finished === '0') {
      const notesWithFind = await Notes.find({ finished: false }).select({ _id: 1, name: 1, publisher: 1 })

      return res.status(200).send({
        status: 'success',
        data: {
          books: notesWithFind
        }
      })
    }

    // IF NAME
    if (typeof req.query.name !== 'undefined') {
      // console.log('query name undefined')
      const notesWithFind = await Notes.find({ name: { $regex: req.query.name } }).select({ _id: 1, name: 1, publisher: 1 })

      return res.status(200).send({
        status: 'success',
        data: {
          books: notesWithFind
        }
      })
    }

    const notes = await Notes.find().select({ _id: 1, name: 1, publisher: 1 })

    if (notes === null) {
      res.status(200).send({
        status: 'success',
        data: {
          book: []
        }
      })
    } else {
      res.status(200).send({
        status: 'success',
        data: {
          books: notes
        }
      })
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(500).send({
        status: 'error',
        message: `Server error ${e.message}`
      })
    }
  }
}) as RequestHandler

export default { getNotes }
