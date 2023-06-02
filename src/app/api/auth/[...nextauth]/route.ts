import { DateTime } from "luxon"
import { nanoid } from "nanoid"
import NextAuth, { AuthOptions, TokenSet } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Provider } from "next-auth/providers"

const FidorProvider: Provider = {
    id: "fidor",
    name: "Fidor",
    type: "oauth",
    version: "2.0",
    authorization: {
        url: "https://apm.tp.sandbox.fidorfzco.com/oauth/authorize",
        params: {
            client_id: process.env.FIDOR_CLIENT_ID,
            redirect_uri: `${process.env.BASE_URL}/api/auth/callback/fidor`,
            state: `${nanoid(10)}`,
            response_type: "code",
        },
    },
    token: {
        async request(context) {
            const params = {
                grant_type: "authorization_code",
                code: context.params.code ?? "",
                redirect_uri: `${process.env.BASE_URL}/api/auth/callback/fidor`,
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
                            authorization: `Basic ${Buffer.from(
                                `${process.env.FIDOR_CLIENT_ID}:${process.env.FIDOR_CLIENT_SECRET}`,
                            ).toString("base64")}`,
                        },
                        cache: "no-store",
                    },
                )

                if (!res.ok) {
                    throw new Error("Failed to fetch tokens from Fidor")
                }

                const data = await res.json()

                return {
                    tokens: {
                        access_token: data.access_token,
                        refresh_token: data.refresh_token,
                        expires_at: data.expires_in,
                        state: data.state,
                    },
                }
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
                        cache: "no-store",
                    },
                )

                const data = await res.json()
                // console.log(">>> user", JSON.stringify(data, null, 2))
                return data
            } catch (error) {
                console.error(error)
                throw new Error("Failed to fetch user data from Fidor")
            }
        },
    },
    clientId: process.env.FIDOR_CLIENT_ID,
    clientSecret: process.env.FIDOR_CLIENT_SECRET,
    profile(profile, tokens: TokenSet) {
        return {
            ...profile,
            ...tokens,
        }
    },
}

async function refreshAccessToken(token: JWT) {
    const params = {
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
    }

    console.log(">>> token", token)

    const res = await fetch(
        `https://apm.tp.sandbox.fidorfzco.com/oauth/token?${new URLSearchParams(
            params,
        ).toString()}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                authorization: `Basic ${Buffer.from(
                    `${process.env.FIDOR_CLIENT_ID}:${process.env.FIDOR_CLIENT_SECRET}`,
                ).toString("base64")}`,
            },
            cache: "no-store",
        },
    )
    const data = await res.json()

    if (!res.ok) {
        throw data
    }

    console.log(">>> refreshAccessToken", JSON.stringify(data, null, 2))

    return {
        ...token,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: DateTime.now().plus({ seconds: data.expires_in }).toMillis(),
        state: token.state,
    }
}

export const authOptions: AuthOptions = {
    secret: "secret",
    providers: [FidorProvider],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            // initial sign in
            if (account && user) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = DateTime.now()
                    .plus({ seconds: account.expires_at })
                    .toMillis()
                token.userId = user.id
                token.userEmail = user.email
            }

            if (DateTime.now().toMillis() < token.expiresAt) {
                return token
            }

            return refreshAccessToken(token)
        },
        async session({ session, token }) {
            console.log(">>> sessionToken", token)
            if (token) {
                session.accessToken = token.accessToken
                session.refreshToken = token.refreshToken
                session.expiresAt = token.expiresAt
                session.user = {
                    id: token.userId,
                    email: token.userEmail,
                }
            }

            return session
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
