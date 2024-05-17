import { db } from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Profile({ params }) {
  const userId = params.id;

  const posts = await db.query(
    `SELECT
      posts.id,
      posts.title,
      posts.content,
      profile.username,
      profile.avatar,
      profile.clerk_id
    FROM posts
    INNER JOIN profile ON posts.profile_id = profile.id
    WHERE profile.clerk_id = $1`,
    [userId]
  );

  const profile = await db.query(`SELECT * FROM profile WHERE clerk_id = $1`, [
    userId,
  ]);

  const user = await currentUser();

  async function handleChangeUsername(formData) {
    "use server";
    const username = formData.get("username");

    if (/\s/.test(username)) {
      return;
    }

    await db.query(
      `UPDATE profile
      SET username = $1
      WHERE clerk_id = $2`,
      [username, userId]
    );

    await clerkClient.users.updateUser(userId, { username: username });

    revalidatePath("/");
    redirect(`/profile/${userId}`);
  }

  async function handleChangeBio(formData) {
    "use server";
    const bio = formData.get("bio");

    await db.query(
      `UPDATE profile
      SET bio = $1
      WHERE clerk_id = $2`,
      [bio, userId]
    );

    revalidatePath("/");
    redirect(`/profile/${userId}`);
  }

  if (user && user.id === params.id) {
    return (
      <div>
        {profile.rows.map((profile) => (
          <div key={profile.id}>
            <div
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #41ac3d",
              }}
            >
              <form action={handleChangeUsername}>
                <label htmlFor="username">Username:</label>
                <input
                  name="username"
                  id="username"
                  placeholder={profile.username}
                />
                <button
                  type="submit"
                  style={{
                    border: "1px solid #41ac3d",
                    borderRadius: "5px",
                    fontSize: "20px",
                  }}
                >
                  Change Username
                </button>
              </form>
              <form action={handleChangeBio} key={profile.id}>
                <label htmlFor="bio">Bio:</label>
                <input
                  name="bio"
                  id="bio"
                  placeholder={profile.bio || "Add your bio here!"}
                  style={{ width: "500px" }}
                />
                <button
                  type="submit"
                  style={{
                    border: "1px solid #41ac3d",
                    borderRadius: "5px",
                    fontSize: "20px",
                  }}
                >
                  Update Bio
                </button>
              </form>
            </div>
            <div key={profile}>
              <Image
                src={profile.avatar}
                alt="profile picture"
                width={100}
                height={100}
                style={{ borderRadius: "50px" }}
              />
              <h1>{profile.username}</h1>
              <p
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #41ac3d",
                }}
              >
                {profile.bio || "This user has not added a bio yet."}
              </p>
            </div>
            <h1>{profile.username}&apos;s posts:</h1>
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
        ))}
      </div>
    );
  } else {
    return (
      <div>
        {profile.rows.map((profile) => (
          <div key={profile.id}>
            <div key={profile}>
              <Image
                src={profile.avatar}
                alt="profile picture"
                width={100}
                height={100}
                style={{ borderRadius: "50px" }}
              />
              <h1>{profile.username}</h1>
              <p
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #41ac3d",
                }}
              >
                {profile.bio || "This user has not added a bio yet."}
              </p>
            </div>
            <h1>{profile.username}&apos;s posts:</h1>
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
        ))}
      </div>
    );
  }
}
