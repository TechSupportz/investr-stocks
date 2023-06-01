"use client"

import { SessionProvider } from "next-auth/react"

type Props = {
    children?: React.ReactNode
}

function NextAuthProvider({ children }: Props) {
    return <SessionProvider>{children}</SessionProvider>
}

export default NextAuthProvider
