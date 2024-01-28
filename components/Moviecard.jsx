import 'bootstrap/dist/css/bootstrap.min.css';

const Card = ({ image, name, id, type }) => {
    return (
        <a href={`/titles/${id}`} className="card-link" style={{ textDecoration: 'none'}}>
            <div className="card card-hover" style={{ width: '180px', height: '100%' }} data-bs-theme="dark">
                <img
                    src={image}
                    className="card-img-top"
                    alt={name}
                    style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                    <div style={{ height: '50px' }}> {/* Set a fixed height for the card body */}
                        <p className="card-text overflow-hidden text-truncate">
                            {name}
                        </p>
                    </div>
                    <div className="mt-auto">
                        <span className="badge bg-secondary float-end">{type}</span>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default Card;
