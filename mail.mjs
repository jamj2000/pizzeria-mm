// mail.mjs
import nodemailer from 'nodemailer'

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,       // true para 465, false para 587
  auth: {
    user: "jamj2000@gmail.com", // coloca aquí tu usuario
    pass: "oflyatbtmlpbfeha", // La contraseña de aplicación (16 caracteres sin espacios)
  }
})


// async..await no está permitido en el global scope, debemos usar un wrapper
async function sendMail() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"José Antonio Muñoz Jiménez 👻" <jamj2000@gmail.com>',
    to: "jamj2000@gmail.com, jamunoz@iesincagarcilaso.com, adfadcaxs@afdaadxcdf.com",
    subject: "Ejemplo con Nodemailer ✔",
    text: "Mensaje de prueba. Ignoralo.",
    html: "<h1>Mensaje de prueba</h1><p>Ignoralo</p>"
  });

  console.log("Mensaje enviado: %s", info.messageId);
  // Mensaje enviado: <d786aa62-4e0a-070a-47ed-0b0666549519@jamj2000.eu>
  console.log('MENSAJES ACEPTADOS: ', info.accepted);
  console.log('MENSAJES RECHAZADOS: ', info.rejected);
}

sendMail().catch(console.error);
