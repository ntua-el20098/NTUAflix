"use client";
import { useEffect, useState } from "react";
import PeopleCard from "@/components/PeopleCard";
import MovieCard from "@/components/Card";
import "bootstrap/scss/bootstrap.scss";

function Page() {
  const [movieData, setMovieData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/samples/title/tt0098987"
        );
        const data = await response.json();
        setMovieData(data);
        console.log(data); // Log the output to the console
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-secondary relative px-4 md:px-0">
      <div className="container mx-auto min-h-[calc(100vh-77px)] flex items-center relative">
        <div className="flex-col lg:flex-row flex gap-10 lg:mx-10 py-20">
          <div className="mx-auto flex-none relative">
            <img
              src={movieData?.titlePoster.replace(
                "{width_variable}",
                "original"
              )} // Use 'original' as a constant value
              width={700}
              height={700}
              className="w-[300px] object-cover"
              alt={movieData?.originalTitle}
            />
          </div>
          <div className="space-y-6">
            <div className="uppercase -translate-y-3 text-[26px] md:text-[34px] font-bold pr-4 text-white">
              {movieData?.originalTitle}
            </div>
            <div className="flex gap-3 flex-wrap">
              {movieData?.genres.map((genre, index) => (
                <span key={index} className="badge bg-red-500">
                  {genre.genreTitle}
                </span>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <div>Type: {movieData?.type}</div>
              <div>Language: English</div>
              <div>Release: {movieData?.startYear}</div>
              <div>Runtime: 120 MIN.</div>
              <div>Rating: {movieData?.rating.avRating} ⭐</div>
            </div>

            <div className="pt-14 space-y-2 pr-4">
              <div>OVERVIEW:</div>
              <div className="lg:line-clamp-4">
                {" "}
                Here is the overview for {movieData?.originalTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2>Cast :</h2>
      <div className="container mx-auto min-h-[calc(40vh-77px)] flex items-center relative">
        <div className="overflow-x-auto flex gap-4 py-4">
          {movieData?.principals.map((person, index) => (
            <PeopleCard
              key={index}
              id={person.nameID}
              name={person.name}
              type={person.category}
              image={`https://www.hello.cy/wp-content/uploads/gr/2023/07/%CE%92%CE%AF%CE%BA%CF%85-%CE%9A%CE%B1%CE%B3%CE%B9%CE%AC-1.jpg`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
