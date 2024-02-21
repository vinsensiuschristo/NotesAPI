import { type z, ZodError } from 'zod'
import { type Request, type Response, type NextFunction } from 'express'

export function validate (schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMsg = err.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`
        }))
        res.status(400).json({
          error: 'Invalid data',
          details: errorMsg
        })
      } else {
        res.status(400).json({
          error: 'Invalid server error'
        })
      }
    }
  }
}
