"use client";
import { useEffect, useState } from "react";
import { Box, InputBase, Typography } from "@mui/material";
import 'bootstrap/scss/bootstrap.scss';
import Card from "@/components/Card";

const MoviesPage = () => {
  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Display debugging message
        console.log("Fetching data from the API...");

        const response = await fetch("http://localhost:3000/api/samples/bygenre", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gqueryObject: {
              qgenre: "Animation",
              minrating: "1",
              yrFrom: "1990",
              yrTo: "1995",
            },
          }),
        });

        const data = await response.json();

        // Display debugging message
        console.log("Data received from the API:", data);

        setMovieData(data);
      } catch (error) {
        // Display debugging message in case of an error
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // The empty dependency array ensures that this effect runs once on component mount

  return (
    <div>
      {/* Rest of the code remains unchanged */}
      <Box sx={{ display: "grid", padding: "3%", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "30px" }}>
        {movieData.map((movie, index) => (
          <Card key={index} poster={movie.img_url_asset} title={movie.primaryTitle} id={1} />
        ))}
      </Box>
      {/* Pagination and other components remain unchanged */}
    </div>
  );
};

export default MoviesPage;
