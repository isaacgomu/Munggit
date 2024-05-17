import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import headerStyles from "./header.module.css";
import Image from "next/image";
import {
  ClerkProvider,
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Munggit",
  description: "Mung Community Blog!",
};

export default async function RootLayout({ children }) {
  const user = await currentUser();
  let profile;

  if (user && user.id) {
    profile = await db.query(
      `SELECT * FROM profile WHERE clerk_id = '${user.id}'`
    );

    if (profile.rowCount === 0 && user.id) {
      await db.query(
        `INSERT INTO profile (clerk_id, username, avatar) VALUES ('${user.id}', '${user.username}', '${user.imageUrl}')`
      );
      console.log("inserted");
    }
  }
  if (user) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body className={inter.className} style={{ overflowX: "hidden" }}>
            <header
              className={headerStyles.header}
              style={{
                position: "fixed",
                top: 0,
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#ffffff",
                width: "100vw",
                borderBottom: "1px solid #41ac3d",
              }}
            >
              <Link href="/">
                <Image
                  src="/munggit.png"
                  alt="Munggit Logo"
                  width={100}
                  height={100}
                />
              </Link>
              <h1 style={{ color: "#41ac3d" }}>Munggit</h1>
            </header>
            <nav
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                width: "200px",
                backgroundColor: "#41ac3d",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                color: "#ffffff",
              }}
            >
              <div>
                <SignedOut>
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>
              </div>
              <Link href="/">Home</Link>
              <Link href="/posts">Posts</Link>
              <div>
                <SignedIn>
                  <div>
                    <SignOutButton />
                  </div>
                  <div>
                    <Link href={`/profile/${user.id}`}>
                      <Image
                        src={user.imageUrl}
                        alt="Profile"
                        width={30}
                        height={30}
                        style={{ borderRadius: "15px" }}
                      />
                    </Link>
                  </div>
                </SignedIn>
              </div>
              <Link href="/mung">
                <Image
                  src="/mung.png"
                  alt="Mung (Spike from Mario)"
                  width={200}
                  height={200}
                  style={{ position: "fixed", bottom: 0, left: 0 }}
                />
              </Link>
            </nav>
            <div
              style={{
                marginLeft: "220px",
                marginTop: "140px",
                padding: "20px",
              }}
            >
              {children}
            </div>
          </body>
        </html>
      </ClerkProvider>
    );
  } else {
    return (
      <ClerkProvider>
        <html lang="en">
          <body className={inter.className} style={{ overflowX: "hidden" }}>
            <header
              className={headerStyles.header}
              style={{
                position: "fixed",
                top: 0,
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#ffffff",
                width: "100vw",
                borderBottom: "1px solid #41ac3d",
              }}
            >
              <Link href="/">
                <Image
                  src="/munggit.png"
                  alt="Munggit Logo"
                  width={100}
                  height={100}
                />
              </Link>
              <h1 style={{ color: "#41ac3d" }}>Munggit</h1>
            </header>
            <nav
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                width: "200px",
                backgroundColor: "#41ac3d",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                color: "#ffffff",
              }}
            >
              <div>
                <SignedOut>
                  <div>
                    <SignInButton />
                  </div>
                  <div>
                    <SignUpButton />
                  </div>
                </SignedOut>
              </div>
              <Link href="/">Home</Link>
              <Link href="/posts">Posts</Link>
              <div>
                <SignedIn>
                  <div>
                    <SignOutButton />
                  </div>
                  <div>
                    <Link href="/profile"></Link>
                  </div>
                </SignedIn>
              </div>
              <Link href="/mung">
                <Image
                  src="/mung.png"
                  alt="Mung (Spike from Mario)"
                  width={200}
                  height={200}
                  style={{ position: "fixed", bottom: 0, left: 0 }}
                />
              </Link>
            </nav>
            <div
              style={{
                marginLeft: "220px",
                marginTop: "140px",
                padding: "20px",
              }}
            >
              {children}
            </div>
          </body>
        </html>
      </ClerkProvider>
    );
  }
}
