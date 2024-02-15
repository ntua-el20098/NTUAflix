import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Card = ({ text, image, name, id, type, year }) => {
  return (
    <a
      href={`/titles/${id}`}
      className="card-link"
      style={{ textDecoration: "none" }}
    >
      <div className="card card-hover mb-3" style={{ maxWidth: "540px" }}>
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={image}
              className="card-img-top"
              alt={name}
              style={{ height: "250px", width: "250px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{text}</h5>
              <p className="card-text overflow-hidden text-truncate">{name}</p>
              <div className="mt-auto">
                <span className="badge bg-secondary float-end">{type}</span>
              </div>
              <div>
                <span
                  style={{ marginLeft: "5px" }}
                  className="badge bg-secondary"
                >
                  Released: {year}{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default Card;
