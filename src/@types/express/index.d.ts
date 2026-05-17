import multer from 'multer'

declare global {
  namespace Express {
    interface Request {
      user_id?: string
      file?: multer.File
      files?: multer.File[]
    }
  }
}