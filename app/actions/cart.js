import { actionType } from "../constants";

export const addItemToCart = (products) => ({
  type: actionType.ADD_TO_CART,
  payload: products
});

export const removeItem = (product) => ({
  type: actionType.REMOVE_FROM_CART,
  payload: product
});

export const fetchCartItems = (items) => ({
  type: actionType.FETCH_CART,
  payload: items
});