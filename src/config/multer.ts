import multer from 'multer'

export default {
  upload() {
    return {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024 // limite de 5MB por imagem
      }
    }
  }
}