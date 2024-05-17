import Image from "next/image";

export default function Loading() {
  return (
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
  );
}
