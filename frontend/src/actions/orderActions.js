import Axios from 'axios';
import { CART_EMPTY } from '../constants/cartConstants';
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_PAY_REQUEST,
  ORDER_PAY_FAIL,
  ORDER_PAY_SUCCESS,
  ORDER_MINE_LIST_REQUEST,
  ORDER_MINE_LIST_FAIL,
  ORDER_MINE_LIST_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS,
  ORDER_DELETE_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
} from '../constants/orderConstants';

//Jauna pasūtījuma veikšana
export const createOrder = (order) => async (dispatch, getState) => {
  dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await Axios.post('/api/orders', order, { //AJAX vaicājums serverim - nosūtīt informāciju par pasūtījumu
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    //Kad pasūtījums tiek veiksmīgi noformēts, izvada datus uz paziņojumu Redux panelī un iztukšo iepirkuma grozu.
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
    dispatch({ type: CART_EMPTY });
    localStorage.removeItem('cartItems');
  } catch (error) {
    //Neveiksmīgas pasūtījuma veikšanas gadījumā izvadīt kļūdas ziņojumu Redux panelī un apturēt pasūtījuma veikšanu
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//Detalizēta pasūtījumu apskate
export const detailsOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/orders/${orderId}`, { //AJAX vaicājums serverim - saņemt informāciju par pasūtījumu
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    //Neveiksmīga pasūtījuma detaļu izvades gadījumā izvadīt kļūdas ziņojumu Redux panelī un apturēt pasūtījuma veikšanu
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
  }
};

//Pasūtījuma apmaksa
export const payOrder = (order, paymentResult) => async (
  dispatch,
  getState
) => {
  dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.put(`/api/orders/${order._id}/pay`, paymentResult, { //AJAX vaicājums serverim - nosūtīt informāciju par pasūtījuma apmaksu
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
  } catch (error) {
    //Neveiksmīga pasūtījuma apmaksas gadījumā izvadīt kļūdas ziņojumu Redux panelī un apturēt pasūtījuma veikšanu
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_PAY_FAIL, payload: message });
  }
};

//Savu pasūtījumu saraksta izvade
export const listOrderMine = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_MINE_LIST_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get('/api/orders/mine', { //AJAX vaicājums serverim - saņemt informāciju par saviem pasūtījumiem
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: ORDER_MINE_LIST_SUCCESS, payload: data });
  } catch (error) {
    //Neveiksmīga pasūtījumu izvades gadījumā izvadīt kļūdas ziņojumu Redux panelī un apturēt pasūtījuma veikšanu
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_MINE_LIST_FAIL, payload: message });
  }
};

//Visu pasūtījumu saraksta izvade
export const listOrders = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_LIST_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get('/api/orders', { //AJAX vaicājums serverim - saņemt informāciju par visiem pasūtījumiem
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    console.log(data); //saraksta izvade pārlūka konsolē
    dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
  } catch (error) {
    //Neveiksmīga pasūtījumu izvades gadījumā izvadīt kļūdas ziņojumu Redux panelī un apturēt pasūtījuma veikšanu
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_LIST_FAIL, payload: message });
  }
};

//Pasūtījuma dzēšana
export const deleteOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DELETE_REQUEST, payload: orderId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.delete(`/api/orders/${orderId}`, { //AJAX vaicājums serverim - dzēst pasūtījumu
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_DELETE_SUCCESS, payload: data });
  } catch (error) {
    //Neveiksmīga pasūtījuma dzēšanas gadījumā izvadīt kļūdas ziņojumu Redux panelī un apturēt pasūtījuma veikšanu
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_DELETE_FAIL, payload: message });
  }
};

//Pasūtījuma piegādes statusa maiņa
export const deliverOrder = (orderId) => async (dispatch, getState) => {
  dispatch({ type: ORDER_DELIVER_REQUEST, payload: orderId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = Axios.put(
      `/api/orders/${orderId}/deliver`, //AJAX vaicājums serverim - pasūtījuma statusa maiņa
      {},
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
  } catch (error) {
      //Neveiksmīga pasūtījuma piegādes statusa maiņas gadījumā izvadīt kļūdas ziņojumu Redux panelī un apturēt pasūtījuma veikšanu
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: ORDER_DELIVER_FAIL, payload: message });
  }
};