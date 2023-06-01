import NextAuthProvider from "./NextAuthProvider"
import Navbar from "./components/navbar"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Investr • Stocks",
    description: "",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={inter.className}>
            <body>
                <NextAuthProvider>
                    <Navbar />
                    <div className="m-auto h-[85vh] max-w-[1536px]">
                        {children}
                    </div>
                </NextAuthProvider>
            </body>
        </html>
    )
}
