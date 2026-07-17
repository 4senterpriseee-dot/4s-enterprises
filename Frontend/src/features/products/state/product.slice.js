import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProduct: [],
    products: [],
    productDetails: null,
  },

  reducers: {
    setProduct: (state, action) => {
      state.sellerProduct = action.payload;
    },
    setAllProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
  },
});

export const { setProduct, setAllProducts, setProductDetails } = productSlice.actions;

export default productSlice.reducer;
