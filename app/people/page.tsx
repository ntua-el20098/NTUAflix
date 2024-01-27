"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Box, InputBase, Alert } from "@mui/material";
import Card from "@/components/allpeoplecard";

interface Person {
  nameID: string;
  name: string;
  namePoster: string;
  profession: string;
}

const PeoplePage: React.FC = () => {
  const [actorData, setActorData] = useState<Person[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(24);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Added state for search term
  const [hasMorePages, setHasMorePages] = useState<boolean>(true); // Track if there are more pages
  const fallbackPosterUrl =
    "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg";

  useEffect(() => {
    fetchData();
  }, [currentPage, limit, searchTerm]); // Include searchTerm in dependencies

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:9876/ntuaflix_api/searchname?limit=${limit}&page=${currentPage}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nqueryObject: {
              namePart: searchTerm, // Use the searchTerm in the body
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Person[] = await response.json();

      // Check if data is an array and has valid entries
      if (Array.isArray(data) && data.length > 0) {
        setActorData(data);
        setError(null);
      } else {
        console.log("Invalid data format or empty data:", data);
        setActorData([]);
        setError("No results found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please try again later.");
    }
  };

  const handlePagination = (page: number) => {
    setCurrentPage(page);

    window.history.pushState(null, "", `?page=${page}&limit=${limit}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:9876/ntuaflix_api/searchname?limit=${limit}&page=1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nqueryObject: {
              namePart: searchTerm, // Use the searchTerm in the body
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
        setActorData([]);
        return;
      }
      const data: Person[] = await response.json();

      // Log the raw data to better understand the response
      console.log("Raw Data:", data);

      // Check if the response contains valid JSON data
      if (Array.isArray(data)) {
        setActorData(data);
        console.log("Parsed Data:", data);

        // Reset current page to 1 when searching
        setCurrentPage(1);

        // Update the URL with the current page and limit
        window.history.pushState(null, "", `?page=1&limit=${limit}`);

        // Check if there are more pages
        setHasMorePages(data.length >= limit);
      } else {
        console.log("Invalid JSON data in response.");
        setActorData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div
        className="input-group mb-3"
        style={{ width: "60%", margin: "0 auto", marginTop: "40px" }}
      >
        <span className="input-group-text">Search by name</span>
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          aria-label="Name"
          aria-describedby="button-addon2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {error && <Alert severity="info">{error}</Alert>}
      <Box
        sx={{
          display: "grid",
          padding: "3%",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "30px",
        }}
      >
        {actorData.length === 0 ? (
          <p>No results found.</p>
        ) : (
        actorData.map((actor, index) => (
          <Card
            key={index}
            name={actor.name}
            image={
              actor.namePoster
                ? actor.namePoster.replace("{width_variable}", "original")
                : fallbackPosterUrl
            }
            id={actor.nameID}
            type={actor.profession ? actor.profession.split(",")[0] : ""}
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
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              {currentPage}
            </a>
          </li>
          <li
            className={`page-item ${
              actorData.length === 0 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePagination(currentPage + 1)}
              disabled={actorData.length === 0}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PeoplePage;
