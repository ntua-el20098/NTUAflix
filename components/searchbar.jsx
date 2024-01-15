import React from "react";
import { Box, InputBase } from "@mui/material";

const SearchBar = () => {
    return (
        <Box
            sx={{
                position: "relative",
                width: "50%",
                margin: "0 auto",
                marginBottom: "20px",
            }}
        >
            <InputBase
                placeholder="Search for a movie in the database"
                sx={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#333",
                    border: "3px solid #555",
                    borderRadius: "16px",
                    color: "#fff",
                    transition: "border-color 0.3s",
                    "&:hover": {
                        borderColor: "#16abff",
                    },
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    right: "4%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#fff",
                }}
            >
                <label>
                    <input type="radio" name="searchType" value="movie" /> Movie
                </label>
                <label>
                    <input type="radio" name="searchType" value="actor" /> Actor
                </label>
            </Box>
        </Box>
    );
};

export default SearchBar;
