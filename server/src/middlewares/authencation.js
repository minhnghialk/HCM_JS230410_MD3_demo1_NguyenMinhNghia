import jwt from "../services/jwt";

export default {
    checkResendEmail: function(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(200).json({
                message: "Please login!"
            })
        }
        let tokenCheck = jwt.verifyToken(req.headers.authorization);
        if (!tokenCheck) {
            return res.status(200).json({
                message: "Token invalid!"
            })
        }
        
        if (!tokenCheck.data.email_confirm) {
            req.body = tokenCheck.data;
            next();
        }else {
            return res.status(200).json({
                message: "Email đã được xác thực!"
            })
        }
    },
    checkChangePassword: function(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(200).json({
                message: "Please login!"
            })
        }
        let tokenCheck = jwt.verifyToken(req.headers.authorization);
        if (!tokenCheck) {
            return res.status(200).json({
                message: "Token invalid!"
            })
        }
        req.body.data = tokenCheck.data
        next();
    }
}