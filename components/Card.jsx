import 'bootstrap/scss/bootstrap.scss';

const Card = ({ poster, title, id }) => {
    return (
        <a href={`/titles/${id}`} className="card-link" style={{ textDecoration: 'none' }}>
            <div className="card card-hover" data-bs-theme="dark">
                <img src={poster} className="card-img-top" alt={title} />
                <div className="card-body">
                    <p className="card-text">
                        {title} 
                    </p>
                    <span className="badge bg-secondary float-end">Genre</span>
                    <span className="badge bg-secondary float-end" style={{ marginRight: '5px' }}>Rating</span>
                    <span className="badge bg-secondary float-start" style={{ marginRight: '5px' }}>Movie/TVS</span>
                </div>
            </div>
        </a>
    );
};

export default Card;