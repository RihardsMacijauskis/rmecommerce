import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';

export default function OrderScreen(props) {
  const orderId = props.match.params.id;
  const [sdkReady, setSdkReady] = useState(false);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const {
    loading: loadingDeliver,
    error: errorDeliver,
    success: successDeliver,
  } = orderDeliver;
  const dispatch = useDispatch();
  useEffect(() => {
    const addPayPalScript = async () => {
    const { data } = await Axios.get('/api/config/paypal');
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };
  if (
    !order ||
    successPay ||
    successDeliver ||
    (order && order._id !== orderId)
  ) {
    dispatch({ type: ORDER_PAY_RESET });
    dispatch({ type: ORDER_DELIVER_RESET });
    dispatch(detailsOrder(orderId));
  } else {
    if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }
}, [dispatch, orderId, sdkReady, successPay, successDeliver, order]);

const successPaymentHandler = (paymentResult) => {
  dispatch(payOrder(order, paymentResult));
};

const deliverHandler = () => {
  dispatch(deliverOrder(order._id));
};

  return loading ? (
    <LoadingScreen></LoadingScreen>
  ) : error ? (
    <MessageScreen variant="danger">{error}</MessageScreen>
  ) : (
    <div>
      <h1>Pasūtījums nr. {order._id}</h1>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Piegāde</h2>
                <p>
                  <strong>Vārds:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Adrese: </strong> {order.shippingAddress.address},
                  {' '}{order.shippingAddress.city},{' '}
                  {order.shippingAddress.postalcode},
                   +371 {order.shippingAddress.phonenumber}
                </p>
                {order.isDelivered ? (
                  <MessageScreen variant="success">
                    Piegādāts {order.deliveredAt}
                  </MessageScreen>
                ) : (
                  <MessageScreen variant="danger">Nav piegādāts</MessageScreen>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Maksājums</h2>
                <p>
                  <strong>Maksājuma veids:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <MessageScreen variant="success">
                    Samaksāts {order.paidAt}
                  </MessageScreen>
                ) : (
                  <MessageScreen variant="danger">Nav apmaksāts</MessageScreen>
                )}
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Pasūtītās preces</h2>
                <ul>
                  {order.orderItems.map((item) => (
                    <li key={item.product}>
                      <div className="row">
                        <div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="small"
                          ></img>
                        </div>
                        <div className="min-300">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>

                        <div>
                          {item.qty} x ${item.price} = €{item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-1">
          <div className="card card-body">
            <ul>
              <li>
                <h2>Pasūtījuma kopsavilkums</h2>
              </li>
              <li>
                <div className="row">
                  <div>Preču summa</div>
                  <div>€{order.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Piegādes maksa</div>
                  <div>€{order.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>PVN (21%)</div>
                  <div>€{order.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Pasūtījuma kopsumma</strong>
                  </div>
                  <div>
                    <strong>€{order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              {!order.isPaid && (
                <li>
                  {!sdkReady ? (
                    <LoadingScreen></LoadingScreen>
                  ) : (
                    <>
                    {errorPay && (
                      <MessageScreen variant="danger">{errorPay}</MessageScreen>
                    )}
                    {loadingPay && <LoadingScreen></LoadingScreen>}

                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    ></PayPalButton>
                  </>
                  )}
                </li>
              )}
              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <li>
                  {loadingDeliver && <LoadingScreen></LoadingScreen>}
                  {errorDeliver && (
                    <MessageScreen variant="danger">{errorDeliver}</MessageScreen>
                  )}
                  <button
                    type="button"
                    className="primary block add-to-cart"
                    onClick={deliverHandler}
                  >
                    Piegādāt pasūtījumu
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}