import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken: string
		refreshToken: string
		expiresAt: number
        user: {
            id: string
			email: string

        }
    }

    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface User {
		id: string
		email: string
		affiliate_uid?: string

	}
    /**
     * Usually contains information about the provider being used
     * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
     */
    interface Account {
		access_token: string
		refresh_token: string
		expires_at: number
		state: string
		token_type: string
	}
    /** The OAuth profile returned from your provider */
    interface Profile {}
}

declare module "next-auth/jwt" {
	/**
	 * Returned by the `jwt` callback and `getToken`, when using JWT sessions
	 */
	interface JWT {
		accessToken: string
		refreshToken: string
		expiresAt: number
		userId: string
		userEmail: string
	}
}