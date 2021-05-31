import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';
import Product from '../components/Product';

export default function SearchPage(props) {
  const { name = 'all',
          category = 'all', 
          order = 'newest' 
        } = useParams();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  useEffect(() => {
    dispatch(
      listProducts({
        name: name !== 'all' ? name : '',
        category: category !== 'all' ? category : '',
        order,
      })
    );
  }, [category, dispatch, name, order]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const sortOrder = filter.order || order;
    return `/search/category/${filterCategory}/name/${filterName}/order/${sortOrder}`;
  };
  return (
    <div>
      <div className="row">
        {loading ? (
          <LoadingScreen></LoadingScreen>
        ) : error ? (
          <MessageScreen variant="danger">{error}</MessageScreen>
        ) : (
          <div>Atrastas <b>{products.length}</b> preces, izmantojot meklēšanas filtru</div>
        )}
          <div>
          Kārtot pēc {' '}
          <select
            value={order}
            onChange={(e) => {
              props.history.push(getFilterUrl({ order: e.target.value }));
            }}
          >
            <option value="newest">Jaunākās preces</option>
            <option value="lowest">Cena: No zemākās uz augstāko</option>
            <option value="highest">Cena: No augstākās uz zemāko</option>
            <option value="toprated">Pircēju novērtējums</option>
          </select>
        </div>
      </div>
      <div className="products">

        <div className="col-3">
          {loading ? (
            <LoadingScreen></LoadingScreen>
          ) : error ? (
            <MessageScreen variant="danger">{error}</MessageScreen>
          ) : (
            <>
              {products.length === 0 && (
                <MessageScreen>Nav atrasta neviena prece</MessageScreen>
              )}
              <div className="row center">
                {products.map((product) => (
                  <Product key={product._id} product={product}></Product>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}