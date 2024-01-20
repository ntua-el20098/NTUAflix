"use client";
import { useState, useEffect } from 'react';

function TitleList() {
  const [titleData, setTitleData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/samples/searchbyrating', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gqueryObject: {
              minrating: '0',
              maxrating: '10',
            },
          }),
        });

        const data = await response.json();
        setTitleData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {titleData.map((titleObject, index) => (
        <div key={index}>
          {titleObject.titleObject.message === 'No results found' ? (
            <p>{titleObject.titleObject.message}</p>
          ) : (
            <div>
              <p>Title ID: {titleObject.titleObject.titleID}</p>
              <p>Type: {titleObject.titleObject.type}</p>
              <p>Title: {titleObject.titleObject.originalTitle}</p>
              <img
                src={titleObject.titleObject.titlePoster.replace('{width_variable}', 'original')}
                alt={titleObject.titleObject.originalTitle}
                style={{ width: '100px', height: '150px' }}
              />
              {/* Add more details as needed */}
              <p>Genres:</p>
              <ul>
                {titleObject.titleObject.genres.map((genre, genreIndex) => (
                  <li key={genreIndex}>{genre.genreTitle}</li>
                ))}
              </ul>
              {/* Display other information */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TitleList;
