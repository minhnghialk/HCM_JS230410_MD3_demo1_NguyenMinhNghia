import express from 'express'
const router = express.Router()

import purchaseController from '../../controllers/purchase.controller';

router.post('/:user_id', purchaseController.addToCart)
router.get('/:user_id', purchaseController.findCart)

export default router;