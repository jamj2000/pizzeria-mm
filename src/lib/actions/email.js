'use server'

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendMail({ to, subject, text, html }) {
  const mailTo = to || process.env.EMAIL_TO || ''
  const mailSubject = subject || "Ejemplo con Nodemailer ✔"
  const mailText = text || "Mensaje de prueba. Ignoralo."
  const mailHtml = html || "<h1>Mensaje de prueba</h1><p>Ignoralo</p>"

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Pizzería MM <noreply@pizzeria.com>',
      to: mailTo,
      subject: mailSubject,
      text: mailText,
      html: mailHtml
    });

    console.log("Mensaje enviado: %s", info.messageId);
    console.log('MENSAJES ACEPTADOS: ', info.accepted);
    console.log('MENSAJES RECHAZADOS: ', info.rejected);

    return { success: 'Correo enviado correctamente', messageId: info.messageId }
  } catch (error) {
    console.error("Error al enviar el correo:", error)
    return { error: 'Error al enviar el correo: ' + error.message }
  }
}
