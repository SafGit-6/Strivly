import { useState } from "react";

function RecentSearch({ searchHistory }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500); // reset after 1.5s
  };

  return (
    <div className="simpleDarkGreyCard p-4">
      <h5 style={{ color: "var(--purple)" }} className="mb-3">
        Recent Productive Searches
      </h5>
      <ul className="list-unstyled">
        {searchHistory.map((entry, index) => (
          <li
            key={entry.id}
            className={`d-flex justify-content-between align-items-center py-2 ${
              index < searchHistory.length - 1 ? "border-bottom" : ""
            }`}
            style={{ color: "var(--textColor)", fontSize: "0.9rem" }}
          >
            <span>{entry.search_term}</span>
            <button
              className="btn btn-sm"
              onClick={() => handleCopy(entry.search_term, entry.id)}
            >
              <i className="fa-regular fa-copy text-white"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentSearch;


