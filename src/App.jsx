import { memo, useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { PostProvider, usePosts } from "./context/PostContext";
// import Test from "./Test";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function App() {
  //! Error: context is used outside the provider
  //? const x = usePosts();

  const [isDark, setIsDark] = useState(false);

  // Whenever `isDark` changes, we toggle the `fake-dark-mode` class on the HTML element q(see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isDark]
  );

  return (
    <section>
      <button
        onClick={() => setIsDark((prev) => !prev)}
        className="btn-fake-dark-mode"
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      <PostProvider>
        <Header />
        <Main />
        <Archive />
        <Footer />
      </PostProvider>
    </section>
  );
}

function Header() {
  // 3. Finally CONSUMING THE CONTEXT VALUE FROM A Custom Hooks
  const { onClearPosts } = usePosts();

  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = usePosts();
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const { posts } = usePosts();
  return <p>🚀 {posts.length} atomic posts found</p>;
}

const Main = memo(function Main() {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  );
});

function Posts() {
  return (
    <section>
      <List />
    </section>
  );
}

function FormAddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { onAddPost } = usePosts();

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddPost({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List() {
  const { posts } = usePosts();
  return (
    <>
      <ul>
        {posts.map((post, i) => (
          <li key={i}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>

      {/* <Test /> */}
    </>
  );
}

function Archive() {
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts] = useState(() =>
    Array.from({ length: 1000 }, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(false);
  const [visibleCount, setVisibleCount] = useState(60);

  const { onAddPost } = usePosts();

  return (
    <aside>
      <h2>Post archive ({posts.length})</h2>
      <button onClick={() => setShowArchive((prev) => !prev)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.slice(0, visibleCount).map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>
            </li>
          ))}

          {visibleCount < posts.length && (
            <button onClick={() => setVisibleCount((prev) => prev + 100)}>
              Load More
            </button>
          )}
        </ul>
      )}
    </aside>
  );
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
