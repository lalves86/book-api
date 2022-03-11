import crypto from 'crypto'
import multer from 'multer'
import { resolve } from 'path'

const uploadFolder = resolve(__dirname, '..', '..', '..', 'uploads')

export default {
  uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename: (req, file, cb) => {
      const fileHash = crypto.randomBytes(10).toString('hex')
      const fileName = `${fileHash}-${file.originalname}`

      return cb(null, fileName)
    }
  })
}
