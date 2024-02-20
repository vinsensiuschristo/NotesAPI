import { Router } from 'express'
import notes from '../controller/notes'

const notesRoutes = Router()

notesRoutes.get('/api/v1/notes', notes.getNotes)
export default notesRoutes
