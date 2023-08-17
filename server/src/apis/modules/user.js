/* Create Express Router */
import express from 'express'
const router = express.Router()

/* Mildleware */
import multer from 'multer';

import userController from '../../controllers/user.controller';
import authencation from '../../middlewares/authencation';



router.get('/resend',authencation.checkResendEmail,userController.resend)
router.post('/change-password',authencation.checkChangePassword, userController.changePassword)
router.get('/change-password-confirm/:token', userController.changePasswordConfirm)

/* Login */
router.post('/login', userController.login)
/* Update Information Avatar */
const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, `user_${Date.now() * Math.random()}${file.mimetype.split('/')[1]}`)
    }
})
const userUpload= multer({ storage: userStorage })
router.patch('/:userId/avatar', userUpload.single('avatar'), userController.updateAvatar)
/* Update Information */
router.patch('/:userId', userController.update)
/* authen Token */
router.post('/authen-token', userController.authenToken)
/* Register */
router.post('/', userController.create)
/* Email confirm */
router.get('/email/:token', userController.emailConfirm)

export default router;