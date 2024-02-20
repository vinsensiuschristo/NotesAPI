import { Router } from 'express'
import notesRoutes from './notes'

const router = Router()

router.use(notesRoutes)
export default router
