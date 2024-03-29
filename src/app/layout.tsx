import { getServerSession } from "next-auth"
import NextAuthProvider from "./NextAuthProvider"
import Navbar from "./components/navbar"
import "./globals.css"
import { Inter } from "next/font/google"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { Metric } from "@tremor/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Investr • Stocks",
    description: "",
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <html lang="en" className={inter.className}>
            <body>
                <NextAuthProvider>
                    <Navbar />
                    <div className="container m-auto h-[85vh]">
                        {session ? (
                            children
                        ) : (
                            <>
                                <div className="flex h-full flex-col items-center justify-center">
                                    <Metric>Welcome to Investr Stocks</Metric>
                                    <Metric>Login to get started!</Metric>
                                </div>
                            </>
                        )}
                    </div>
                </NextAuthProvider>
            </body>
        </html>
    )
}
