import Image from "next/image";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { userAgent } from "next/server";

export default async function Home() {
  const user = await currentUser();

  if (user) {
    return (
      <div>
        <SignedOut>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1>Welcome to</h1>
              <h1 style={{ marginLeft: "10px", color: "#41ac3d" }}>Munggit!</h1>
            </div>
            <h2>
              Here you can expect lots of joyous things! Post about whatever you
              like and join the Mung Community!
            </h2>
            <h2>Please sign in to enjoy Mung Community!</h2>
            <Image
              src="/mung2.png"
              alt="Mung (Spike from Mario) throwing a spiky ball"
              width={400}
              height={500}
              style={{ position: "fixed", right: 0, bottom: 0 }}
            />
          </div>
        </SignedOut>
        <SignedIn>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1>Welcome to</h1>
              <h1 style={{ marginLeft: "10px", color: "#41ac3d" }}>Munggit,</h1>
              <h1 style={{ marginLeft: "10px" }}>{user.username}!</h1>
            </div>
            <h2>
              Here you can expect lots of joyous things! Post about whatever you
              like and join the Mung Community!
            </h2>
            <Image
              src="/mung2.png"
              alt="Mung (Spike from Mario) throwing a spiky ball"
              width={400}
              height={500}
              style={{ position: "fixed", right: 0, bottom: 0 }}
            />
          </div>
        </SignedIn>
      </div>
    );
  } else {
    return (
      <div>
        <SignedOut>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1>Welcome to</h1>
              <h1 style={{ marginLeft: "10px", color: "#41ac3d" }}>Munggit!</h1>
            </div>
            <h2>
              Here you can expect lots of joyous things! Post about whatever you
              like and join the Mung Community!
            </h2>
            <h2>Please sign in to enjoy Mung Community!</h2>
            <Image
              src="/mung2.png"
              alt="Mung (Spike from Mario) throwing a spiky ball"
              width={400}
              height={500}
              style={{ position: "fixed", right: 0, bottom: 0 }}
            />
          </div>
        </SignedOut>
        <SignedIn>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1>Welcome to</h1>
              <h1 style={{ marginLeft: "10px", color: "#41ac3d" }}>Munggit,</h1>
              <h1 style={{ marginLeft: "10px" }}>!</h1>
            </div>
            <h2>
              Here you can expect lots of joyous things! Post about whatever you
              like and join the Mung Community!
            </h2>
            <Image
              src="/mung2.png"
              alt="Mung (Spike from Mario) throwing a spiky ball"
              width={400}
              height={500}
              style={{ position: "fixed", right: 0, bottom: 0 }}
            />
          </div>
        </SignedIn>
      </div>
    );
  }
}
