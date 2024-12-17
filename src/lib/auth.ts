import NextAuth from 'next-auth';
import {prisma} from '@/lib/prisma';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { JWTPayload, SignJWT, importJWK } from 'jose';

export const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET || 'secret';

  const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(jwk);

  return jwt;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'email', type: 'text', placeholder: '' },
        password: { label: 'password', type: 'password', placeholder: '' },
      },
      authorize: async (credentials: any) => {
        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { username: credentials.username },
                { email: credentials.username },
              ],
            },
            select: {
              password: true,
              id: true,
              username: true,
              email: true,
            },
          });
          if(!user){
            throw new Error("User Didn't Exist.")
          }

          if (
            user &&
            user.password &&
            (await bcrypt.compare(credentials.password, user.password))
          ) {

            const jwt = await generateJWT({
              id: user.id,
            });

            return {
              id: user.id,
              username: user.username,
              email: credentials.username,
              token: jwt,
            };
          }
          throw new Error("Invalid credentials.")
        } catch (e: any) {
          console.error(e);
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token.user_id) {
        session.user.id = token.user_id;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if(user?.id){
        token.user_id = user.id
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login', // This will redirect back to login page with error
  },
});