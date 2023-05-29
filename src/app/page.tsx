import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { Text } from "@tremor/react"

export default async function Home() {
    const session = await getServerSession(authOptions)

	console.log(">>>", session)

    return <Text>{JSON.stringify(session, null, 2)}</Text>
}
