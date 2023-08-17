/* Create Express Router */
import express from 'express'
const router = express.Router()
import multer from 'multer';

import productController from '../../controllers/product.controller';

const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/products')
    },
    filename: function (req, file, cb) {
      cb(null, `product_${Date.now() * Math.random()}.${file.mimetype.split('/')[1]}`)
    }
  })
  
const uploadProduct = multer({ storage: productStorage })
  
router.post('/',uploadProduct.array('pictures'), productController.create)
router.get('/', productController.findMany)
router.get('/:product_id', productController.findById)
export default router;