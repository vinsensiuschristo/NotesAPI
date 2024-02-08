import 'dotenv/config'
import express, { type RequestHandler } from 'express'
import { connect, model } from 'mongoose'
import { notesSchema } from './schema/notes'

const app = express()

const Notes = model('Notes', notesSchema)
const mongoURI = process.env.MONGODB_URI ?? 'http://localhost:27017'
const port = process.env.PORT

app.use(express.json())

async function run (): Promise<any> {
  await connect(mongoURI)

  console.log('Mongoose Connect')
}

run().catch(err => { console.log(err) })

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Health check ouk')
})

app.get('/api/v1/notes', (async (req: express.Request, res: express.Response) => {
  const notes = await Notes.find().select({ _id: 1, name: 1, publisher: 1 })

  if (notes === null) {
    res.send({
      status: 'success',
      data: {
        book: []
      }
    })
  } else {
    res.send({
      status: 'success',
      data: {
        books: notes
      }
    }).status(200)
  }
}) as RequestHandler)

app.get('/api/v1/notes/:notesId', (async (req: express.Request, res: express.Response) => {
  const { notesId } = req.params

  if (notesId.length !== 24) {
    return res.send({
      status: 'fail',
      message: 'Id harus mempunyai panjang 24'
    }).status(404)
  }

  const notes = await Notes.findById(req.params.notesId).exec()

  try {
    if (notes === null) {
      res.send({
        status: 'fail',
        message: 'Buku tidak ditemukan'
      }).status(404)
    } else {
      res.send({
        status: 'success',
        data: {
          book: notes
        }
      }).status(200)
    }
  } catch (e: any) {
    res.send({
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

    res.send({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: notes._id
      }
    }).status(201)
  } catch (err: any) {
    res.send({
      message: err.message,
      error: true
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

  const filter = { _id: notesId }
  const updatedField = { name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt }

  if (notesId.length !== 24) {
    return res.send({
      status: 'fail',
      message: 'Id harus mempunyai panjang 24'
    }).status(400)
  }

  if (readPage > pageCount) {
    return res.send({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).status(400)
  }

  try {
    const update = await Notes.findOneAndUpdate(filter, updatedField, {
      new: true
    })

    if (update === null) {
      res.send({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      }).status(404)
    } else {
      res.send({
        status: 'success',
        message: 'Buku berhasil diperbaharui'
      }).status(200)
    }
  } catch (e: any) {
    res.send({
      status: 'fail',
      message: e.message
    })
  }
}) as RequestHandler)

app.delete('/api/v1/notes/:notesId', (async (req: express.Request, res: express.Response) => {
  const { notesId } = req.params
  const filter = { _id: notesId }

  if (notesId.length !== 24) {
    return res.send({
      status: 'fail',
      message: 'Id harus mempunyai panjang 24'
    })
  }

  try {
    const deleteNotes = await Notes.findOneAndDelete(filter)

    if (deleteNotes === null) {
      return res.send({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
      }).status(404)
    } else {
      return res.send({
        status: 'success',
        message: 'Buku berhasil dihapus'
      }).status(200)
    }
  } catch (e: any) {
    res.send({
      status: 'fail',
      message: e.message
    })
  }
}) as RequestHandler)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
