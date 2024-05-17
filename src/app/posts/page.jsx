import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { HoverCard } from "@radix-ui/themes";

export const metadata = {
  title: "Munggit Posts",
  description: "Mung Community Blog Posts",
};

export default async function Posts() {
  const posts = await db.query(`
    SELECT
      posts.id,
      posts.title,
      posts.content,
      profile.username,
      profile.avatar,
      profile.clerk_id,
      profile.bio
    FROM posts
    INNER JOIN profile ON posts.profile_id = profile.id;
  `);

  async function handleAddPost(formData) {
    "use server";
    const user = await currentUser();
    if (user) {
      const content = formData.get("content");
      const title = formData.get("title");

      const result = await db.query(
        `SELECT id FROM profile WHERE clerk_id = $1`,
        [user.id]
      );

      if (result.rows.length > 0) {
        const profileId = result.rows[0].id;
        await db.query(
          `INSERT INTO posts (profile_id, title, content) VALUES ($1, $2, $3)`,
          [profileId, title, content]
        );
      }
    }
    revalidatePath("/");
    redirect("/posts");
  }

  return (
    <div>
      <h1 style={{ borderBottom: "1px solid #41ac3d" }}>Posts</h1>
      <SignedIn>
        <h3>Create new post</h3>
        <form
          action={handleAddPost}
          style={{ borderBottom: "1px solid #41ac3d" }}
        >
          <input name="title" id="title" placeholder="New post"></input>
          <input
            name="content"
            id="content"
            placeholder="Write what you want here!"
          ></input>
          <button>Submit</button>
        </form>
      </SignedIn>

      <SignedOut>
        <p>You need to sign in to add a post</p>
        <SignInButton />
      </SignedOut>
      <ul>
        {posts.rows.map((post, index) => (
          <li
            key={index}
            style={{
              borderBottom: "1px solid #41ac3d",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <HoverCard.Root>
                  <HoverCard.Trigger>
                    <Link
                      href={`/profile/${post.clerk_id}`}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Image
                        src={post.avatar}
                        alt="profile picture"
                        width={30}
                        height={30}
                        style={{ borderRadius: "15px", marginLeft: "-10px" }}
                      ></Image>
                      <p
                        style={{ marginLeft: "10px", fontWeight: "bold" }}
                        className="hover:underline"
                      >
                        {post.username}:
                      </p>
                    </Link>
                  </HoverCard.Trigger>
                  <HoverCard.Content size="1" width={200}>
                    <div
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #41ac3d",
                        borderRadius: "15px",
                      }}
                    >
                      <Link
                        href={`/profile/${post.clerk_id}`}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Image
                          src={post.avatar}
                          alt="profile picture"
                          width={30}
                          height={30}
                          style={{ borderRadius: "15px", marginLeft: "-10px" }}
                        />
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p
                            style={{ marginLeft: "10px", fontWeight: "bold" }}
                            className="hover:underline"
                          >
                            {post.username}
                          </p>
                        </div>
                      </Link>
                      <p width={50}>{post.bio}</p>
                    </div>
                  </HoverCard.Content>
                </HoverCard.Root>
              </div>
              <div>
                <Link href={`/posts/${post.id}`}>
                  <div>
                    <div style={{ fontSize: "30px", marginLeft: "30px" }}>
                      {post.title}
                    </div>
                  </div>
                  <p style={{ marginLeft: "30px", fontSize: "12px" }}>
                    {post.content}
                  </p>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
