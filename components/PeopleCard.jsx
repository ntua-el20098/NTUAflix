import 'bootstrap/dist/css/bootstrap.min.css';

const Card = ({ image, name, id, type }) => {
    return (
        <a href={`/people/${id}`} className="card-link" style={{ textDecoration: 'none', width: '240px', height: '360px' }}>
            <div className="card card-hover" style={{ width: '100%', height: '100%' }} data-bs-theme="dark">
                <img
                    src={image}
                    className="card-img-top"
                    alt={name}
                    style={{ width: '100%', height: '70%', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column" style={{ height: '30%' }}>
                    <div style={{ height: '100%' }}>
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
