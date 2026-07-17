import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    subtotal: 0,
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setSubtotal: (state, action) => {
      state.subtotal = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

export const { setItems, setSubtotal, addItem } = cartSlice.actions;

export default cartSlice.reducer;