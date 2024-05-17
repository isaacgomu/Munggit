import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Mung() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>Nothing is loading, he is just spinning his ball</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "764px",
        }}
      >
        <Image
          className="animate-my-animation"
          src="/mungloadingballcorrect.png"
          alt="ball"
          width={221}
          height={227}
        ></Image>
        <Image
          src="/mungloadingmung.png"
          alt="mung"
          width={296}
          height={284}
        ></Image>
      </div>
    </div>
  );
}
