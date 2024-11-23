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
                    const response = await axios.post('http://localhost:5000/api/user/login', {
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
                        student_number: user.student_number,
                        section: user.section,
                        department: user.department,
                        attended_events: user.attended_events,
                        created_events: user.created_events,
                        status: user.status,
                        accessToken: token 
                      };
                    }
          
                    return null; // Return null if no user or token
                } catch (error) {
                  if (error.response) {
                    if (error.response.status === 400) {
                        throw new Error(error.response.data.message || 'Email and Password are required.');
                    } else if (error.response.status === 404) {
                        throw new Error(error.response.data.message || 'Invalid email.');
                    } else if (error.response.status === 401) {
                        throw new Error(error.response.data.message || 'Invalid password.');
                    }
                }
                throw new Error('Authentication failed');
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
              token.id = user.id;
              token.accessToken = user.accessToken;
              token.username = user.username;
              token.email = user.email;
              token.role = user.role;
              token.student_number = user.student_number;
              token.section = user.section;
              token.department = user.department;
              token.attended_events = user.attended_events;
              token.created_events = user.created_events;
              token.status = user.status;
          }
          return token;
        },
        async session({ session, token }) {
          session.user = session.user || {};
          session.user.id = token.id;
          session.user.username = token.username;
          session.user.email = token.email;
          session.user.role = token.role;
          session.user.student_number = token.student_number;
          session.user.section = token.section;
          session.user.department = token.department;
          session.user.attended_events = token.attended_events;
          session.user.created_events = token.created_events;
          session.user.status = token.status;
          session.accessToken = token.accessToken;
          return session;
        },
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