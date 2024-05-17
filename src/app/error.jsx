"use client";
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Whoops! We&apos;ve munged it all up!</h1>
      <p>Looks like there&apos;s been an error!</p>
      <Image
        src="/mung4.png"
        alt="Mung (Spike from Mario) holding a tennis racket"
        width={250}
        height={348}
      />
      <Link href="/">Home</Link>
    </div>
  );
}
