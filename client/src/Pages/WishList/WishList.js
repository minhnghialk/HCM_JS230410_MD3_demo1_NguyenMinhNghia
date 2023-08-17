import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./wishlist.module.scss";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { removeAll } from "../../Redux/features/wishlist/WishListSlice";
import { AiOutlineStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const WishList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.wishlist);
  const navigate = useNavigate();
  const content =
    products?.wishList?.length > 0 ? (
      products?.wishList?.map((product) => {
        return <ProductCard key={product?.id} product={product} />;
      })
    ) : (
      <div className="text-center">
        <img
          src="https://elinen.com.ua/bitrix/templates/mav/images/empty-wishlist.png"
          alt="wishlist empty"
        />
        <h1>
          Your wishlist is <span style={{ color: "red" }}>Empty</span>!
        </h1>
        <button
          className="btn btn-danger"
          style={{ marginTop: "20px", borderRadius: "40px", fontSize: "18px" }}
          onClick={() => navigate("/")}
        >
          <AiOutlineStar style={{ marginBottom: "2px" }} />
          RETURN TO SHOP
        </button>
      </div>
    );

  return (
    <div className={`container`}>
      <div className={styles.wishListWrapper}>
        <h2 className="text-center py-3">Your WishList</h2>
        <div
          className={
            products?.wishList?.length > 0 ? styles.wishListItemWrapper : ""
          }
        >
          {content}
        </div>
        {products?.wishList?.length > 0 && (
          <button
            className={`${styles.wishListBtn}`}
            onClick={() => dispatch(removeAll())}
          >
            Remove all from Wishlist
          </button>
        )}
      </div>
    </div>
  );
};

export default WishList;
