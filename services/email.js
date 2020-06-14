const mail = require("nodemailer")
const config = require("../config/config")

module.exports = async (to, subject, html) => {

  let transport = mail.createTransport({
    service: config.smtpCredentials.service,
    auth: {
      user: config.smtpCredentials.user,
      pass: config.smtpCredentials.pass
    }
  })
  
  let mailOptions = {
    from: config.smtpCredentials.user,
    to: to,
    subject: subject,
    html: html
  } 
  
  await transport.sendMail(mailOptions, (err, info) => {
    
    if(err) {
      console.error(err)
      return false
    }

    return true

  })

}