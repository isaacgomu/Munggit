import Link from "next/link";
import Image from "next/image";
export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Whoops! We&apos;ve munged it all up!</h1>
      <p>Looks like we can&apos;t find the page you&apos;re looking for :(</p>
      <Image
        src="/mung1.png"
        alt="Mung (Spike from Mario) holding a large iron spike bar"
        width={728.7}
        height={641.7}
      />
      <Link href="/">
        <p>Home</p>
      </Link>
    </div>
  );
}
