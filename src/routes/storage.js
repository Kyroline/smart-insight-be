import { Router } from 'express'
import fileUpload from 'express-fileupload'

const router = Router()

router.post('', fileUpload(), (req, res) => {
    
})