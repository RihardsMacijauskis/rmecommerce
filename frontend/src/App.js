import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import { useDispatch, useSelector } from 'react-redux';
import AdminRoute from './components/AdminRoute';
import SignInPage from './pages/SignInPage';
import { signout } from './actions/userActions';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import OrderPage from './pages/OrderPage';
import OrderPayment from './pages/OrderPayment';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import ProductListPage from './pages/ProductListPage';
import ProductEditPage from './pages/ProductEditPage';
import AdminListOfOrdersPage from './pages/AdminListOfOrdersPage';
import AdminListOfUsersPage from './pages/AdminListOfUsersPage';
import AdminListOfUsersEditPage from './pages/AdminListOfUsersEditPage';
import SearchScreen from './components/SearchScreen';
import SearchPage from './pages/SearchPage';
import { listProductCategories } from './actions/productActions';
import LoadingScreen from './components/LoadingScreen';
import MessageScreen from './components/MessageScreen';
import PrivateRoute from './components/PrivateRoute';

//React App (jeb "aplikācija") - galvenais fails, kas ietver sevī visas mājaslapas datnes un komponentes - uz tā bāzējas saskarnes darbība
function App() {
  const cart = useSelector((state) => state.cart);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);
  return (
    <BrowserRouter>
    <div className="grid-container">
    <header className="header">
    <button
              type="button"
              className="open-sidebar"
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>
        <div className="brandName">
          <Link to="/"><img src="/images/logo.png" alt="logo"/></Link>
        </div>    
        <div className="headerlinks">
            <Link to="/cart">
              Grozs
              {cartItems.length > 0 && (
                <span className="cartbadge"></span>
              )}
            </Link>
            {
              userInfo ? (
              <div className="dropdown">
                <Link to="#">
                  {userInfo.name} <i className="fa fa-caret-down"></i>{' '}
                </Link>
                <ul className="dropdown-content right">
                  <li>
                    <Link to="/profile">Lietotāja profils</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Pasūtījumu vēsture</Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>Iziet</Link>
                  </li>
                </ul>
              </div>
              ) : (
                <Link to="/signin">Pieslēgties</Link>
              )}    
              {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <Link to="#admin">
                  Darbinieks <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content right">
                  <li>
                    <Link to="/productlist">Preču saraksts</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Pasūtījumu saraksts</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Lietotāju saraksts</Link>
                  </li>
                </ul>
              </div>
            )} 
        </div>
  </header>
  <aside className={sidebarIsOpen ? 'open' : ''}>
          <ul className="categories">
            <li className="sidebar-top">
              <h2>Kategorijas</h2>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
                <i className="fa fa-close"></i>
              </button>
            </li>
            {loadingCategories ? (
              <LoadingScreen></LoadingScreen>
            ) : errorCategories ? (
              <MessageScreen variant="danger">{errorCategories}</MessageScreen>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
          <div>
            <Route
              render={({ history }) => (
                <SearchScreen history={history}></SearchScreen>
              )}
            ></Route>
        </div>
        </aside>   
  <main>
    <Route path="/cart/:id?" component={CartPage}></Route>
    <Route path="/product/:id" component={ProductPage} exact></Route>
    <Route path="/product/:id/edit" component={ProductEditPage} exact></Route>
    <Route path="/signin" component={SignInPage}></Route>
    <Route path="/register" component={RegisterPage}></Route>
    <Route path="/shipping" component={ShippingPage}></Route>
    <Route path="/payment" component={PaymentPage}></Route>
    <Route path="/ordersummary" component={OrderPage}></Route>
    <Route path="/orderpayment/:id" component={OrderPayment}></Route>
    <Route path="/orderhistory" component={OrderHistoryPage}></Route>
    <Route
      path="/search/name/:name?"
      component={SearchPage}
      exact
    ></Route>
    <Route
      path="/search/category/:category"
      component={SearchPage}
      exact
    ></Route>
    <Route
      path="/search/category/:category/name/:name/order/:order"
      component={SearchPage}
      exact
    ></Route>
    <PrivateRoute
      path="/profile"
      component={ProfilePage}
    ></PrivateRoute>
    <AdminRoute
      path="/productlist"
      component={ProductListPage}
    ></AdminRoute>
    <AdminRoute
      path="/orderlist"
      component={AdminListOfOrdersPage}
    ></AdminRoute>
    <AdminRoute path="/userlist" component={AdminListOfUsersPage}></AdminRoute>
    <AdminRoute
            path="/user/:id/edit"
            component={AdminListOfUsersEditPage}
          ></AdminRoute>
    <Route path="/" component={HomePage} exact></Route>

  </main>
  <footer className="footer">Copyright &copy; Rihards Macijauskis.</footer>
  </div>   
  </BrowserRouter>
  );
}

export default App;
