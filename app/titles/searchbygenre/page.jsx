import { Box, InputBase, Typography } from "@mui/material";
import 'bootstrap/scss/bootstrap.scss';
import Card from "@/components/Card";
  

const MoviesPage = () => {
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
    <div > 
      
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "40px", width: "50%", marginLeft: "25%" }}>
      <select className="form-select" aria-label="Default select example" style={{  marginRight: "10px" }} defaultValue="">
        <option value="">Select genre</option>
        <option value="1">Genre1</option>
        <option value="2">Genre2</option>
        <option value="3">Genre3</option>
        <option value="3">...</option>
      </select>
      <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
    </div>
      <Box sx={{ display: "grid",padding: "3% ", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "30px" }}>
        {moviePosters.map((poster, index) => (
          <Card key={index} poster={poster} title={`Movie Title ${index}`} id={1} type={"Movie"} rating={"6"}/>
        ))}
      </Box>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center " data-bs-theme="dark" >
          <li className="page-item disabled">
            <a className="page-link">Previous</a>
          </li>
          <li className="page-item"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li>
          <li className="page-item"><a className="page-link" href="#">4</a></li>
          <li className="page-item">
            <a className="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>

    </div>
  );
};

export default MoviesPage;