import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './youtube.css';
import Hero from "./Hero";
import RecentSearch from "./RecentSearch";

function YoutubePage() {
  const [searchHistory, setSearchHistory] = useState([]);

    const addSearch = (term) => {
        setSearchHistory((prev) => {
            const lowerTerm = term.toLowerCase();

            // remove duplicates (case-insensitive)
            const filtered = prev.filter(
            (item) => item.search_term.toLowerCase() !== lowerTerm
            );

            // add new search on top and limit to 10
            return [{ id: Date.now(), search_term: term }, ...filtered].slice(0, 10);
        });
    };


  return (
    <div className="container py-4">
      <Hero addSearch={addSearch} />
      <RecentSearch searchHistory={searchHistory} />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default YoutubePage;

