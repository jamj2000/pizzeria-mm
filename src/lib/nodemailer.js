'use server'

// TODO: Revisar esto


import nodemailer from 'nodemailer'

const server = {
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
}

const transporter = nodemailer.createTransport(server)

export async function sendMail(options) {
    return transporter.sendMail(options)
}