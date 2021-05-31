import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';


export default function ShippingPage(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  if (!userInfo) {
    props.history.push('/signin');
  }
  const [fullName, setFullName] = useState(shippingAddress.fullName);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalcode, setPostalCode] = useState(shippingAddress.postalcode);
  const [phonenumber, setPhoneNumber] = useState(shippingAddress.phonenumber);
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({ fullName, address, city, postalcode, phonenumber })
    );
    props.history.push('/payment');
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Piegādes adrese</h1>
        </div>
        <div>
          <label htmlFor="fullName">Vārds, uzvārds</label>
          <input
            type="text"
            id="fullName"
            placeholder="Ievadiet vārdu, uzvārdu"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="address">Adrese</label>
          <input
            type="text"
            id="address"
            placeholder="Ievadiet adresi"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="city">Pilsēta/Ciems</label>
          <input
            type="text"
            id="city"
            placeholder="Ievadiet pilsētu/ciemu"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="postalCode">Pasta indekss</label>
          <input
            type="text"
            id="postalCode"
            placeholder="Ievadiet pasta indeksu"
            value={postalcode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="phoneNumber">Telefona numurs</label>
          <input
            type="text"
            id="phoneNumber"
            placeholder="Ievadiet telefona numuru"
            value={phonenumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label />
          <button className="primary add-to-cart" type="submit">
            Turpināt
          </button>
        </div>
      </form>
    </div>
  );
}