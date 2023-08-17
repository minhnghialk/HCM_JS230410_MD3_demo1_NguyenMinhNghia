import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { STATUS } from "../../constants/Status";
// import { fetchProducts } from "../../Redux/features/Product/ProductSlice";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./productlist.module.scss";
import Loader from "../Loader/Loader";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { getproducts } from "../../Redux/features/Product/ProductSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [visibleProducts, setVisibleProducts] = useState([]);

  const { products, status } = useSelector((state) => state.products);
  console.log("products", products);

  useEffect(() => {
    let result = async () => {
      try {
        const products = await axios.get(
          "http://127.0.0.1:4000/apis/v1/products"
        );
        // console.log(products.data.data);
        setVisibleProducts(products.data.data.slice(0, 3));
        dispatch(getproducts(products.data.data));
        // console.log("Products:", products.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    result();
  }, []);

  const loadMoreProducts = async () => {
    try {
      const products = await axios.get(
        "http://127.0.0.1:4000/apis/v1/products"
      );
      // console.log(products.data.data);
      const newVisibleProducts = products.data.data.slice(
        0,
        visibleProducts.length + 3
      );
      setVisibleProducts(newVisibleProducts);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:4000/apis/v1/products/search?query=${searchValue}`
      );
      console.log("Search Results:", response.data);

      const searchResults = response.data.data;
      setVisibleProducts(searchResults);
    } catch (err) {
      console.log("err", err);
    }
  };

  if (status === STATUS.LOADING) {
    return <Loader />;
  }

  if (status !== STATUS.LOADING && status === STATUS.ERROR) {
    return <h2>{status}</h2>;
  }

  return (
    <div className={styles.productListWrapper} id="product-list">
      <Container>
        <div className={styles.searchWrapper}>
          <div>
            <h3>Collection</h3>
            <p>
              Each season, we collaborate with world class designers to create a
              collection inspired by natural world.
            </p>
          </div>
          <div>
            {showSearch && (
              <input
                type="text"
                className={styles.searchBar}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search Product"
              />
            )}
            <BiSearch
              size={25}
              onClick={() => {
                setShowSearch(!showSearch);
                handleSearch();
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <div className={styles.productList}>
          {products
            ?.filter((item) =>
              item.title?.toLowerCase().includes(searchValue.toLowerCase())
            )
            ?.map((product) => {
              return <ProductCard key={product?.id} product={product} />;
            })}
          {visibleProducts?.map((product) => {
            return <ProductCard key={product?.id} product={product} />;
          })}
        </div>
        <Button
          variant="secondary"
          style={{
            backgroundColor: "white",
            color: "black",
            border: "1px solid",
            marginTop: "20px",
            marginLeft: "43%",
            fontSize: "12px",
          }}
          onClick={loadMoreProducts}
          disabled={visibleProducts >= products.length}
        >
          VIEW MORE
        </Button>{" "}
      </Container>
    </div>
  );
};

export default ProductList;
