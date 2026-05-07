import Google from "@auth/core/providers/google"
import GitHub from '@auth/core/providers/github'
import Credentials from "@auth/core/providers/credentials"
import Nodemailer from "@auth/core/providers/nodemailer"
import { obtenerUsuarioPorEmail } from "@/lib/data/users"

const AuthConfig = {
    providers: [
        Google,
        GitHub,
        Credentials({
            async authorize(credentials) {
                const user = await obtenerUsuarioPorEmail(credentials.email)
                if (!user) return null
                return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role }
            },
        }),
        Nodemailer({
            server: {
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            },
            from: process.env.EMAIL_FROM,
        })
    ]
}

export default AuthConfig;