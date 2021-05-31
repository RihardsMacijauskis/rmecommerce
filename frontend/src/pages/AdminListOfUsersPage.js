import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, listUsers } from '../actions/userActions';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';
import { USER_DETAILS_RESET } from '../constants/userConstants';

export default function UserListScreen(props) {
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = userDelete;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listUsers());
    dispatch({
      type: USER_DETAILS_RESET,
    });
  }, [dispatch, successDelete]);
  const deleteHandler = (user) => {
    if (window.confirm('Vai esat pārliecināts?')) {
      dispatch(deleteUser(user._id));
    }
  };
  return (
    <div>
      <h1>Visi lietotāji</h1>
      {loadingDelete && <LoadingScreen></LoadingScreen>}
      {errorDelete && <MessageScreen variant="danger">{errorDelete}</MessageScreen>}
      {successDelete && (
        <MessageScreen variant="success">Lietotājs izdzēsts</MessageScreen>
      )}
      {loading ? (
        <LoadingScreen></LoadingScreen>
      ) : error ? (
        <MessageScreen variant="danger">{error}</MessageScreen>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vārds</th>
              <th>E-pasts</th>
              <th>Darbinieks</th>
              <th>Darbības</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="break">{user._id}</td>
                <td>{user.name}</td>
                <td className="break">{user.email}</td>
                <td>{user.isAdmin ? 'Jā' : 'Nē'}</td>
                <td>
                  <button
                    type="button"
                    className="small view-button"
                    onClick={() => props.history.push(`/user/${user._id}/edit`)}
                  >
                    Rediģēt
                  </button>
                  <button
                    type="button"
                    className="small delete"
                    onClick={() => deleteHandler(user)}
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