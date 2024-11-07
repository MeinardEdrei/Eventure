import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import axios from 'axios';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post('http://localhost:5000/api/auth/login', {
                        email: credentials.email,
                        password: credentials.password
                    });

                    const { user, token } = response.data;

                    if (!user) {
                      throw new Error('Authentication failed: User not found')
                    }

                    if (user) {
                      // Return the user object with token
                      return {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        role: user.role,
                        status: user.status,
                        accessToken: token 
                      };
                    }
          
                    return null; // Return null if no user or token
                } catch (error) {
                console.error('Auth error:', error);
                throw new Error(error.response?.data?.message || 'Authentication failed');
                }
            }
        }),
    ],
    callbacks: {
        async session({ session, token }) {
          session.user.id = token.sub;
          session.user.username = token.username;
          session.user.email = token.email;
          session.user.role = token.role;
          session.user.status = token.status;
          session.accessToken = token.accessToken;
          return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.username = user.username;
                token.email = user.email;
                token.role = user.role;
                token.status = user.status;
            }
            return token;
            }
      },
      pages: {
        signIn: '/login',
        error: '/login',
      },
      session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }
});

export { handler as GET, handler as POST };