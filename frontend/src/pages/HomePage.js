import React, { useEffect } from 'react';
import Product from '../components/Product';
import MessageScreen from '../components/MessageScreen';
import LoadingScreen from '../components/LoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

export default function HomePage() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList );
  const { loading, error, products } = productList;

  useEffect(() => { //pēc lapas ielādes, izpilda 
    dispatch(listProducts({}));
  }, []);
    return (
      <div>
        {loading  ? (
          <LoadingScreen></LoadingScreen>
          ) : error ? (
          <MessageScreen>{error}</MessageScreen>
          ) : (
        <div className="content"> 
        <h1>Visas preces</h1>    
        <div className="products">
          {products.map((product) => (
            <Product key={product._id} product={product}></Product>
          ))}
        </div>
        </div>
        )}

      </div>
    );
}
