import React from 'react';
import './Card.css'

function Card({ title, description, imageUrl, color }) {
  return (
    <div className="card homeCard">
      <img src={imageUrl} alt="Card" className="card-images img-fluid" />
      <div className="card-contents" >
        <h2 className="card-titles" style={{color:color}}>{title}</h2>
        <p className="card-descriptions">{description}</p>
      </div>
    </div>
  );
}

export default Card;
