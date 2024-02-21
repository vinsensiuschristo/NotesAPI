import type express from 'express'
import { Router } from 'express'

const userRoutes = Router()

userRoutes.post('/api/v1/users', (req: express.Request, res: express.Response) => {
  res.send({
    message: 'user create account'
  })
})

userRoutes.post('/api/v1/login', (req: express.Request, res: express.Response) => {
  res.send({
    message: 'user login'
  })
})

userRoutes.put('/api/v1/users/:userId', (req: express.Request, res: express.Response) => {
  res.send({
    message: 'user put'
  })
})

userRoutes.delete('/api/v1/users/:userId', (req: express.Request, res: express.Response) => {
  res.send({
    message: 'user delete'
  })
})

export default userRoutes
