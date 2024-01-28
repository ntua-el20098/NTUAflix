import 'bootstrap/dist/css/bootstrap.min.css';

const Card = ({ image, name, id, type }) => {
    return (
        <a href={`/people/${id}`} className="card-link" style={{ textDecoration: 'none' }}>
            <div className="card card-hover" data-bs-theme="dark">
                <img
                    src={image}
                    className="card-img-top"
                    alt={name}
                    style={{ objectFit: 'cover', height: '400px' }}
                />
                <div className="card-body d-flex flex-column">
                    <div style={{ height: '60px' }}>
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
