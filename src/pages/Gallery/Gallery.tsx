import { useGetUsersQuery } from "../../store/apiAccountSlice";
import styles from "./Gallery.module.scss";

interface some {
  name: string;
  email: string;
  avatar: { type: string; default: "" };
  status: { type: string; default: "" };
  posts: {
    image: string;
    description: string;
    date: string;
    _id: string;
  }[];
}

function Gallery() {
  function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return `${formattedDate} at ${formattedTime}`;
  }

  const { data } = useGetUsersQuery(undefined);
  const users: some[] = data?.users;

  const allPosts =
    users
      ?.flatMap((user) =>
        user.posts.map((post) => ({
          ...post,
          userName: user.name,
        }))
      )
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ) || [];

  return (
    <div className={styles["gallery-container"]}>
      <div className={styles["posts"]}>
        {allPosts.map((post) => (
          <div className={styles["post"]} key={post._id}>
            <div className={styles["post-image-container"]}>
              <img src={post.image} alt="" />
            </div>
            <div className={styles["post-info"]}>
              <div className={styles["text-date-container"]}>
                <p className={styles["post-text"]}>{post.description}</p>
                <p className={styles["post-date"]}>{formatDate(post.date)}</p>
              </div>
              <p className={styles["user-name"]}>{post.userName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
