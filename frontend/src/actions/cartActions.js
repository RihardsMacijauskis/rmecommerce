import Axios from 'axios';
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD
  } from '../constants/cartConstants';

export const addToCart = (productId, qty) => async(dispatch, getState) =>{
    const {data} = await Axios.get(`/api/products/${productId}`); //AJAX vaicājums serverim - saņemt informāciju par preci
    //informācijas nosūtīšana uz Redux paneli (nosaukums, bilde, cena, pieejamība, id, daudzums)
    dispatch({
        type: CART_ADD_ITEM,
        payload:{
            name:data.name,
            image:data.image,
            price:data.price,
            countInStock: data.countInStock,
            product: data._id,
            qty,
        },
    });
    //Saglabāt iepirkumu groza saturu pēc lapas pārlādes
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
};


    //Noņemt preces no iepirkumu groza
export const removeFromCart = (productId) => (dispatch,getState) =>{
    dispatch({type: CART_REMOVE_ITEM, payload: productId}); //ziņojuma nosūtīšana uz Redux paneli
    localStorage.setItem('setItems', JSON.stringify(getState().cart.cartItems));
};

    //Saglabāt piegādes adresi pēc lapas pārlādes
export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data }); //ziņojuma nosūtīšana uz Redux paneli
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  //Saglabāt izvēlēto apmaksas veidu pēc lapas pārlādes
export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data }); //ziņojuma nosūtīšana uz Redux paneli
  };