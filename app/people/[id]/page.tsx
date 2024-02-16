"use client";
import { useEffect, useState } from "react";
import MovieCard from "@/components/Moviecard";
import "bootstrap/dist/css/bootstrap.min.css";
import TitleCardRating from "@/components/Onetitlecard";
import TitleCardYear from "@/components/Onetitlecarddate";
const https = require('https');

interface AppearsIn {
  startYear: string;
  avRating: string;
  titleID: string;
  category: string;
  titlePoster: string;
  type: string;
  originalTitle: string;
}

interface PersonData {
  nameID: string;
  name: string;
  namePoster: string;
  profession: string;
  birthYr: number;
  deathYr: number;
  nameTitles: AppearsIn[];
}

function Page({ params }: { params: { id: string } }) {
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [movieDetails, setMovieDetails] = useState<AppearsIn[]>([]);
  const [highestRated, setHighestRated] = useState<AppearsIn | null>(null);
  const [mostRecent, setMostRecent] = useState<AppearsIn | null>(null);
  const fallbackPosterUrl =
    "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://localhost:9876/ntuaflix_api/name/${params.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: { nameObject: PersonData } = await response.json();

        // Split professions, remove duplicates, and join back
        const uniqueProfessions = [
          ...new Set(data.nameObject.profession.split(",")),
        ];
        const formattedProfession = uniqueProfessions.join(", ");

        setPersonData({ ...data.nameObject, profession: formattedProfession });

        // Check if nameTitles is not an empty array before fetching appears in data
        if (
          data.nameObject.nameTitles &&
          data.nameObject.nameTitles.length > 0
        ) {
          // Fetch movie details for each titleID in nameTitles
          const movieDetailsPromises = data.nameObject.nameTitles.map(
            async (title) => {
              const titleResponse = await fetch(
                `https://localhost:9876/ntuaflix_api/title/${title.titleID}`
              );
              if (titleResponse.ok) {
                const titleData: {
                  titleObject: {
                    titlePoster: string;
                    originalTitle: string;
                    startYear: string;
                    rating: { avRating: string };
                  };
                } = await titleResponse.json();

                const updatedTitle = {
                  ...title,
                  titlePoster: titleData.titleObject.titlePoster,
                  originalTitle: titleData.titleObject.originalTitle,
                  startYear: titleData.titleObject.startYear,
                  avRating: titleData.titleObject.rating.avRating,
                };

                // Update most recent and highest rated titles
                if (
                  !mostRecent ||
                  titleData.titleObject.startYear > mostRecent.startYear
                ) {
                  setMostRecent(updatedTitle);
                }
                if (
                  !highestRated ||
                  titleData.titleObject.rating.avRating > highestRated.avRating
                ) {
                  setHighestRated(updatedTitle);
                }

                return updatedTitle;
              }
              return title;
            }
          );

          // Wait for all movie details promises to resolve
          const movieDetailsResults = await Promise.all(movieDetailsPromises);

          setMovieDetails(movieDetailsResults);
          console.log("Fetched movie details:", movieDetailsResults);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id, mostRecent, highestRated]);

  return (
    <div className="relative px-4 md:px-0">
      {personData && (
        <div className="container mx-auto min-h-screen flex items-center justify-center relative">
          <div className="mr-8 mt-4">
            <img
              src={
                personData.namePoster.replace("{width_variable}", "original") ||
                fallbackPosterUrl
              }
              className="w-48 h-72 object-cover"
              alt={personData.name}
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
              <h1 className="text-4xl font-bold">{personData.name}</h1>

              <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Professions:</strong>{" "}
                    {personData.profession.split(",").map((prof, index) => (
                      <span
                        key={index}
                        style={{ marginLeft: "6px" }}
                        className="badge bg-secondary"
                      >
                        {prof.trim()}
                      </span>
                    ))}
                  </li>
                  <li className="list-group-item">
                    <strong>Birth Year:</strong>{" "}
                    {personData.birthYr !== 0 ? personData.birthYr : "-"}
                  </li>
                  <li className="list-group-item">
                    <strong>Death Year:</strong>{" "}
                    {personData.deathYr !== 0 ? personData.deathYr : "-"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {movieDetails.length > 0 && (
        <>
          <ul className="list-group mt-4 mb-4">
            <li className="list-group-item">
              <h2 className="text-2xl font-bold mt-8">Appears In</h2>
            </li>
            <li className="list-group-item">
              <div className="pre-cast-card-container">
                <div className="cast-card-container flex items-center ">
                  {movieDetails.map((movie, index) => (
                    <MovieCard
                      key={index}
                      id={movie.titleID}
                      name={movie.originalTitle}
                      type={movie.category}
                      image={
                        (movie.titlePoster &&
                          movie.titlePoster.replace(
                            "{width_variable}",
                            "original"
                          )) ||
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
      {mostRecent && highestRated && (
        <div className="cardcontainer">
          <TitleCardRating
            text="Highest Rated"
            id={highestRated.titleID}
            name={highestRated.originalTitle}
            type={highestRated.category}
            image={
              highestRated.titlePoster.replace(
                "{width_variable}",
                "original"
              ) || fallbackPosterUrl
            }
            rating={highestRated.avRating}
          />

          <TitleCardYear
            text="Most Recent"
            id={highestRated.titleID}
            name={mostRecent.originalTitle}
            type={mostRecent.category}
            image={
              mostRecent.titlePoster.replace("{width_variable}", "original") ||
              fallbackPosterUrl
            }
            year={mostRecent.startYear}
          />
        </div>
      )}
    </div>
  );
}

export default Page;
