import PeopleCard from "@/components/PeopleCard";
import MovieCard from "@/components/Card";

function page() {

  const Person = {
    coverImage:
      "https://www.pentapostagma.gr/sites/default/files/styles/main/public/2021-08/image-77.png?itok=_4JiB9ue",
    name: "Sbhsa Person",
    description: "This is sbhsas biography for development purposes.",
    age: "12",
    birthplace: "Grecia",
    Awards: "100",
    Status: "Alive",
    Spouse: "No",
  };

  const genres = {
    genre1: "Action",
    genre2: "Adventure",
    genre3: "Drama",
  };

  const moviePosters = [
    "https://xl.movieposterdb.com/23_07/2023/10545296/xl_the-hunger-games-the-ballad-of-songbirds-and-snakes-movie-poster_af992b69.jpg?v=2023-11-27%2023:11:24",
    "https://xl.movieposterdb.com/23_06/2023/15398776/xl_oppenheimer-movie-poster_a83f1cbb.jpg?v=2023-11-27%2023:27:53",
    "https://xl.movieposterdb.com/23_06/2023/15398776/xl_oppenheimer-movie-poster_a83f1cbb.jpg?v=2023-11-27%2023:27:53",
    "https://xl.movieposterdb.com/23_06/2023/15398776/xl_oppenheimer-movie-poster_a83f1cbb.jpg?v=2023-11-27%2023:27:53",
    "https://xl.movieposterdb.com/23_06/2023/15398776/xl_oppenheimer-movie-poster_a83f1cbb.jpg?v=2023-11-27%2023:27:53",
    "https://xl.movieposterdb.com/23_06/2023/15398776/xl_oppenheimer-movie-poster_a83f1cbb.jpg?v=2023-11-27%2023:27:53",
    "https://xl.movieposterdb.com/23_06/2023/15398776/xl_oppenheimer-movie-poster_a83f1cbb.jpg?v=2023-11-27%2023:27:53",
    "https://xl.movieposterdb.com/23_06/2023/15398776/xl_oppenheimer-movie-poster_a83f1cbb.jpg?v=2023-11-27%2023:27:53",
    "https://xl.movieposterdb.com/23_06/2023/15398776/xl_oppenheimer-movie-poster_a83f1cbb.jpg?v=2023-11-27%2023:27:53",
    "https://xl.movieposterdb.com/23_06/2023/15398776/xl_oppenheimer-movie-poster_a83f1cbb.jpg?v=2023-11-27%2023:27:53",
  ];

  return (
    <div className="bg-secondary relative px-4 md:px-0">
      <div className="container mx-auto min-h-[calc(100vh-77px)] flex items-center relative">
        <div className="flex-col lg:flex-row flex gap-10 lg:mx-10 py-20">
          <div className="mx-auto flex-none relative">
            <img
              src={Person.coverImage}
              width={700}
              height={700}
              className="w-[300px] object-cover"
              alt={Person.name}
            />
          </div>
          <div className="space-y-6">
            <div className="uppercase -translate-y-3 text-[26px] md:text-[34px] font-medium pr-4 text-white">
              {Person.name}
            </div>
            <div className="flex gap-4 flex-wrap">
              {Object.values(genres).join(" / ")}
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <div>Age: {Person.age}</div>
              <div>Birth Place: {Person.birthplace}</div>
              <div>Status: {Person.Status} </div>
              <div>Spouse: {Person.Spouse} </div>
              <div>Awards: {Person.Awards} </div>
            </div>

            <div className="pt-14 space-y-2 pr-4">
              <div>OVERVIEW:</div>
              <div className="lg:line-clamp-4">{Person.description}</div>
            </div>
          </div>
        </div>
      </div>
      <h2>Known for :</h2>
      <div className="container mx-auto min-h-[calc(40vh-77px)] flex items-center relative">
        <div className="overflow-x-auto flex gap-4 py-4">
          {moviePosters.map((poster, index) => (
            <MovieCard
              key={index}
              poster={poster}
              title={`Movie Title ${index}`}
              id={1}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
}

export default page;
