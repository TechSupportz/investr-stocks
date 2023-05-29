import { nanoid } from "nanoid"
import NextAuth, { AuthOptions } from "next-auth"
import { Provider } from "next-auth/providers"
import { headers } from "next/dist/client/components/headers"

const FidorProvider: Provider = {
    id: "fidor",
    name: "Fidor",
    type: "oauth",
    version: "2.0",
    authorization: {
        url: "https://apm.tp.sandbox.fidorfzco.com/oauth/authorize",
        params: {
            client_id: process.env.FIDOR_CLIENT_ID,
            redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/fidor`,
            state: `${nanoid(10)}`,
            response_type: "code",
        },
    },
    token: {
        async request(context) {
            const params = {
                grant_type: "authorization_code",
                code: context.params.code ?? "",
                redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/fidor`,
                client_id: process.env.FIDOR_CLIENT_ID!,
            }

            try {
                const res = await fetch(
                    `https://apm.tp.sandbox.fidorfzco.com/oauth/token?${new URLSearchParams(
                        params,
                    ).toString()}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Basic ${Buffer.from(
                                `${process.env.FIDOR_CLIENT_ID}:${process.env.FIDOR_CLIENT_SECRET}`,
                            ).toString("base64")}`,
                        },
                    },
                )

                if (!res.ok) {
                    throw new Error("Failed to fetch tokens from Fidor")
                }

                const data = await res.json()
                console.log(">>> tokens", data)

                return { tokens: data }
            } catch (error) {
                console.error(error)
                throw new Error("Failed to fetch tokens from Fidor")
            }
        },
    },
    userinfo: {
        async request(context) {
            const tokens = context.tokens

            try {
                const res = await fetch(
                    "https://api.tp.sandbox.fidorfzco.com/users/current",
                    {
                        method: "GET",
                        headers: {
                            authorization: `Bearer ${tokens.access_token}`,
                            accept: "application/vnd.fidor.de; version=1,text/json",
                            "content-type": "application/json",
                        },
                    },
                )

                const data = await res.json()
                console.log(">>> user", JSON.stringify(data, null, 2))
                return data
            } catch (error) {
                console.error(error)
                throw new Error("Failed to fetch user data from Fidor")
            }
        },
    },
    clientId: process.env.FIDOR_CLIENT_ID,
    clientSecret: process.env.FIDOR_CLIENT_SECRET,
    profile(profile) {
        return {
            ...profile,
        }
    },
}

export const authOptions: AuthOptions = {
    providers: [FidorProvider],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
