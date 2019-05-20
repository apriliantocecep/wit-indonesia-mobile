import React from 'react';
import { connect } from "react-redux";
import { addItemToCart } from "../../actions/cart";
import ProductDetail from "./ProductDetail";

const mapStateToProps = state => {
  return {
    cart: state.cart
  }
};

mapDispatchToProps = dispatch => ({
  addItemToCart: products => dispatch(addItemToCart(products))
});

const ProductDetailContainer = connect(mapStateToProps, mapDispatchToProps)(ProductDetail);

export default ProductDetailContainer;