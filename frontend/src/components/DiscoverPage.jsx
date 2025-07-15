import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DiscoverPage() {
  const [podcasts, setPodcasts] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState('720p');

  useEffect(() => {
    axios.get(`http://localhost:4000/podcasts/all`)
      .then(res => setPodcasts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          🎙️ Discover Podcasts
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map(p => {
            const fileName = p.podcast_id.split('/').pop(); 
            const resolutions = p.resolutions.split(',');
            const videoUrl = `https://podcast-processed-aws.s3.eu-north-1.amazonaws.com/${selectedQuality}/${fileName}`;

            return (
              <div key={p.podcast_id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">{p.title}</h2>
                <video controls src={videoUrl} className="w-full mb-2" />

                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  {resolutions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <p className="text-gray-600 text-sm">{p.description}</p>
              </div>
            );
          })}
        </div>

        {podcasts.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No podcasts available yet.
          </p>
        )}
      </div>
    </div>
  );
}
