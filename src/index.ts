import 'dotenv/config'
import express from 'express'
import { connect } from 'mongoose'

import notesRoutes from './routes/index'

const app = express()

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
// app.get('/api/v1/notes/:notesId'
// app.post('/api/v1/notes'
// app.put('/api/v1/notes/:notesId'
// app.delete('/api/v1/notes/:notesId'

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
