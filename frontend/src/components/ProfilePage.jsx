import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios.get(`http://localhost:4000/podcasts/user/${userId}`)
      .then(res => setPodcasts(res.data));
  }, []);

  return (
    <div>
      <h1>Your Podcasts</h1>
      {podcasts.map(p => (
        <div key={p.podcast_id}>
          <h2>{p.title}</h2>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}
