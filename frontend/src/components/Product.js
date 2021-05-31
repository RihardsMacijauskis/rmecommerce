import React from 'react';
import Rating from './Rating';
import { Link } from 'react-router-dom';

//Preces komponente (galvenās lapas preču sarakstam)
export default function Product(props){
    const { product } = props;
    return(
    //No datubāzes atgriež informāciju pēc preces ID (Attēls, nosaukums, cena, atsauksmes)
    <div key={product._id} className="product">
        <Link to={`/product/${product._id}`}>
            <img className="product-image" src={product.image} alt={product.name}/>
        </Link>
        <div className="product-name">
             <Link to={`/product/${product._id}`}>{product.name}</Link>
        </div>
        <div className="product-price">€ {product.price}</div>
        <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
    </div>
    )
}