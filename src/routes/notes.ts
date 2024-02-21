import { Router } from 'express'
import notes from '../controller/notes'

const notesRoutes = Router()

notesRoutes.get('/api/v1/notes', notes.getNotes)
notesRoutes.get('/api/v1/notes/:notesId', notes.getNote)
notesRoutes.post('/api/v1/notes', notes.postNote)
notesRoutes.put('/api/v1/notes/:notesId', notes.putNote)
notesRoutes.delete('/api/v1/notes/:notesId', notes.deleteNote)

export default notesRoutes
