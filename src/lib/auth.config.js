import Google from "@auth/core/providers/google"
import GitHub from '@auth/core/providers/github'
import Discord from '@auth/core/providers/discord'
import Credentials from "@auth/core/providers/credentials"
import Nodemailer from "@auth/core/providers/nodemailer"
import { obtenerUsuarioPorEmail } from "@/lib/data/users"



import { htmlTemplate, textTemplate } from "@/lib/utils/email-templates"
import { createTransport } from "nodemailer"

const AuthConfig = {
    providers: [
        Google({ allowDangerousEmailAccountLinking: true }),
        GitHub({ allowDangerousEmailAccountLinking: true }),
        Discord({ allowDangerousEmailAccountLinking: true }),
        Credentials({
            async authorize(credentials) {
                const user = await obtenerUsuarioPorEmail(credentials.email)
                if (!user) return null
                return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role }
            },
        }),
        Nodemailer({
            server: {
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            },
            from: process.env.EMAIL_FROM,
            async sendVerificationRequest({ identifier: email, url, provider: { server, from }, theme }) {
                const { host } = new URL(url)
                const transport = createTransport(server)
                const result = await transport.sendMail({
                    to: email,
                    from: from || 'Pizzería MM <noreply@pizzeria.com>',
                    subject: `Inicia sesión en Pizzería MM`,
                    text: textTemplate({ url, host }),
                    html: htmlTemplate({ url, host }),
                })
                const failed = result.rejected.concat(result.pending).filter(Boolean)
                if (failed.length) {
                    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
                }
            },
        })
    ]
}


export default AuthConfig;