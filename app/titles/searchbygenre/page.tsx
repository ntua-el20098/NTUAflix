"use client";  // Remove this line if not needed
import React, { useState, useEffect, ChangeEvent } from "react";
import { Box } from "@mui/material";
import 'bootstrap/scss/bootstrap.scss';
import Card from "@/components/Card";

interface Movie {
  titleObject: {
    titleID: string;
    type: string;
    originalTitle: string;
    rating: {
      avRating: number;
    };
    titlePoster: string;
  };
}

const MovieInfo: React.FC = () => {
  const [movieData, setMovieData] = useState<Movie[]>([]);
  const [genresList, setGenresList] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(24); // Default limit
  const [hasMorePages, setHasMorePages] = useState<boolean>(true); // Track if there are more pages
  const fallbackPosterUrl = "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg";

  useEffect(() => {
    // Fetch genres from the API
    const fetchGenres = async () => {
      try {
        const genresResponse = await fetch("http://localhost:9876/ntuaflix_api/getAllGenres");
        const genresData: string[] = await genresResponse.json();

        // Filter out empty strings from the genres list
        const filteredGenres = genresData.filter(genre => genre !== "");

        setGenresList(filteredGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    fetchData(); // Initial fetch
  }, [currentPage, limit, selectedGenre]); // Include selectedGenre as a dependency

  const fetchData = async () => {
    try {
      let apiUrl = "";
      let requestBody = {};

      // Check if a genre is selected
      if (selectedGenre) {
        apiUrl = `http://localhost:9876/ntuaflix_api/bygenre?limit=${limit}&page=${currentPage}`;
        requestBody = {
          "gqueryObject": {
            "qgenre": selectedGenre,
            "minrating": "0",
          },
        };
      } else {
        apiUrl = `http://localhost:9876/ntuaflix_api/searchtitle?limit=${limit}&page=${currentPage}`;
        requestBody = {
          "tqueryObject": {
            "titlePart": ""
          }
        };
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Movie[] = await response.json();

      // Check if data is an array and has valid entries
      if (Array.isArray(data)) {
        setMovieData(data);
        console.log("Fetched Data:", data); // Log fetched data

        // Check if the number of objects is less than the limit
        setHasMorePages(data.length >= limit);
      } else {
        console.log("Invalid data format:", data);
        setMovieData([]);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGenreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(1);
    const selectedValue = event.target.value;
    setSelectedGenre(selectedValue === "" ? "" : selectedValue);
    window.history.replaceState(null, '', `?genre=${selectedValue}`);
  };

  const handleSearch = () => {
    fetchData(); // Call the fetchData function for both cases
    // Update URL when searching
    window.history.replaceState(null, '', `?page=${currentPage}&limit=${limit}&genre=${selectedGenre}`);
  };

  const handlePagination = (page: number) => {
    setCurrentPage(page);
    // Update URL when changing page
    window.history.replaceState(null, '', `?page=${page}&limit=${limit}&genre=${selectedGenre}`);
    // Scroll to the top of the screen
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div > 
      <div className="input-group mb-3" style={{ width: "40%", margin: "0 auto", marginTop: "40px" }}>
        <label className="input-group-text" htmlFor="inputGroupSelect01">Filter by genre:</label>
        <select className="form-select" id="inputGroupSelect01" value={selectedGenre || ""} onChange={handleGenreChange}>
          <option disabled value="">Select a genre</option>
          {genresList.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      <Box
        sx={{
          display: "grid",
          padding: "3%",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "30px",
        }}
      >
        {movieData.map((item, index) => (
          item.titleObject && item.titleObject.rating && (
            <Card
              key={index}
              id={item.titleObject.titleID}
              type={item.titleObject.type}
              title={item.titleObject.originalTitle}
              rating={item.titleObject.rating.avRating}
              poster={item.titleObject.titlePoster.replace('{width_variable}', 'original') || fallbackPosterUrl}
            />
          )
        ))}
      </Box>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center " data-bs-theme="dark">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePagination(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              {currentPage}
            </a>
          </li>
          <li className={`page-item ${!hasMorePages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePagination(currentPage + 1)}
              disabled={!hasMorePages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MovieInfo;
