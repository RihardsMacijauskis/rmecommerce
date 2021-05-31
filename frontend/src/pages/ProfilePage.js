import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;
    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile;
    const dispatch = useDispatch();
    useEffect(() => {
        if (!user) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
            dispatch(detailsUser(userInfo._id));
          } else {
            setName(user.name);
            setEmail(user.email);
          }
        }, [dispatch, userInfo._id, user]);
    const submitHandler = (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        alert('Parole un paroles apstiprinājums nesakrīt!');
      } else {
        dispatch(updateUserProfile({ userId: user._id, name, email, password }));
      }
    };
    return (
      <div>
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>Lietotāja profils</h1>
          </div>
          {loading ? (
            <LoadingScreen></LoadingScreen>
          ) : error ? (
            <MessageScreen variant="danger">{error}</MessageScreen>
          ) : (
            <>
            {loadingUpdate && <LoadingScreen></LoadingScreen>}
            {errorUpdate && (
              <MessageScreen variant="danger">{errorUpdate}</MessageScreen>
            )}
            {successUpdate && (
              <MessageScreen variant="success">
                Lietotājs veiksmīgi saglabāts
              </MessageScreen>
            )}
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
                <label htmlFor="password">Parole</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Ievadiet paroli"
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </div>
              <div>
                <label htmlFor="confirmPassword">Apstipriniet paroli</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Apstipriniet paroli"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></input>
              </div>
              <div>
                <label />
                <button className="primary add-to-cart" type="submit">
                  Saglabāt
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    );
  }