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

  res.send({
    status: 'success',
    data: {
      books: notes
    }
  }).status(200)
}) as RequestHandler)

app.get('/api/v1/notes/:notesId', (async (req: express.Request, res: express.Response) => {
  const notes = await Notes.findById(req.params.notesId).exec()

  if (notes === null) {
    res.send({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    }).status(404)
  } else {
    res.send(notes).status(200)
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
  res.send(req.params.notesId)
}) as RequestHandler)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
