"use client"; // Remove this line if not needed
import { useEffect, useState } from "react";
import MovieCard from "@/components/Card";

interface PersonData {
  nameID: string;
  name: string;
  namePoster: string;
  birthYr: number;
  deathYr: number | null;
  profession: string;
  nameTitles: { titleID: string; category: string }[];
  description: string;
  birthplace: string;
}

function Page({ params }: { params: { id: string } }) {
  const [personData, setPersonData] = useState<PersonData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:9876/ntuaflix_api/name/${params.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: { nameObject: PersonData } = await response.json();
        setPersonData(data.nameObject);
        console.log("Fetched data:", data.nameObject);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <div className="relative px-4 md:px-0">
      <div className="container mx-auto min-h-[calc(100vh-77px)] flex items-center relative">
        <div className="flex-col lg:flex-row flex gap-10 lg:mx-10 py-20">
          <div className="mx-auto flex-none relative">
            <img
              src={personData?.namePoster.replace('{width_variable}', 'original')}
              width={700}
              height={700}
              className="w-[300px] object-cover"
              alt={personData?.name}
            />
          </div>
          <div className="space-y-6">
            <div className="uppercase -translate-y-3 text-[26px] md:text-[34px] font-medium pr-4 text-white">
              {personData?.name}
            </div>
            <div className="flex gap-4 flex-wrap">
              {personData?.nameTitles.map((title) => (
                <span key={title.titleID}>{title.category}</span>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <div>
                Age: {new Date().getFullYear() - (personData?.birthYr ?? 0)}
              </div>
              <div>Birth Place: {personData?.birthplace}</div>
              <div>Profession: {personData?.profession}</div>
            </div>

            <div className="pt-14 space-y-2 pr-4">
              <div>OVERVIEW:</div>
              <div className="lg:line-clamp-4">{personData?.description}</div>
            </div>
          </div>
        </div>
      </div>
      <h2>Known for :</h2>
      <div className="container mx-auto min-h-[calc(40vh-77px)] flex items-center relative">
        <div className="overflow-x-auto flex gap-4 py-4">
          {/* Assuming you have an array of movie posters in your data */}
          {personData?.nameTitles.map((title) => (
            <MovieCard
              key={title.titleID}
              poster={
                "https://www.google.gr/imgres?imgurl=https%3A%2F%2Fwww.hello.cy%2Fwp-content%2Fuploads%2Fgr%2F2023%2F07%2F%25CE%2592%25CE%25AF%25CE%25BA%25CF%2585-%25CE%259A%25CE%25B1%25CE%25B3%25CE%25B9%25CE%25AC-1.jpg&tbnid=ZZfYyzTfMOO4YM&vet=12ahUKEwjR6rWbiu-DAxUXgP0HHey1AB8QMygBegQIARBN..i&imgrefurl=https%3A%2F%2Fwww.hello.cy%2Fcelebrity-news%2Fsygkinimeni-apochaireta-to-shopping-star-i-viky-kagia-i-anartisi-tis%2F&docid=nlYLNSg6JTKZaM&w=727&h=445&q=%CE%B2%CE%B9%CE%BA%CF%85%20%CE%BA%CE%B1%CE%B3%CE%B9%CE%B1%20shopping%20star&ved=2ahUKEwjR6rWbiu-DAxUXgP0HHey1AB8QMygBegQIARBN"
              }
              title={`Movie Title ${title.titleID}`}
              id={title.titleID}
              type={title.category}
              rating={undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
