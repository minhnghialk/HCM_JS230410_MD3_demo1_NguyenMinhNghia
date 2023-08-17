import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { STATUS } from "../../../constants/Status";
const base_url = "http://127.0.0.1:4000/apis/v1/products";

const initialState = {
  status: "",
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    getproducts: (state, action) => {
      return { ...state, products: action.payload };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = STATUS.LOADING;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = STATUS.IDLE;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = STATUS.ERROR;
      });
  },
});

//fetching product using build in thunk on toolkit

export const fetchProducts = createAsyncThunk("fetch/products", async () => {
  const data = await axios.get(`${base_url}`).then((res) => res.data);
  return data;
});

export const searchProducts = createAsyncThunk(
  "search/products",
  async (searchValue) => {
    const response = await axios
      .get(`${base_url}?search=${searchValue}`)
      .then((res) => res.data);
    return response.data;
  }
);
export const { getproducts } = productSlice.actions;
export default productSlice.reducer;
