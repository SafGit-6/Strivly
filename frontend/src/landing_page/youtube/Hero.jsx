import { useState } from "react";
import YouTube from "react-youtube"; // ✅ 1. Import the YouTube component
import { toast } from "react-toastify";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; // replace with your real API key

const productiveKeywords = [
  "tutorial","learn","education","programming","coding","development","productivity","skills",
  "course","training","guide","how to","react","javascript","python","design","business",
  "finance","study","lecture","workshop","masterclass","webinar"
];

function isProductiveSearch(term) {
  return productiveKeywords.some((keyword) =>
    term.toLowerCase().includes(keyword.toLowerCase())
  );
}

function Hero({ addSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchYouTube = async (query) => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
        query
      )}&type=video&key=${API_KEY}`
    );
    if (!response.ok) {
      toast.error("YouTube Error: Failed to search. Check your API key/quota.");
      return { items: [] };
    }
    return response.json();
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsLoading(true);

    const productive = isProductiveSearch(searchTerm);
    if (!productive) {
      toast.warn("Unproductive search. Try educational content!");
      setIsLoading(false);
      return;
    }

    addSearch(searchTerm);

    try {
      const results = await searchYouTube(searchTerm);
      if (results.items && results.items.length > 0) {
        setResults(results.items);
        setSelectedVideo(results.items[0]);
      } else {
        setResults([]);
        setSelectedVideo(null);
        toast.info("No videos found for this search.");
      }
    } catch (error) {
      console.error("YouTube Search Error:", error);
      toast.error("YouTube Error: Please try again.");
    }
    setIsLoading(false);
  };

  // ✅ 2. Define the options for the YouTube player
  const playerOptions = {
    height: '100%',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      rel: 0,
      modestbranding: 1,
    },
  };

  return (
    <div className="darkGreyCard p-4 mb-4">
      <h2 className="mb-4 text-white">Safe YouTube Search</h2>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="d-flex mb-3 gap-2">
        <input
          type="text"
          className="form-control simpleDarkGreyCard ytSearchInput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for educational videos..."
        />
        <button
          type="submit"
          className="btn purpleBtn text-white"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Selected Video */}
      {selectedVideo && (
        <div className="mb-4">
          <div className="ratio ratio-16x9 mb-2">
            {/* ✅ 3. Replace the iframe with the YouTube component */}
            <YouTube
              videoId={selectedVideo.id.videoId}
              opts={playerOptions}
              className="rounded"
            />
          </div>
          <h5 style={{ color: "var(--purple)" }}>{selectedVideo.snippet.title}</h5>
          <p className="mb-1" style={{ color: "var(--grayText)" }}>
            Channel: {selectedVideo.snippet.channelTitle}
          </p>
          <p style={{ color: "var(--grayText)" }}>{selectedVideo.snippet.description}</p>
        </div>
      )}

      {/* Other results */}
      {results.length > 0 && (
        <div>
          <h6 style={{ color: "var(--green)" }} className="mb-2">Other Results:</h6>
          <ul className="list-unstyled">
            {results.map((video) => (
              <li
                key={video.id.videoId}
                className={`d-flex align-items-center p-2 mb-2 simpleLightGreyCard rounded ${
                  selectedVideo?.id.videoId === video.id.videoId ? "border border-2 border-primary" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedVideo(video)}
              >
                <img
                  src={video.snippet.thumbnails.default.url}
                  alt={video.snippet.title}
                  className="me-2 rounded"
                  style={{ width: "80px", height: "60px", objectFit: "cover" }}
                />
                <div>
                  <span style={{ color: "var(--textColor)" }}>{video.snippet.title}</span>
                  <div style={{ color: "var(--grayText)", fontSize: "0.85rem" }}>
                    {video.snippet.channelTitle}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Hero;