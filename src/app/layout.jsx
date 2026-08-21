import "@/app/globals.css";
import Header from "@/components/ui/header";
import { Toaster } from "sonner";
import { Suspense } from "react";

export const metadata = {
  title: "Pizzería Mamma Mia",
  description: "Pizzería Mamma Mia - App de gestión de pedidos",
  manifest: "/pwa/manifest.json"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`antialiased min-h-screen`} >
        <Suspense fallback={<nav className="z-10 w-full px-4 py-2 flex justify-between items-center bg-white/75 backdrop-blur-xs fixed top-0 h-14" />}>
          <Header />
        </Suspense>
        <main className="my-10 py-20 px-10">
          {children}
        </main>

        <Toaster position="top-center" expand={true} richColors />
      </body>
    </html>
  );
}
