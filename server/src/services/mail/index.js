import nodemailer from 'nodemailer';
export default {
    sendMail: async (mailOptions) => {
        try {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MS_USER,
                    pass: process.env.MS_PW
                }
            });
            
            await transporter.sendMail({
                from: 'mieumieu.nodejs@gmail.com',
                ...mailOptions
            });

            return true
        }catch (err) {
            return false
        }
    },
    sendMailMessage: async function (to, subject, message) {
        let mailOptions = {
            to,
            subject: "Miêu Store thông báo về việc: " + subject,
            html: message
        }

        return await this.sendMail(mailOptions);
    }
}

// {
//     to: "mieuteacher@gmail.com",
//     subject: "Thử nghiệm send mail with node js aaaa",
//     html: template
// }