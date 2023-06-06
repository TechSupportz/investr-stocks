"use client"

import {
    LoginIcon,
    LogoutIcon,
    SearchIcon,
    UserCircleIcon,
} from "@heroicons/react/outline"
import { Button, TextInput, Title } from "@tremor/react"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

function Navbar() {
    const { data: session } = useSession()
    const router = useRouter()

    const [search, setSearch] = useState("")

    const appSignOut = async () => {
        if (!session) {
            return
        }

        fetch(`${window.location.origin}/api/accounts/logout`, {
            method: "POST",
            body: JSON.stringify({
                token: session.accessToken,
            }),
        })

        await signOut()
    }

    const navigateToStock = () => {
        router.push(`/stocks/${search}`)
    }

    return (
        <nav className="mb-5 flex bg-white px-8 py-4 shadow-sm">
            <div className="container mx-auto">
                <div className="flex justify-between">
                    <div className="flex space-x-10">
                        <Image
                            src="/investr-stocks-logo.svg"
                            alt="logo"
                            width={120}
                            height={80}
                        />
                        <div className="flex items-center space-x-4">
                            <Title>
                                <Link href="/dashboard">Dashboard</Link>
                            </Title>
                            <Title>
                                <Link href="/news">News</Link>
                            </Title>
                            {/*NOTE - Remove this afterwards */}
                            {/* <Title className="text-red-500">
                                <Link href="/stocks/AAPL?interval=5D&data=earnings&trade=buy">
                                    TEST STOCK
                                </Link>
                            </Title> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex gap-1">
                            <Button
                                className="pr-2"
                                disabled={search === ""}
                                icon={SearchIcon}
                                onClick={() => navigateToStock()}
                            />
                            <TextInput
                                placeholder="Search..."
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        {session ? (
                            <Button
                                icon={LogoutIcon}
                                onClick={() => appSignOut()}>
                                Logout
                            </Button>
                        ) : (
                            <Button
                                icon={LoginIcon}
                                onClick={() => signIn("fidor")}>
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
