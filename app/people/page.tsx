"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Box, InputBase, Alert } from "@mui/material";
import Card from "@/components/allpeoplecard";

interface Person {
  nameObject: {
    nameID: string;
    name: string;
    namePoster: string;
    profession: string;
  };
}

const PeoplePage: React.FC = () => {
  const [actorData, setActorData] = useState<Person[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(24);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const fallbackPosterUrl =
    "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg";

  useEffect(() => {
    const fetchDataAndNavigate = async () => {
      await fetchData();
      window.history.pushState(null, "", `?page=${currentPage}&limit=${limit}`);
    };

    fetchDataAndNavigate();
  }, [currentPage, limit]);

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
              namePart: searchTerm,
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
              namePart: searchTerm,
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
        style={{ width: "40%", margin: "0 auto", marginTop: "40px" }}
      >
        <span className="input-group-text">Search by name</span>
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          aria-label="Name"
          aria-describedby="button-addon2"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
          }}
        />
        {searchTerm && ( // Display the "X" button only when searchTerm is not empty
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setSearchTerm("")} // Clear the searchTerm when clicked
          >
            x
          </button>
        )}

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
              name={actor.nameObject.name}
              image={
                actor.nameObject.namePoster
                  ? actor.nameObject.namePoster.replace(
                      "{width_variable}",
                      "original"
                    )
                  : fallbackPosterUrl
              }
              id={actor.nameObject.nameID}
              type={
                actor.nameObject.profession
                  ? actor.nameObject.profession.split(",")[0]
                  : ""
              }
            />
          ))
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

export default PeoplePage;
