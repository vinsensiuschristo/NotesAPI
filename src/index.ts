import 'dotenv/config'
import express, { type RequestHandler } from 'express'
import { connect, model } from 'mongoose'
import { notesSchema } from './schema/notes'

import notesRoutes from './routes/index'

const app = express()

const Notes = model('Notes', notesSchema)
const mongoURI = process.env.MONGODB_URI ?? 'http://localhost:27017'
const port = process.env.PORT

app.use(express.json())
app.use(notesRoutes)

async function run (): Promise<any> {
  await connect(mongoURI)

  console.log('Mongoose Connect')
}

run().catch(err => { console.log(err) })

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Health check ouk')
})

// app.get('/api/v1/notes', getNotes)

app.get('/api/v1/notes/:notesId', (async (req: express.Request, res: express.Response) => {
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
}) as RequestHandler)

app.post('/api/v1/notes', (async (req: express.Request, res: express.Response) => {
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
}) as RequestHandler)

app.put('/api/v1/notes/:notesId', (async (req: express.Request, res: express.Response) => {
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
}) as RequestHandler)

app.delete('/api/v1/notes/:notesId', (async (req: express.Request, res: express.Response) => {
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
}) as RequestHandler)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
