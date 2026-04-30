import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialPosts = [
  {
    id: "seed-1",
    author: "Hope Warrior",
    type: "Encouragement",
    date: "28/4/2026",
    content: "Just completed my last chemo session today! It's been a long 6 months but I'm so grateful for the support.",
    comments: ["Congratulations! You're an inspiration!", "So happy for you! Celebrate this milestone!"],
  },
  {
    id: "seed-2",
    author: "Concerned Daughter",
    type: "Question",
    date: "29/4/2026",
    content: "My mother was recently diagnosed with Stage 2 breast cancer. We're overwhelmed and don't know where to start.",
    comments: ["Start with a second opinion from a major cancer center."],
  },
];

export default function CommunityPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(initialPosts);
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("Experience");
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);

  const submitPost = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const nextPost = {
      id: String(Date.now()),
      author: author.trim() || "Anonymous",
      type,
      date: new Date().toLocaleDateString("en-GB"),
      content: content.trim(),
      media: mediaFiles.map((item) => ({ type: item.type, preview: item.preview })),
      comments: [],
    };
    setPosts((prev) => [nextPost, ...prev]);
    setContent("");
    setAuthor("");
    setType("Experience");
    setMediaFiles([]);
  };

  const handleMedia = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.slice(0, 4).map((file) => ({
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file),
    }));
    setMediaFiles(mapped);
  };

  return (
    <div className="page">
      <div className="container list-stack">
        <h1 className="page-title">Community Support</h1>
        <p className="page-subtitle">A safe, anonymous space to share and connect.</p>

        <form className="panel list-stack" onSubmit={submitPost}>
          <h3 style={{ marginTop: 0 }}>Share your experience</h3>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Name (optional, defaults to Anonymous)"
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Experience">Experience</option>
            <option value="Question">Question</option>
            <option value="Encouragement">Encouragement</option>
          </select>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here..."
            rows={4}
          />
          <input type="file" accept="image/*,video/*" multiple onChange={handleMedia} />
          {mediaFiles.length > 0 && (
            <div className="media-grid">
              {mediaFiles.map((item) => (
                item.type.startsWith("video") ? (
                  <video key={item.preview} src={item.preview} controls className="media-thumb" />
                ) : (
                  <img key={item.preview} src={item.preview} alt={item.name} className="media-thumb" />
                )
              ))}
            </div>
          )}
          <button className="btn" type="submit">Post</button>
        </form>

        {posts.map((p) => (
          <div key={p.id} className="panel list-stack">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <strong>{p.author}</strong>
              <span className="muted">{p.type} · {p.date}</span>
            </div>
            <p style={{ margin: 0 }}>{p.content}</p>
            {p.media?.length > 0 && (
              <div className="media-grid">
                {p.media.map((item) => (
                  item.type?.startsWith("video") ? (
                    <video key={item.preview} src={item.preview} controls className="media-thumb" />
                  ) : (
                    <img key={item.preview} src={item.preview} alt="post media" className="media-thumb" />
                  )
                ))}
              </div>
            )}
            {p.comments.length > 0 && (
              <div className="list-stack">
                {p.comments.map((comment, idx) => (
                  <div key={comment} className="panel">
                    <strong>Reply {idx + 1}</strong>
                    <p className="muted">{comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="floating-help" type="button" onClick={() => navigate("/chat")}>◎</button>
    </div>
  );
}
