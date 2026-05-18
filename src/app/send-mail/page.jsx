'use client'

import { useState } from 'react'
// import { sendMail } from '@/lib/nodemailer'
import { sendMail } from '@/lib/actions/email'


export default function SendMailPage() {
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)
        const to = formData.get('to')?.toString() ?? ''
        const subject = formData.get('subject')?.toString() ?? ''
        const text = formData.get('text')?.toString() ?? ''

        try {
            const response = await sendMail({ to, subject, text })
            setResult({ success: true, data: response })
        } catch (err) {
            setResult({ success: false, error: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#ff9a9e] to-[#fad0c4] p-4 font-sans">
            <form
                onSubmit={handleSubmit}
                className="bg-white/80 p-8 rounded-2xl shadow-2xl shadow-gray-900/20 w-full max-w-[420px] backdrop-blur-md border border-white/20"
            >
                <h2 className="text-center mb-6 text-gray-800 text-3xl font-bold tracking-tight">
                    Enviar Email
                </h2>

                <div className="mb-4">
                    <label htmlFor="to" className="block mb-1.5 text-gray-600 text-sm font-medium ml-1">
                        Destinatario
                    </label>
                    <input
                        id="to"
                        type="email"
                        name="to"
                        placeholder="ejemplo@correo.com"
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 text-gray-700 text-base outline-none transition-all duration-200 focus:border-[#ff6f61] focus:ring-2 focus:ring-[#ff6f61]/20 bg-white/50"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="subject" className="block mb-1.5 text-gray-600 text-sm font-medium ml-1">
                        Asunto
                    </label>
                    <input
                        id="subject"
                        type="text"
                        name="subject"
                        placeholder="Asunto del mensaje"
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 text-gray-700 text-base outline-none transition-all duration-200 focus:border-[#ff6f61] focus:ring-2 focus:ring-[#ff6f61]/20 bg-white/50"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="text" className="block mb-1.5 text-gray-600 text-sm font-medium ml-1">
                        Mensaje
                    </label>
                    <textarea
                        id="text"
                        name="text"
                        placeholder="Escribe tu mensaje aquí..."
                        rows={5}
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 text-gray-700 text-base outline-none transition-all duration-200 focus:border-[#ff6f61] focus:ring-2 focus:ring-[#ff6f61]/20 bg-white/50 resize-vertical min-h-[120px]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-4 text-white rounded-xl text-lg font-bold shadow-xl transition-all duration-300 transform active:scale-95 ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#ff6f61] hover:bg-[#ff5a4d] shadow-[#ff6f61]/30 hover:shadow-[#ff6f61]/40'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enviando...
                        </span>
                    ) : (
                        'Enviar Mensaje'
                    )}
                </button>

                {result && (
                    <div
                        className={`mt-6 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${result.success
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2 font-bold">
                            {result.success ? (
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            {result.success ? 'Correo enviado' : 'Error en el envío'}
                        </div>
                        <pre className="text-xs bg-white/50 p-2 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                            {JSON.stringify(result.data || result.error, null, 2)}
                        </pre>
                    </div>
                )}
            </form>
        </div>
    )
}
