import React from "react";
import { Box, InputBase, Typography } from "@mui/material";
import Card from "@/components/PeopleCard";

const PeoplePage = () => {
const actorData = [
  { name: "SBHSA", photo: "https://www.pentapostagma.gr/sites/default/files/styles/main/public/2021-08/image-77.png?itok=_4JiB9ue" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
  { name: "Actor Name", photo: "https://www.whitechapelgallery.org/wp-content/uploads/2020/07/blank-head-profile-pic-for-a-man.jpg" },
];

return (
  <div > 
    <div className="input-group mb-3" style={{ width: "50%", margin: "0 auto", marginTop:"40px" }}>
      <input type="text" className="form-control" placeholder="Search by name" aria-label="Search by name" aria-describedby="button-addon2"/>
      <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
    </div>
    <Box sx={{ display: "grid", padding: "3%", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "30px" }}>
      {actorData.map((actor, index) => (
        <Card key={index} name={actor.name} image={actor.photo} id={1} />
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

export default PeoplePage;