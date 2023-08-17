import userModel from "../models/user.model";
import mailService from '../services/mail';
import ejs from 'ejs'
import path from 'path'
import jwt from '../services/jwt';
import bcrypt from 'bcrypt';
import ipService from '../services/ip'
import {uploadFileToStorage} from '../meobase'
import fs from 'fs';
async function sendMailLogin(user, ip) {
    let result = await ipService.deIp(ip); // 5.181.233.162
    /* Xử lý email */
    try {
        let mailSent = await mailService.sendMail({
            to: user.email,
            subject: "Thông báo về tài khoản",
            html: `
                <h1 style="color: red">
                    ${
                        result.status == "fail" 
                        ?
                            "Tài khoản đã login tại địa chỉ ip là: " + ip
                        : "Tài khoản đã login tại: quốc gia: " + result.country  + " với ip là: " +result.query
                    }

                </h1>
            `
        });
    }catch(err) {
        //console.log("err", err)
    }
}

export default {
    /* Register */
    create: async (req, res) => {
        try {
            /* Hash Password */
            req.body.password = await bcrypt.hash(req.body.password, 10);

            /* Call model add new user */
            let modelRes = await userModel.create(req.body)

            /* Xử lý email */
            try {
                if (modelRes.status) {
                    let token = jwt.createToken({
                        user_name: req.body.user_name,
                        email: req.body.email
                    }, 300000)

                    if (!token) {
                        return res.status(200).json({
                            message: "Đăng ký thành công, nhưng gửi mail thất bại!"
                        })
                    }

                    let template = await ejs.renderFile(
                        path.join(__dirname, "../templates/email_confirm.ejs"), 
                        {user: req.body, token}
                    )

                    if (modelRes.status) {
                        let mailOptions = {
                            to: req.body.email,
                            subject: "Xác thực email!",
                            html: template
                        }

                        let mailSent = await mailService.sendMail(mailOptions);

                        if(mailSent) {
                            modelRes.message += " Đã gửi email xác thực, vui lòng kiểm tra!"
                        }
                    }
                }
            }catch(err) {
                modelRes.message += " Lỗi trong quá trình gửi mail xác thực, bạn có thể gửi lại email trong phần profile"
            }

            /* Register Res */
            res.status(modelRes.status ? 200 : 213).json(modelRes)
        } catch (err) {

            /* Register Res */
            return res.status(500).json(
                {
                    message: "Lỗi xử lý!"
                }
            )
        }
    },
    /* Login */
    login: async (req, res) => {
        try {
            /* Gọi login model */
            let modelRes = await userModel.login(req.body)


            if (modelRes.status) {
                // xác thực passord
                let checkPassword = await bcrypt.compare(req.body.password, modelRes.data.password)
                if (!checkPassword) {
                    modelRes.message = "Mật khẩu không chính xác!"
                    return res.status(213).json(modelRes)
                }
                // xác thực trạng thái tài khoản
                if (modelRes.data.blocked) {
                    modelRes.message = "Tài khoản đã bị khóa!"
                    return res.status(213).json(modelRes)
                }
                // thành công xử lý token
                let token = jwt.createToken(modelRes, "1d");

                // gửi mail thông báo về tình hình đăng nhập nếu đã xác nhận email.
                let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // địa chỉ ip nơi gửi request
                sendMailLogin(modelRes.data, ipAddress);

                // trả về client
                return res.status(token ? 200 : 213).json(
                    {
                        message: token  ? "Login thành công!" : "Server bảo trì!",
                        token
                    }
                )
            }
            
            return res.status(modelRes.status ? 200 : 213).json(modelRes)
        } catch (err) {
            return res.status(500).json(
                {
                    message: "Lỗi xử lý!"
                }
            )
        }
    },
    /* Update Information */
    update: async (req, res) => {
        try {
            /* Call model edit users */
            let modelRes = await userModel.update(req.params.userId, req.body)

            if (modelRes.status) {
                let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // địa chỉ ip nơi gửi request
                 /* Gửi mail thông báo */
                mailService.sendMailMessage(
                    modelRes.data.email, 
                    "CẬP NHẬT THÔNG TIN CÁ NHÂN",
                    `
                        <h1 style="color: red"> Đã thay đổi thông tin vào lúc ${new Date(Date.now()).getHours()}h-${new Date(Date.now()).getMinutes()}p cùng ngày!</h1>
                        <p> Ip thực hiện yêu cầu: ${ipAddress}</p>
                        <p> Nếu quý khách không thực hiện hãy liên hệ khẩn cấp với chúng tôi qua hotline: 0329 577 177</p>
                    `
                )

                delete modelRes.data;
            }

            /* update Res */
            res.status(modelRes.status ? 200 : 213).json(modelRes)
        } catch (err) {

            /* Register Res */
            return res.status(500).json(
                {
                    message: "Lỗi xử lý!"
                }
            )
        }
    },
    /* Update Information */
    updateAvatar: async (req, res) => {
        try {
            /* Upload to firebase */
            let avatarUrl = await uploadFileToStorage(req.file, "users", fs.readFileSync(req.file.path));
            fs.unlink(req.file.path, (err) => {});
            req.body.avatar = avatarUrl;

            /* Call model edit users */
            let modelRes = await userModel.update(req.params.userId, req.body)

            if (modelRes.status) {
                let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // địa chỉ ip nơi gửi request
                    /* Gửi mail thông báo */
                mailService.sendMailMessage(
                    modelRes.data.email, 
                    "CẬP NHẬT THÔNG TIN CÁ NHÂN",
                    `
                        <h1 style="color: red"> Đã thay đổi thông tin vào lúc ${new Date(Date.now()).getHours()}h-${new Date(Date.now()).getMinutes()}p cùng ngày!</h1>
                        <p> Ip thực hiện yêu cầu: ${ipAddress}</p>
                        <p> Nếu quý khách không thực hiện hãy liên hệ khẩn cấp với chúng tôi qua hotline: 0329 577 177</p>
                    `
                )

                delete modelRes.data;
            }

            /* update Res */
            res.status(modelRes.status ? 200 : 213).json(modelRes)
        } catch (err) {

            /* Register Res */
            return res.status(500).json(
                {
                    message: "Lỗi xử lý!"
                }
            )
        }
    },
    /* Email Confirm */
    emailConfirm: async (req, res) => {
        try {
            let decode = jwt.verifyToken(req.params.token)

            if (!decode) {
                return res.send("Email đã hết hiệu lực!")
            }

            let modelRes = await userModel.emailConfirm(decode);

            res.status(modelRes.status ? 200 : 213).send("Email đã được xác thực!")

        } catch (err) {
            return res.status(500).json(
                {
                    message: "Bad request !"
                }
            )
        }
    },
    /* Authen Token */
    authenToken: async (req, res) => {
        try {
            let decode = jwt.verifyToken(req.body.token)

            let user = await userModel.userDB.findUnique({
                where: {
                    id: decode.data.id
                }
            })

            return res.status(new Date(decode.data.update_at).toDateString() == user.update_at.toDateString() ? 200: 213 ).json(decode) 
        }catch(err) {
            return res.status(500).json({
                message: "Lỗi server!"
            })
        }
    },
    changePassword: async (req, res) => {
        try {
            let checkPass = await bcrypt.compare(req.body.old_pass, req.body.data.password);

            if (!checkPass) {
                return res.status(200).json({
                    message: "Mật khẩu không chính xác!"
                })
            }

            let token = jwt.createToken(
                {
                    new_pass: await bcrypt.hash(req.body.new_pass, 10),
                    user_name:  req.body.data.user_name
                },300000
            )

            let mailOptions = {
                to: req.body.data.email,
                subject: "Xác thực thay đổi mật khẩu!",
                html: `
                    <h1>Thời gian đổi: ${(new Date(Date.now())).getDay()}</h1>
                    <a href="${process.env.SV_HOST}:${process.env.SV_PORT}/apis/v1/users/change-password-confirm/${token}">Xác nhận đổi</a>
                `
            }

            let mailSent = await mailService.sendMail(mailOptions);
            return res.status(200).json(
                {
                    message: mailSent ? "Đã gửi lại email xác nhận!" : "Lỗi hệ thống"
                }
            )
        }catch(err) {
            return res.status(200).json(
                {
                    message: "Lỗi hệ thống"
                }
            )
        }
    },
    changePasswordConfirm: async (req, res) => {
        try {
            let token = req.params.token;
            let decode = jwt.verifyToken(token);
            if (!decode) {
                return res.status(200).send("Email hết hạn!")
            }else {
                console.log("decode", decode)
                let result = await userModel.update({
                    user_name: decode.user_name,
                    password: decode.new_pass
                })
                if(result.status) {
                    return res.json({
                        message: "Đổi pass thành công!"
                    })
                }
            }
        }catch(err) {

        }
    },
    resend: async (req, res) => {
        try {
            /* Xử lý email */
            let token = jwt.createToken({
                user_name: req.body.user_name,
                email: req.body.email
            }, 300000)

            let template = await ejs.renderFile(
                path.join(__dirname, "../templates/email_confirm.ejs"), 
                {user: req.body, token}
            )

            let mailOptions = {
                to: req.body.email,
                subject: "Xác thực email!",
                html: template
            }

            let mailSent = await mailService.sendMail(mailOptions);
            return res.status(200).json(
                {
                    message: mailSent ? "Đã gửi lại email xác nhận!" : "Lỗi hệ thống"
                }
            )
        }catch(err) {
            return res.status(200).json(
                {
                    message: "Lỗi hệ thống"
                }
            )
        }

    },

}

