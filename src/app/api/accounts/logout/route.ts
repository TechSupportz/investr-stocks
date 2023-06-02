import { signOut } from "next-auth/react"

export async function POST(req: Request) {
    const { token } = await req.json()

    if (!token) {
        return {
            status: 400,
            body: {
                error: "token is required",
            },
        }
    }

    const params = new URLSearchParams({ token })

    const res = await fetch(
        `https://apm.tp.sandbox.fidorfzco.com/oauth/revoke?${params}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                authorization: `Basic ${Buffer.from(
                    `${process.env.FIDOR_CLIENT_ID}:${process.env.FIDOR_CLIENT_SECRET}`,
                ).toString("base64")}`,
            },
        },
    )

    if (!res.ok) {
        console.log("Error revoking token")
    }

    if (res.status === 200) {
        console.log(">>> signOut")
    }
}
