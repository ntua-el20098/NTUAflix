"use client";
import { useState, useEffect } from "react";
import { Box, InputBase, Typography } from "@mui/material";
import 'bootstrap/scss/bootstrap.scss';
import Card from "@/components/Card";

const MovieInfo = () => {
  const [movieData, setMovieData] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:9876/ntuaflix_api/bygenre", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "gqueryObject": {
              "qgenre": "Short",
              "minrating": "1"
            }
          }),
        });
        const data = await response.json();
  
        // Check if data is an array and has valid entries
        if (Array.isArray(data)) {
          // Extract genres from valid titleObjects
          const genresList = data
            .flatMap(item => 
              item.titleObject && item.titleObject.genres
                ? item.titleObject.genres.map(genre => genre.genreTitle)
                : []
            )
            .flat(); // Flatten the nested array
  
          console.log("Genres List:", genresList);
  
          setMovieData(data);
        } else {
          console.log("Invalid data format:", data);
          setMovieData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleSearch = async () => {
    // Fetch data based on user's selected genre
    try {
      const response = await fetch("http://localhost:9876/ntuaflix_api/searchbyrating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "gqueryObject": {
            "minrating": "1",
            "genre": selectedGenre,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMovieData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div > 
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "40px", width: "50%", marginLeft: "25%" }}>
        <select className="form-select" aria-label="Default select example" style={{ marginRight: "10px" }} value={selectedGenre} onChange={handleGenreChange}>
          <option value="">Select genre</option>
          {genresList.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </select>
        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={handleSearch}>
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
  );
};

export default MovieInfo;
