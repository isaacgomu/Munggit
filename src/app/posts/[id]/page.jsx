import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { HoverCard } from "@radix-ui/themes";

export const metadata = {
  title: "Munggit Posts",
  description: "Mung Community Blog Posts",
};

export default async function Posts({ params }) {
  const postId = params.id; // Sanitize or validate this value as needed

  const posts = await db.query(
    `SELECT
      posts.id,
      posts.title,
      posts.content,
      profile.username,
      profile.avatar,
      profile.clerk_id,
      profile.bio
    FROM posts
    INNER JOIN profile ON posts.profile_id = profile.id
    WHERE posts.id = $1`,
    [postId]
  );

  async function handleAddComment(formData) {
    "use server";
    const user = await currentUser();
    if (user) {
      const content = formData.get("content");
      const result = await db.query(
        `SELECT id FROM profile WHERE clerk_id = $1`,
        [user.id]
      );
      const profileId = result.rows[0].id;

      await db.query(
        `INSERT INTO comments (post_id, content, profile_id)
        VALUES ($1, $2, $3)`,
        [postId, content, profileId]
      );

      revalidatePath("/");
      redirect(`/posts/${postId}`);
      Posts();
    }
  }

  const comments = await db.query(
    `SELECT comments.content, profile.username, profile.avatar, profile.clerk_id, profile.bio 
    FROM comments
    JOIN profile ON comments.profile_id = profile.id
    WHERE comments.post_id = $1`,
    [postId]
  );

  if (posts.rows.length === 0) {
    notFound();
  }

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.rows.map((post, index) => (
          <li
            key={index}
            style={{
              borderTop: "1px solid #41ac3d",
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
                  fontSize: "20px",
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
                        style={{ borderRadius: "15px" }}
                      />
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
                        padding: "10px",
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
                          style={{ borderRadius: "15px" }}
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
                      <p>{post.bio}</p>
                    </div>
                  </HoverCard.Content>
                </HoverCard.Root>
              </div>
              <div style={{ fontSize: "30px", marginLeft: "30px" }}>
                {post.title}
              </div>
            </div>
            <p style={{ marginLeft: "30px" }}>{post.content}</p>
          </li>
        ))}
      </ul>
      <SignedIn>
        <form
          action={handleAddComment}
          style={{ marginBottom: "20px", borderBottom: "1px solid #41ac3d" }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "150px",
              }}
            >
              <label htmlFor="content">Content</label>
              <input name="content" id="content" placeholder="Content" />
            </div>
          </div>
          <button
            type="submit"
            style={{
              border: "1px solid #41ac3d",
              borderRadius: "5px",
              fontSize: "20px",
            }}
          >
            Add Comment
          </button>
        </form>
      </SignedIn>
      <SignedOut>
        <div
          style={{ marginBottom: "20px", borderBottom: "1px solid #41ac3d" }}
        >
          <p>You need to sign in to add a comment</p>
          <SignInButton />
        </div>
      </SignedOut>
      <ul>
        {comments.rows.map((comment, index) => (
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
                      href={`/profile/${comment.clerk_id}`}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Image
                        src={comment.avatar}
                        alt="profile picture"
                        width={30}
                        height={30}
                        style={{ borderRadius: "15px" }}
                      />
                      <p
                        style={{ marginLeft: "10px", fontWeight: "bold" }}
                        className="hover:underline"
                      >
                        {comment.username}:
                      </p>
                    </Link>
                  </HoverCard.Trigger>
                  <HoverCard.Content size="1" width={200}>
                    <div
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #41ac3d",
                        borderRadius: "15px",
                        padding: "10px",
                      }}
                    >
                      <Link
                        href={`/profile/${comment.clerk_id}`}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Image
                          src={comment.avatar}
                          alt="profile picture"
                          width={30}
                          height={30}
                          style={{ borderRadius: "15px" }}
                        />
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p
                            style={{ marginLeft: "10px", fontWeight: "bold" }}
                            className="hover:underline"
                          >
                            {comment.username}
                          </p>
                        </div>
                      </Link>
                      <p>{comment.bio}</p>
                    </div>
                  </HoverCard.Content>
                </HoverCard.Root>
              </div>
            </div>
            <p style={{ marginLeft: "30px" }}>{comment.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
