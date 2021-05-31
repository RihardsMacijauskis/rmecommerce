import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUser } from '../actions/userActions';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';
import { USER_UPDATE_RESET } from '../constants/userConstants';

export default function UserEditScreen(props) {
  const userId = props.match.params.id;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      props.history.push('/userlist');
    }
    if (!user) {
      dispatch(detailsUser(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, props.history, successUpdate, user, userId]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Rediģēt lietotāju {name}</h1>
          {loadingUpdate && <LoadingScreen></LoadingScreen>}
          {errorUpdate && (
            <MessageScreen variant="danger">{errorUpdate}</MessageScreen>
          )}
        </div>
        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <MessageScreen variant="danger">{error}</MessageScreen>
        ) : (
          <>
            <div>
              <label htmlFor="name">Vārds</label>
              <input
                id="name"
                type="text"
                placeholder="Ievadiet vārdu"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="email">E-pasts</label>
              <input
                id="email"
                type="email"
                placeholder="Ievadiet e-pastu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="isAdmin">Darbinieks?</label>
              <input
                id="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></input>
            </div>
            <div>
              <button type="submit" className="primary add-to-cart">
                Atjaunot
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}