import 'bootstrap/scss/bootstrap.scss';

const Card = ({ poster, title, id, type, rating}) => {
    return (
        <a href={`/titles/${id}`} className="card-link" style={{ textDecoration: 'none' }}>
            <div className="card card-hover" data-bs-theme="dark">
                <img
                    src={poster}
                    className="card-img-top"
                    alt={title}
                    style={{ objectFit: 'cover', height: '400px' }} // Adjust the height as needed
                />
                <div className="card-body d-flex flex-column"> {/* Use flex-column to stack content vertically */}
                    <div style={{ height: '60px' }}> {/* Set a fixed height for the card body */}
                        <p className="card-text overflow-hidden text-truncate">
                            {title}
                        </p>
                    </div>
                    <div className="mt-auto"> {/* mt-auto pushes the badges to the bottom */}
                        <div className="d-flex justify-content-between">
                            <span className="badge bg-secondary">{type}</span>
                            <div>
                                <span style={{ marginLeft: '5px' }} className="badge bg-secondary">{rating} ⭐</span> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default Card;
