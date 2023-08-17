import "./App.scss";
import Naav from "./Components/Nav/Navv";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Cart from "./Pages/Cart/Cart";
import ProductDetail from "./Components/ProductDetail/ProductDetail";
import WishList from "./Pages/WishList/WishList";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import Footer from "./Components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      App
      <Naav />
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />/
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/wishlist/" element={<WishList />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer position="top-right" />
      <ToastContainer />
    </>
  );
}

export default App;
