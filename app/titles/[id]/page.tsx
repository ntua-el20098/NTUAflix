"use client";
import { useEffect, useState } from "react";
import PeopleCard from "@/components/Castcard";
import MovieCard from "@/components/Moviecard";
import "bootstrap/dist/css/bootstrap.min.css";

interface Genre {
  genreTitle: string;
}

interface SimilarMovies {
  titleID: string;
  originalTitle: string;
  type: string;
  titlePoster: string;
}

interface Principal {
  nameID: string;
  name: string;
  category: string;
  poster: string;
}

interface TitleAka {
  akaTitle: string;
  regionAbbrev: string;
}

interface MovieData {
  titleID: string;
  type: string;
  originalTitle: string;
  titlePoster: string;
  startYear: number;
  endYear: number;
  runtime: number;
  genres: Genre[];
  titleAkas: TitleAka[];
  principals: Principal[];
  rating: {
    avRating: number;
    nVotes: number;
  };
  overview: string;
}

function Page({ params }: { params: { id: string } }) {
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [castData, setCastData] = useState<
    Array<{ nameID: string; namePoster: string }>
  >([]);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovies[]>([]);
  const fallbackPosterUrl =
    "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg";

    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:9876/ntuaflix_api/title/${params.id}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data: { titleObject: MovieData } = await response.json();
          setMovieData(data.titleObject);
          console.log("Fetched data:", data.titleObject);
    
          const castDataPromises = data.titleObject.principals.map(async (person) => {
            try {
              const castResponse = await fetch(
                `http://localhost:9876/ntuaflix_api/name/${person.nameID}`
              );
              if (!castResponse.ok) {
                throw new Error(`HTTP error! Status: ${castResponse.status}`);
              }
    
              const castData: { nameObject: { namePoster: string } } = await castResponse.json();
              console.log("Fetched cast poster:", castData.nameObject.namePoster);
    
              // Update the person in the principals array with the fetched poster data
              const updatedPrincipals = movieData?.principals.map((p) =>
                p.nameID === person.nameID ? { ...p, poster: castData.nameObject.namePoster } : p
              );
    
              // Set the updated movie data
              setMovieData((prevMovieData) => ({
                ...prevMovieData!,
                principals: updatedPrincipals || [],
              }));
    
              return castData.nameObject.namePoster;
            } catch (error) {
              console.error("Error fetching cast data:", error);
              return null;
            }
          });
    
          // Wait for all cast data promises to resolve
          const castResults = await Promise.all(castDataPromises);
    
          // Filter out null results
          const validCastResults = castResults.filter((result) => result !== null) as string[];
    
          // Update the state with an array of objects with nameID and namePoster properties
          setCastData(validCastResults.map((poster, index) => ({ nameID: `${index}`, namePoster: poster })));
    
          // Update the principals array with the fetched poster data
          const updatedPrincipals = data.titleObject.principals.map(
            (person, index) => ({
              ...person,
              poster: validCastResults[index] || "", // Use the fetched poster or an empty string if not available
            })
          );
    
          // Set the updated movie data
          setMovieData({
            ...data.titleObject,
            principals: updatedPrincipals,
          });
    
          console.log("Fetched cast data:", validCastResults);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchData();
    }, [params.id]);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      if (movieData && movieData.genres && movieData.genres.length > 0) {
        // Filter out empty genres
        const nonEmptyGenres = movieData.genres.filter((genre) => genre.genreTitle.trim() !== "");
  
        if (nonEmptyGenres.length > 0) {
          const similarMoviesPromises = nonEmptyGenres.map(async (genre) => {
            const response = await fetch("http://localhost:9876/ntuaflix_api/bygenre?limit=3", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                gqueryObject: {
                  qgenre: genre.genreTitle,
                  minrating: "0",
                },
              }),
            });
  
            if (response.ok) {
              const genreMovies: { titleObject: SimilarMovies }[] = await response.json();
              return genreMovies.map((item) => item.titleObject);
            }
            return [];
          });
  
          const similarMoviesResults = await Promise.all(similarMoviesPromises);
          const flattenedSimilarMovies = similarMoviesResults.flat();
  
          // Filter out the current movie from similar movies
          const filteredSimilarMovies = flattenedSimilarMovies
            .filter((similarMovie) => similarMovie.titleID !== movieData.titleID)
            .filter(
              (value, index, self) =>
                self.findIndex((m) => m.titleID === value.titleID) === index
            );
  
          setSimilarMovies(filteredSimilarMovies);
          console.log("Fetched similar movies data:", filteredSimilarMovies);
        }
      }
    };
  
    // Check if genres list is not empty before making the fetch request
    if (movieData && movieData.genres && movieData.genres.length > 0) {
      fetchSimilarMovies();
    }
  }, [movieData]);

  return (
    <div className="relative px-4 md:px-0">
      {movieData && (
        <div className="container mx-auto min-h-screen flex items-center justify-center relative">
          <div className="mr-8 mt-4">
            {" "}
            <img
              src={
                movieData.titlePoster.replace("{width_variable}", "original") ||
                fallbackPosterUrl
              }
              className="w-48 h-72 object-cover"
              alt={movieData.originalTitle}
              style={{
                objectFit: "cover",
                height: "550px",
                width: "350px",
                borderRadius: "8px",
              }}
            />
          </div>

          <div className="flex-col lg:flex-row flex gap-10 lg:mx-10 py-20">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold">{movieData.originalTitle}</h1>
              <div className="flex gap-3 flex-wrap">
                {movieData.genres.map((genre, index) => (
                  <span key={index} className="badge text-bg-light">
                    {genre.genreTitle}
                  </span>
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <div>
                      <strong>Type:</strong> {movieData.type}
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div>
                      <strong>Release Year:</strong> {movieData.startYear}
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div>
                      <strong>Rating:</strong> {movieData.rating.avRating} ⭐ (
                      {movieData.rating.nVotes} votes)
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

{movieData && (
  <>
    <ul className="list-group ">
      <li className="list-group-item">
        <h2 className="text-2xl font-bold mt-8">Cast</h2>
      </li>
      <li className="list-group-item">
        <div className="pre-cast-card-container">
          <div className="cast-card-container flex items-center ">
            {movieData.principals.map((person, index) => (
              <PeopleCard
                key={index}
                id={person.nameID}
                name={person.name}
                type={person.category}
                image={
                  person.poster &&
                  person.poster.replace("{width_variable}", "original") ||
                  fallbackPosterUrl
                }
              />
            ))}
          </div>
        </div>
      </li>
    </ul>
  </>
)}

      {similarMovies.length > 0 && (
        <>
          <ul className="list-group mt-4 mb-4">
            <li className="list-group-item">
              <h2 className="text-2xl font-bold mt-8">Similar movies</h2>
            </li>
            <li className="list-group-item">
              <div className="pre-cast-card-container">
                <div className="cast-card-container flex items-center ">
                  {similarMovies.map((similarMovie, index) => (
                    <MovieCard
                      key={index}
                      id={similarMovie.titleID}
                      name={similarMovie.originalTitle}
                      type={similarMovie.type}
                      image={
                        similarMovie.titlePoster &&
                        similarMovie.titlePoster.replace("{width_variable}", "original") ||
                        fallbackPosterUrl
                      }
                    />
                  ))}
                </div>
              </div>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

export default Page;
