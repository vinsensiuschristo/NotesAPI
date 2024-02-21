import { Router } from 'express'
import notesRoutes from './notes'
import userRoutes from './users'

const router = Router()

router.use(notesRoutes)
router.use(userRoutes)

export default router
