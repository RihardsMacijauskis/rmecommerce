import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';

export default function OrderPage(props) {
  const cart = useSelector((state) => state.cart);
  if (!cart.paymentMethod) {
    props.history.push('/payment');
  }
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;
  const toPrice = (num) => Number(num.toFixed(2)); // 5.123 => "5.12" => 5.12
  cart.itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(4.99);
  cart.taxPrice = toPrice(0.21 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  const dispatch = useDispatch();
  const placeOrderHandler = () => {
    dispatch(createOrder({ ...cart, orderItems: cart.cartItems }));
  };
  useEffect(() => {
    if (success) {
      props.history.push(`/orderpayment/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, order, props.history, success]);
  return (
    <div>
      <div className="row top">
        <div className="col-2">
          <ul>
            <li>
              <div className="card card-body">
                <h2>Piegāde</h2>
                <p>
                  <strong>Vārds:</strong> {cart.shippingAddress.fullName} <br />
                  <strong>Adrese: </strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.city}, {cart.shippingAddress.postalcode}
                  ,{cart.shippingAddress.phonenumber}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Maksājums</h2>
                <p>
                  <strong>Maksājuma veids:</strong> {cart.paymentMethod}
                </p>
              </div>
            </li>
            <li>
              <div className="card card-body">
                <h2>Pasūtītās preces</h2>
                <ul>
                  {cart.cartItems.map((item) => (
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
                          {item.qty} x €{item.price} = €{item.qty * item.price}
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
                  <div>€{cart.itemsPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>Piegāde</div>
                  <div>€{cart.shippingPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>PVN (21%)</div>
                  <div>€{cart.taxPrice.toFixed(2)}</div>
                </div>
              </li>
              <li>
                <div className="row">
                  <div>
                    <strong> Pasūtījuma kopsumma</strong>
                  </div>
                  <div>
                    <strong>€{cart.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </li>
              <li className="orderPageButton">
                <button
                  type="button"
                  onClick={placeOrderHandler}
                  className="primary block add-to-cart"
                  disabled={cart.cartItems.length === 0}
                >
                  Turpināt uz apmaksu
                </button>
              </li>
              {loading && <LoadingScreen></LoadingScreen>}
              {error && <MessageScreen variant="danger">{error}</MessageScreen>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}