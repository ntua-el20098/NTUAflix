import 'bootstrap/scss/bootstrap.scss';

const Card = ({ image, name, id }) => {
    return (
        <a href={`/people/${id}`} className="card-link" style={{ textDecoration: 'none' }}>
            <div className="card card-hover" data-bs-theme="dark">
                <img src={image} className="card-img-top" alt={name} />
                <div className="card-body">
                    <p className="card-text">
                        {name} 
                    </p>
                </div>
            </div>
        </a>
    );
};

export default Card;