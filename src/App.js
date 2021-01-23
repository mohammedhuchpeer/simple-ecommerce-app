import React, { Component, createRef } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import AddProduct from "./components/addProduct";
import Cart from "./components/cart";
import Login from "./components/login";
import ProductList from "./components/productList";

import Context from "./hoc/context";

export class App extends Component {
  state = {
    user: null,
    cart: {},
    products: [],
    showMenu: true,
  };

  componentDidMount() {
    axios
      .get("http://localhost:3001/products")
      .then((response) => {
        let user = localStorage.getItem("user");
        let cart = localStorage.getItem("cart");
        console.log(response.data, user, cart);
        user = user ? JSON.parse(user) : null;
        cart = cart ? JSON.parse(cart) : {};

        this.setState({ products: response.data, user, cart });
      })
      .catch((error) => console.log(error));
  }

  login = async (email, password) => {
    console.log(email, password);
    const res = await axios
      .post("http://localhost:3001/login", {
        email,
        password,
      })
      .catch((error) => {
        console.log(error);
        return {
          status: 401,
          message: "Unauthorized",
        };
      });

    if (res.status === 200) {
      const { email } = jwt_decode(res.data.accessToken);
      const user = {
        email,
        token: res.data.accessToken,
        accessLevel: email === "admin@example.com" ? 0 : 1,
      };
      this.setState({ user });
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  };

  addToCart = (cartItem) => {
    let cart = this.state.cart;
    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }
    if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
      cart[cartItem.id].amount = cart[cartItem.id].product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  removeFromCart = (cartItemId) => {
    let cart = this.state.cart;
    delete cart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(Cart));
    this.setState({ cart });
  };

  clearCart = () => {
    let cart = {};
    localStorage.removeItem("cart");
    this.setState({ cart });
  };

  logout = (e) => {
    e.preventDefault();
    this.setState({ user: null });
    localStorage.removeItem("user");
  };

  addProduct = (product, callback) => {
    let products = this.state.products.slice();
    products.push(product);
    this.setState({ products }, () => callback && callback());
  };

  checkout = () => {
    if (!this.state.user) {
      this.routerRef.current.history.push("/login");
      return;
    }

    const cart = this.state.cart;

    const products = this.state.products.map((p) => {
      if (cart[p.name]) {
        p.stock = p.stock - cart[p.name].amount;

        axios.put(`http://localhost:3001/products/${p.id}`, { ...p });
      }
      return p;
    });

    this.setState({ products });
    this.clearCart();
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          removeFromCart: this.removeFromCart,
          addToCart: this.addToCart,
          login: this.login,
          addProduct: this.addProduct,
          clearCart: this.clearCart,
          checkout: this.checkout,
        }}
      >
        <Router ref={createRef()}>
          <div className="App">
            <nav
              className="navbar container"
              role="navigation"
              aria-label="main navigation"
            >
              <div className="navbar-brand">
                <b className="navbar-item is-size-4">e-commerce</b>
                <label
                  role="button"
                  className="navbar-burger burger"
                  area-label="menu"
                  area-expanded="false"
                  data-target="navbarBasicExample"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState((prevState) => {
                      return {
                        showMenu: !prevState.showMenu,
                      };
                    });
                  }}
                >
                  <span area-hidden="true"></span>
                  <span area-hidden="true"></span>
                  <span area-hidden="true"></span>
                </label>
              </div>
              <div
                className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}
              >
                <Link to="/products" className="navbar-item">
                  Products
                </Link>
                {this.state.user && this.state.user.accessLevel < 1 && (
                  <Link to="/add-product" className="navbar-item">
                    Add Product
                  </Link>
                )}
                <Link to="/cart" className="navbar-item">
                  Cart
                  <span
                    className="tag is-primary"
                    style={{ marginLeft: "5px" }}
                  >
                    {Object.keys(this.state.cart).length}
                  </span>
                </Link>
                {!this.state.user ? (
                  <Link to="/login" className="navbar-item">
                    Login
                  </Link>
                ) : (
                  <Link to="/" onClick={this.logout} className="navbar-item">
                    Logout
                  </Link>
                )}
              </div>
            </nav>
            <Switch>
              <Route exact path="/" component={ProductList} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/add-product" component={AddProduct} />
              <Route exact path="/products" component={ProductList} />
            </Switch>
          </div>
        </Router>
      </Context.Provider>
    );
  }
}

export default App;
