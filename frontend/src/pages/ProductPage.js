import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createReview, detailsProduct } from '../actions/productActions';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';
import Rating from '../components/Rating';
import Review from '../components/Review';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';


export default function ProductPage(props) {
   const dispatch = useDispatch();
   const productId = props.match.params.id;
   const [qty, setQty] = useState(1);
   const productDetails = useSelector(state => state.productDetails);
   const { loading, error, product } = productDetails;
   const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productReviewCreate;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

   useEffect(() => {
    if (successReviewCreate) {
        window.alert('Atsauksme veiksmīgi pievienota');
        setRating('');
        setComment('');
        dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
      }
    dispatch(detailsProduct(productId));
}, [dispatch, productId, successReviewCreate]);

   const addToCartHandler = () => {
       props.history.push(`/cart/${productId}?qty=${qty}`);
   };

   const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(
        createReview(productId, { rating, comment, name: userInfo.name })
      );
    } else {
      alert('Norādiet vērtējumu un komentāru');
    }
  };

    return (
        <div>
        {loading  ? (
          <LoadingScreen></LoadingScreen>
          ) : error ? (
          <MessageScreen>{error}</MessageScreen>
          ) : (
            <div>
            <div className="row">
                <div className="col-1">
                    <h2>{product.name}</h2>
                    <img src={product.image} alt={product.name} className="productpage-img"></img>
                    <h3>€{product.price}</h3>
                    <Rating className="product"
                    rating={product.rating}
                    numReviews={product.numReviews}
                    ></Rating>
                    <br/>
                    <h3>Preces apraksts:</h3> 
                  <p className="center">{product.description}</p>
                </div>
                <div className="col-1">
                    <div className="card">
                        Pieejamība:
                        <span>{product.countInStock > 0 ? (
                            <span className="in-stock"> Vēl ir noliktavā</span>
                        ) : (
                            <span className="not-in-stock"> Prece nav noliktavā</span>
                        )
                        }</span>
                        {product.countInStock > 0 && (
                                <>
                                <div className="row">
                                    <div>Daudzums:</div>
                                    <div>
                                        <select
                                        className="qty"
                                         value={qty} 
                                         onChange={e => setQty(e.target.value)}>
                                            {
                                                [...Array(product.countInStock).keys()].map(x => (
                                                    <option key={x+1} value={x+1}>{x+1}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <button onClick={addToCartHandler} className="add-to-cart">Pievienot grozam</button>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
            <div>
            <h2 id="reviews">Atsauksmes</h2>
            {product.reviews.length === 0 && (
              <MessageScreen>Vēl nav izveidota neviena atsauksme</MessageScreen>
            )}
            <ul>
              {product.reviews.map((review) => (
                <li key={review._id}>
                  <strong>{review.name}</strong>
                  <Review rating={review.rating}></Review>
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </li>
              ))}
              <li>
                {userInfo ? (
                  <form className="form" onSubmit={submitHandler}>
                    <div>
                      <h3>Uzrakstiet atsauksmi par preci</h3>
                    </div>
                    <div>
                      <label htmlFor="rating">Vērtējums</label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Izvēlēties</option>
                        <option value="1">1- Slikti</option>
                        <option value="2">2- Apmierinoši</option>
                        <option value="3">3- Labi</option>
                        <option value="4">4- Ļoti labi</option>
                        <option value="5">5- Izcili</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment">Komentārs</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label />
                      <button className="primary add-to-cart" type="submit">
                        Iesniegt atsauksmi
                      </button>
                    </div>
                    <div>
                      {loadingReviewCreate && <LoadingScreen></LoadingScreen>}
                      {errorReviewCreate && (
                        <MessageScreen variant="danger">
                          {errorReviewCreate}
                        </MessageScreen>
                      )}
                    </div>
                  </form>
                ) : (
                  <MessageScreen>
                    Lūdzu <Link to="/signin"><b>pierakstieties</b></Link>, lai iesniegtu atsauksmi
                  </MessageScreen>
                )}
              </li>
            </ul>
          </div>
        </div>
          )}
        </div>      


    );
}

