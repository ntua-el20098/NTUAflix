"use client";  
import React, { useState, useEffect, ChangeEvent } from "react";
import { Box, InputBase, Alert } from "@mui/material";
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
  const [minRating, setMinRating] = useState<string>("0");
  const [inputError, setInputError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(24); // Default limit
  const [hasMorePages, setHasMorePages] = useState<boolean>(true); // Track if there are more pages

  const fallbackPosterUrl =
    "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg";

    const fetchData = async () => {
      try {
        const minRatingValue = minRating.toString();
        const response = await fetch(
          `http://localhost:9876/ntuaflix_api/searchbyrating?limit=${limit}&page=${currentPage}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              gqueryObject: {
                minrating: minRatingValue,
              },
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const contentType = response.headers.get("content-type");
        const contentLength = response.headers.get("content-length");
  
        console.log("Content-Type:", contentType);
        console.log("Content-Length:", contentLength);
  
        if (
          contentType === null ||
          contentLength === null ||
          contentLength === "0" ||
          !contentType.includes("application/json")
        ) {
          console.log("Empty response or not JSON.");
          setMovieData([]);
          return;
        }
  
        const data: Movie[] = await response.json();
  
        // Log the raw data to better understand the response
        console.log("Raw Data:", data);
  
        // Check if the response contains valid JSON data
        if (Array.isArray(data)) {
          setMovieData(data);
          console.log("Parsed Data:", data);
  
          // Check if there are more pages
          setHasMorePages(data.length >= limit);
        } else {
          console.log("Invalid JSON data in response.");
          setMovieData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    useEffect(() => {
      // Fetch data when the component mounts or when the page changes
      fetchData();
  
      // Update the URL with the current page and limit
      window.history.pushState(null, "", `?page=${currentPage}&limit=${limit}`);
    }, [currentPage, limit]); // Re-fetch data when the page or limit changes
  
    const handleSearch = async () => {
      // Check if minRating is a valid number
      const minRatingValue = parseFloat(minRating);
      if (isNaN(minRatingValue)) {
        // Handle the case where the input is not a valid number
        setInputError("Please enter a valid number for minimum rating.");
        return;
      }
  
      // Clear any previous input error
      setInputError(null);
  
      // Fetch data based on user's input
      try {
        const response = await fetch(
          `http://localhost:9876/ntuaflix_api/searchbyrating?limit=${limit}&page=1`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              gqueryObject: {
                minrating: minRatingValue.toString(),
              },
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const contentType = response.headers.get("content-type");
        const contentLength = response.headers.get("content-length");
  
        console.log("Content-Type:", contentType);
        console.log("Content-Length:", contentLength);
  
        if (
          contentType === null ||
          contentLength === null ||
          contentLength === "0" ||
          !contentType.includes("application/json")
        ) {
          console.log("Empty response or not JSON.");
          setMovieData([]);
          return;
        }
  
        const data: Movie[] = await response.json();
  
        // Log the raw data to better understand the response
        console.log("Raw Data:", data);
  
        // Check if the response contains valid JSON data
        if (Array.isArray(data)) {
          setMovieData(data);
          console.log("Parsed Data:", data);
  
          // Reset current page to 1 when searching
          setCurrentPage(1);
  
          // Update the URL with the current page and limit
          window.history.pushState(null, "", `?page=1&limit=${limit}`);
  
          // Check if there are more pages
          setHasMorePages(data.length >= limit);
        } else {
          console.log("Invalid JSON data in response.");
          setMovieData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  

  const handlePageChange = (newPage: number) => {
    // Update the current page when the user clicks on the pagination links
    setCurrentPage(newPage);

    // Update the URL with the current page and limit
    window.history.pushState(null, "", `?page=${newPage}&limit=${limit}`);

    // Scroll to the top of the screen
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div
        className="input-group mb-3"
        style={{ width: "40%", margin: "0 auto", marginTop: "40px" }}
      >
        <span className="input-group-text">Set the minimum rating value</span>
        <input
          type="text"
          className={`form-control ${inputError ? "is-invalid" : ""}`}
          placeholder="Min"
          aria-label="Min"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            // Allow only numbers and decimals
            const sanitizedValue = e.target.value.replace(/[^0-9.]/g, "");
            setMinRating(sanitizedValue);
          }}
          pattern="[0-9]*[.]?[0-9]*"
        />

        <button
          className="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
          onClick={handleSearch}
        >
          Filter
        </button>
      </div>
      <Box
        sx={{
          display: "grid",
          padding: "3%",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "30px",
        }}
      >
        {movieData.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          movieData.map(
            (item, index) =>
              item &&
              item.titleObject.rating && (
                <Card
                  key={index}
                  id={item.titleObject.titleID}
                  type={item.titleObject.type}
                  title={item.titleObject.originalTitle}
                  rating={item.titleObject.rating.avRating}
                  poster={
                    item.titleObject.titlePoster
                      ? item.titleObject.titlePoster.replace(
                          "{width_variable}",
                          "original"
                        )
                      : fallbackPosterUrl
                  }
                />
              )
          )
        )}
      </Box>

      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center " data-bs-theme="dark">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
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
              onClick={() => handlePageChange(currentPage + 1)}
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

