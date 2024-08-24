import nodeMailer from 'nodemailer'
import { configDotenv } from 'dotenv'

configDotenv()

const { MAIL_USER, MAIL_PASS } = process.env

const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
})

const MailConfig = {
  sendMail({ mailTo, subject, html, from = 'Chat app alan', ...more }) {
    transporter.sendMail({
      from: from,
      to: mailTo,
      subject: subject,
      html: html,
      ...more,
    })
  },
}

export default MailConfig
