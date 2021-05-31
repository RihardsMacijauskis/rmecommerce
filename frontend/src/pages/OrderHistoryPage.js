import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listOrderMine } from '../actions/orderActions';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';

export default function OrderHistoryPage(props) {
  const orderMineList = useSelector((state) => state.orderMineList);
  const { loading, error, orders } = orderMineList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listOrderMine());
  }, [dispatch]);
  return (
    <div>
      <h1>Pasūtījumu vēsture</h1>
      {loading ? (
        <LoadingScreen></LoadingScreen>
      ) : error ? (
        <MessageScreen variant="danger">{error}</MessageScreen>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Datums</th>
              <th className="break">Pasūtījuma summa</th>
              <th className="break">Samaksāts?</th>
              <th className="break">Piegādāts?</th>
              <th>Darbības</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="break">{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}