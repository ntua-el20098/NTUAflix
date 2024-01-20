"use client";
import { useState, useEffect } from "react";
import { Box, InputBase } from "@mui/material";
import Card from "@/components/Card";
import 'bootstrap/scss/bootstrap.scss';

const MovieInfo = () => {
  const [movieData, setMovieData] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:9876/ntuaflix_api/searchbyrating", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gqueryObject: {
              minrating: minRating.toString(), // Convert to string
              maxrating: maxRating.toString(), // Convert to string
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
  }, [minRating, maxRating]);

  const handleSearch = () => {
    // Fetch data based on user's input
    fetchData();
  };

  return (
    <div>
      <div style={{ marginLeft: "5%", marginRight: "20%", marginTop: "20px", marginBottom: "20px" }}>
        <label htmlFor="customRange" className="form-label">Filter by Minimun Rating</label>
        <input type="range" className="form-range" min="0" max="10" step="0.1" id="customRange" />
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
