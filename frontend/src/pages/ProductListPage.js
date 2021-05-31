import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProduct,
  deleteProduct,
  listProducts,
} from '../actions/productActions';
import LoadingScreen from '../components/LoadingScreen';
import MessageScreen from '../components/MessageScreen';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../constants/productConstants';

export default function ProductListScreen(props) {
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      props.history.push(`/product/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(listProducts({}));
  }, [createdProduct, dispatch, props.history, successCreate, successDelete]);

  const deleteHandler = (product) => {
    if (window.confirm('Vai dzēst preci?')) {
      dispatch(deleteProduct(product._id));
    }
  };
  const createHandler = () => {
    dispatch(createProduct());
  };
  return (
    <div>
      <div className="row">
        <h1>Preces</h1>
        <button type="button" className="primary add-to-cart" onClick={createHandler}>
          Izveidot preci
        </button>
      </div>

      {loadingDelete && <LoadingScreen></LoadingScreen>}
      {errorDelete && <MessageScreen variant="danger">{errorDelete}</MessageScreen>}

      {loadingCreate && <LoadingScreen></LoadingScreen>}
      {errorCreate && <MessageScreen variant="danger">{errorCreate}</MessageScreen>}
      {loading ? (
        <LoadingScreen></LoadingScreen>
      ) : error ? (
        <MessageScreen variant="danger">{error}</MessageScreen>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th className="break">Nosaukums</th>
              <th>Cena</th>
              <th className="break">Kategorija</th>
              <th className="break">Ražotājs</th>
              <th>Darbības</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="break">{product._id}</td>
                <td>{product.name}</td>
                <td>€{product.price}</td>
                <td className="break">{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <button
                    type="button"
                    className="small view-button"
                    onClick={() =>
                      props.history.push(`/product/${product._id}/edit`)
                    }
                  >
                    Rediģēt
                  </button>
                  <button
                    type="button"
                    className="small delete"
                    onClick={() => deleteHandler(product)}
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