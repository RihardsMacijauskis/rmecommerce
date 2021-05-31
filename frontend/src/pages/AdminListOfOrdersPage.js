import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder, listOrders } from '../actions/orderActions';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';


export default function OrderListScreen(props) {
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const orderDelete = useSelector((state) => state.orderDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });
    dispatch(listOrders());
  }, [dispatch, successDelete]);
  const deleteHandler = (order) => {
    if (window.confirm('Vai vēlaties atcelt pasūtījumu?')) {
      dispatch(deleteOrder(order._id));
    }
  };
  return (
    <div>
      <h1>Visi pasūtījumi</h1>
      {loadingDelete && <LoadingScreen></LoadingScreen>}
      {errorDelete && <MessageScreen variant="danger">{errorDelete}</MessageScreen>}
      {loading ? (
        <LoadingScreen></LoadingScreen>
      ) : error ? (
        <MessageScreen variant="danger">{error}</MessageScreen>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th className="break">Lietotājs</th>
              <th className="break">Datums</th>
              <th className="break">Summa</th>
              <th className="break">Samaksāts?</th>
              <th className="break">Piegādāts?</th>
              <th>Darbības</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="break">{order._id}</td>
                <td className="break">{order.user.name}</td>
                <td className="break">{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Nē'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'Nē'}
                </td>
                <td>
                  <button
                    type="button"
                    className="small view-button"
                    onClick={() => {
                      props.history.push(`/orderpayment/${order._id}`);
                    }}
                  >
                    Apskatīt
                  </button>
                  <button
                    type="button"
                    className="small delete"
                    onClick={() => deleteHandler(order)}
                  >
                    Dzēst
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}