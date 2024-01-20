"use client";
import { useState, useEffect } from "react";
import { Box, InputBase } from "@mui/material";
import Card from "@/components/Card";

const MovieInfo = () => {
  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/samples/searchbyrating", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gqueryObject: {
              minrating: "0",
              maxrating: "10",
            },
          }),
        });
        const data = await response.json();
        setMovieData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div
        className="input-group mb-3"
        style={{ width: "60%", margin: "0 auto", marginTop: "40px" }}
      >
        <span className="input-group-text">Search by rating range</span>
        <input
          type="text"
          className="form-control"
          placeholder="Min"
          aria-label="Min"
        />
        <input
          type="text"
          className="form-control"
          placeholder="Max"
          aria-label="Max"
        />
  
        <button
          className="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
        >
          Search
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
        {movieData.map((item, index) => (
          item.titleObject && item.titleObject.rating && (
            <Card
              key={index}
              id={item.titleObject.titleID}
              type={item.titleObject.type}
              title={item.titleObject.originalTitle}
              rating={item.titleObject.rating.avRating}
              poster={item.titleObject.titlePoster.replace('{width_variable}', 'original')}
            />
          )
        ))}
      </Box>
  
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center " data-bs-theme="dark">
          <li className="page-item disabled">
            <a className="page-link">Previous</a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              4
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );};

export default MovieInfo;
