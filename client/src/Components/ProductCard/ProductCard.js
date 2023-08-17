import React, { memo } from "react";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../Redux/features/Cart/CartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import { AiOutlinePlusCircle } from "react-icons/ai";

import styles from "./productCard.module.scss";

const ProductCard = ({ product, wishListHandler }) => {
  const title = product?.name;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);

  const navigate = useNavigate();

  //add product to cart handle
  const addProduct = () => {
    dispatch(addToCart(product));
    toast.success(`${product?.title.slice(0, 20)} is added to cart`, {
      autoClose: 1000,
    });
  };

  return (
    <div>
      <Card
        style={{
          width: "18rem",
          textAlign: "center",
        }}
        className={styles.productCard}
      >
        {/* <AiOutlineStar size={22} style={{ marginLeft: "90%" }} /> */}
        <Card.Img
          onClick={() => navigate(`/products/${product?.id}`)}
          variant="top"
          src={product?.avatar}
          className={styles.cardImg}
        />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>${product?.price}</Card.Text>
          <AiOutlinePlusCircle
            size={22}
            onClick={addProduct}
            style={{ cursor: "pointer" }}
          />
        </Card.Body>
        <AiOutlineStar
          size={22}
          style={{ marginLeft: "90%", marginBottom: "5px", cursor: "pointer" }}
        />
      </Card>
    </div>
  );
};

export default memo(ProductCard);
