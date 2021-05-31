import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { detailsProduct, updateProduct } from '../actions/productActions';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

export default function ProductEditPage(props) {
  const productId = props.match.params.id;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');

  const productDetails = useSelector((state) => state.productDetails);
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const { loading, error, product } = productDetails;
  const dispatch = useDispatch();
  useEffect(() => {
    if (successUpdate) {
        props.history.push('/productlist');
      }
      if (!product || product._id !== productId || successUpdate) {
        dispatch({ type: PRODUCT_UPDATE_RESET });      
        dispatch(detailsProduct(productId));
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setBrand(product.brand);
      setDescription(product.description);
    }
}, [product, dispatch, productId, successUpdate, props.history]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
        updateProduct({
          _id: productId,
          name,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
        })
      );
  };
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState('');

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post('/api/uploads', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setImage(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Rediģēt preci nr. {productId}</h1>
        </div>
        {loadingUpdate && <LoadingScreen></LoadingScreen>}
        {errorUpdate && <MessageScreen variant="danger">{errorUpdate}</MessageScreen>}
        {loading ? (
          <LoadingScreen></LoadingScreen>
        ) : error ? (
          <MessageScreen variant="danger">{error}</MessageScreen>
        ) : (
          <>
            <div>
              <label htmlFor="name">Nosaukums</label>
              <input
                id="name"
                type="text"
                placeholder="Ievadiet nosaukumu"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="price">Cena</label>
              <input
                id="price"
                type="text"
                placeholder="Ievadiet cenu"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="image">Attēls</label>
              <input
                id="image"
                type="text"
                placeholder="Ievietojiet attēlu"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled
              ></input>
            </div>
            <div>
              <label htmlFor="imageFile">Ievietojiet attēlu</label>
              <input
                type="file"
                id="imageFile"
                label="Ievietojiet attēlu"
                onChange={uploadFileHandler}
              ></input>
              {loadingUpload && <LoadingScreen></LoadingScreen>}
              {errorUpload && (
                <MessageScreen variant="danger">{errorUpload}</MessageScreen>
              )}
            </div>
            <div>
              <label htmlFor="category">Preces kategorija</label>
              <input
                id="category"
                type="text"
                placeholder="Ievadiet kategoriju"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="brand">Ražotājs</label>
              <input
                id="brand"
                type="text"
                placeholder="Ievadiet ražotāju"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="countInStock">Skaits noliktavā</label>
              <input
                id="countInStock"
                type="text"
                placeholder="Ievadiet skaitu noliktavā"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="description">Preces apraksts</label>
              <textarea
                id="description"
                rows="3"
                type="text"
                placeholder="Ievadiet aprakstu"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label></label>
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
