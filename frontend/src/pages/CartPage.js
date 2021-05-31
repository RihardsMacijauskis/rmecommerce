import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import MessageScreen from '../components/MessageScreen';

export default function CartPage(props) {
    const productId = props.match.params.id;
    const qty = props.location.search ? Number(props.location.search.split('=')[1]) : 1;
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const dispatch = useDispatch();
    useEffect(() => {
        if(productId) {
            dispatch(addToCart(productId, qty));
        }  
    }, [dispatch, productId, qty]);
    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () =>{
        props.history.push('/signin?redirect=shipping');
    }
    return (
        <div className="row">
            <div className="col-2">
                <h1>Iepirkumu grozs</h1>
                {cartItems.length === 0?
                <MessageScreen>
                    Iepirkumu grozs ir tukšs. <Link to="/"> Doties uz sākumlapu</Link>
                </MessageScreen>
                :
                (
                   <ul>
                       {cartItems.map((item) =>(
                           <li key={item.product}>
                               <div className="cart-row">
                                   <div>
                                       <img src={item.image} alt={item.name} className="small"></img>
                                   </div>
                                    <div className="min-300">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>
                                    <div>{item.qty}</div>
                                    <div>€{item.price}</div>
                                    <div>
                                        <button type="button" className="delete" onClick={() => removeFromCartHandler(item.product)}>
                                            Izņemt preci no iepirkumu groza
                                        </button>
                                    </div>
                               </div>
                           </li>
                       ))}
                   </ul>
                )}
                <hr/>
                <br/>
                <div className="checkout-row">
                    <h2>
                        Kopā apmaksai ({cartItems.reduce((a, c) => a + c.qty, 0)} preces) : 
                        €{cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
                    </h2>
                    <button type="button" onClick={checkoutHandler} className="add-to-cart" disabled={cartItems.length === 0}>
                        Turpināt uz apmaksu
                    </button>
                </div>
            </div>
        </div>
    )
}
