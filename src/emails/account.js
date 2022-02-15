const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name) =>{
    sgMail.send({
    to:email,
    from:'apromadee@gmail.com',
    subject:'Thank you for joining in!',
    text:`Hi ${name}, Thank you for joining our team! `
    })   
}
const sendCancelationEmail = (email,name) =>{
    sgMail.send({
        to: email,
        from:'apromadee@gmail.com',
        subject:'Cancelation',
        text:`Hello ${name}, Your email has been canceled`
    })

}

module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}
