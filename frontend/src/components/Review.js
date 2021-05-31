import React from 'react';

//Preču atsauksmju izveides komponente
export default function Rating(props){
    const { rating, numReviews} = props;
    return (
        //Ar "font-awesome" ikonām attēlo preces atsauksmes 5 baļļu skalā (tiek attēlotas zvaigznīšu formā)
        <div className="rating">
            <span>
                <i className={
                    rating >= 1
                    ?"fa fa-star"
                    : rating >=0.5
                    ?"fa fa-star-half-o"
                    :"fa fa-star-o"}></i>
            </span>
            <span>
                <i className={
                    rating >= 2
                    ?"fa fa-star"
                    : rating >=1.5
                    ?"fa fa-star-half-o"
                    :"fa fa-star-o"}></i>
            </span>
            <span>
                <i className={
                    rating >= 3
                    ?"fa fa-star"
                    : rating >=2.5
                    ?"fa fa-star-half-o"
                    :"fa fa-star-o"}></i>
            </span>
            <span>
                <i className={
                    rating >= 4
                    ?"fa fa-star"
                    : rating >=3.5
                    ?"fa fa-star-half-o"
                    :"fa fa-star-o"}></i>
            </span>
            <span>
                <i className={
                    rating >= 5
                    ?"fa fa-star"
                    : rating >=4.5
                    ?"fa fa-star-half-o"
                    :"fa fa-star-o"}></i>
            </span>
        </div>

    )

}