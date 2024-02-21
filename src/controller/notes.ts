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

const getNote = (async (req: express.Request, res: express.Response) => {
  const { notesId } = req.params

  if (notesId.length !== 24) {
    return res.status(404).send({
      status: 'fail',
      message: 'Id harus mempunyai panjang 24'
    })
  }

  const notes = await Notes.findById(req.params.notesId).exec()

  try {
    if (notes === null) {
      res.status(404).send({
        status: 'fail',
        message: 'Buku tidak ditemukan'
      })
    } else {
      res.status(200).send({
        status: 'success',
        data: {
          book: notes
        }
      })
    }
  } catch (e: any) {
    res.status(500).send({
      status: 'fail',
      message: e.message
    }).status(500)
  }
}) as RequestHandler

const postNote = (async (req: express.Request, res: express.Response) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body
  let finished: boolean = false
  const createdAt = new Date()
  const updatedAt = createdAt

  if (pageCount === readPage) {
    finished = true
  }

  if (readPage > pageCount) {
    return res.status(400).send({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
  }

  try {
    const notes = new Notes({
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      finished,
      readPage,
      reading,
      createdAt,
      updatedAt
    })

    await notes.save()

    res.status(201).send({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: notes._id
      }
    })
  } catch (err: any) {
    res.status(400).send({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
  }
}) as RequestHandler

const putNote = (async (req: express.Request, res: express.Response) => {
  const { notesId } = req.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body
  let finished: boolean = false
  const updatedAt = new Date()

  if (pageCount === readPage) {
    finished = true
  }

  if (name === null || name === undefined) {
    return res.status(400).send({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
  }

  const filter = { _id: notesId }
  const updatedField = { name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt }

  if (notesId.length !== 24) {
    return res.status(404).send({
      status: 'fail',
      message: 'Id harus lebih dari 24'
    })
  }

  if (readPage > pageCount) {
    return res.status(400).send({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
  }

  try {
    const update = await Notes.findOneAndUpdate(filter, updatedField, {
      new: true
    })

    if (update === null) {
      res.status(404).send({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      })
    } else {
      res.status(200).send({
        status: 'success',
        message: 'Buku berhasil diperbaharui'
      })
    }
  } catch (e: any) {
    res.status(500).send({
      status: 'fail',
      message: e.message
    })
  }
}) as RequestHandler

const deleteNote = (async (req: express.Request, res: express.Response) => {
  const { notesId } = req.params
  const filter = { _id: notesId }

  if (notesId.length !== 24) {
    return res.status(400).send({
      status: 'fail',
      message: 'Id harus mempunyai panjang 24'
    })
  }

  try {
    const deleteNotes = await Notes.findOneAndDelete(filter)

    if (deleteNotes === null) {
      return res.status(404).send({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
      })
    } else {
      return res.status(200).send({
        status: 'success',
        message: 'Buku berhasil dihapus'
      })
    }
  } catch (e: any) {
    res.status(500).send({
      status: 'fail',
      message: e.message
    })
  }
}) as RequestHandler
export default { getNotes, getNote, postNote, putNote, deleteNote }
