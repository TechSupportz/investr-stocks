"use client"

import { SearchIcon, UserCircleIcon } from "@heroicons/react/outline"
import { Button, TextInput, Title } from "@tremor/react"
import Image from "next/image"
import Link from "next/link"

function Navbar() {
    return (
        <nav className="flex px-8 py-4 bg-white shadow-sm mb-5">
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
                                <Link href="/stocks/AAPL">TEST STOCK</Link>
                            </Title>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
						<TextInput icon={SearchIcon} placeholder="Search..."/>
                        <Button icon={UserCircleIcon}>Login</Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
