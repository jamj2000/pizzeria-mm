import Link from 'next/link';
import { MailCheck } from 'lucide-react';

export default function VerifyRequestPage() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full relative bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900/50">
        {/* Decoración de fondo */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-orange-200/30 dark:bg-orange-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-300/20 dark:bg-orange-800/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-10 text-center border border-white/50 dark:border-zinc-800/50">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 animate-pulse" />
              <div className="relative p-5 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 rounded-2xl shadow-inner">
                <MailCheck className="size-10 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight">
            ¡Revisa tu bandeja de entrada!
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed text-md">
            Te hemos enviado un enlace mágico para iniciar sesión. Haz clic en él y estarás dentro en un segundo.
          </p>

          <div className="space-y-6">

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-500 flex flex-col gap-1">
                <span>¿No encuentras el correo?</span>
                <span className="font-medium text-zinc-400">Revisa la carpeta de spam o promociones.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
        <div className="flex items-center gap-3">
          <span className="w-12 h-px bg-zinc-300 dark:bg-zinc-700"></span>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} • Pizzería MM
          </span>
          <span className="w-12 h-px bg-zinc-300 dark:bg-zinc-700"></span>
        </div>
      </div>
    </div>
  );
}
