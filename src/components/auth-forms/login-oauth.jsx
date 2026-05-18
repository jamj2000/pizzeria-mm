import { loginGoogle, loginGithub, loginDiscord } from "@/lib/actions/auth"

function OauthForm({ callbackUrl, className, error }) {

  return (
    <form className={className}>
      <input type='hidden' name='callbackUrl' defaultValue={callbackUrl} />

      <h1 className="text-2xl font-bold mb-4 text-blue-500">Autorización Abierta</h1>

      <div className='flex flex-col gap-2'>
        <button formAction={loginGoogle}
          className="mt-2 py-4 w-full relative flex justify-center items-center bg-blue-500 text-white cursor-pointer hover:brightness-110">
          <img src="/images/google.png" alt="Google" className="w-5 h-5 absolute left-4" /> <p className="hover:font-bold">Iniciar sesión con Google</p>
        </button>

        <button formAction={loginGithub}
          className="py-4 w-full relative flex justify-center items-center bg-blue-500 text-white cursor-pointer hover:brightness-110">
          <img src="/images/github.png" alt="Github" className="w-5 h-5 absolute left-4" /> <p className="hover:font-bold">Iniciar sesión con Github</p>
        </button>

        <button formAction={loginDiscord}
          className="py-4 w-full relative flex justify-center items-center bg-blue-500 text-white cursor-pointer hover:brightness-110">
          <img src="/images/discord.png" alt="Discord" className="w-5 h-5 absolute left-4" /> <p className="hover:font-bold">Iniciar sesión con Discord</p>
        </button>
        {error && <p className='text-red-400'>{error}</p>}
      </div>
    </form>
  )
}

export default OauthForm
