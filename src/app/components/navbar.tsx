"use client"

import {
    LoginIcon,
    LogoutIcon,
    SearchIcon,
    UserCircleIcon,
} from "@heroicons/react/outline"
import { Button, TextInput, Title } from "@tremor/react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

function Navbar() {
    const { data: session } = useSession()
    const router = useRouter()

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
                            <Title className="text-red-500">
                                <Link href="/stocks/AAPL?interval=5D&data=earnings&trade=buy">
                                    TEST STOCK
                                </Link>
                            </Title>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <TextInput icon={SearchIcon} placeholder="Search..." />
                        {session ? (
                            <Button
                                icon={LogoutIcon}
                                onClick={() =>
                                    router.push("/api/auth/signout")
                                }>
                                Logout
                            </Button>
                        ) : (
                            <Button
                                icon={LoginIcon}
                                onClick={() => router.push("/api/auth/signin")}>
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
