import React from 'react';
import { connect } from "react-redux";
import CartScreen from "./CartScreen";

const mapStateToProps = state => {
  return {
    cart: state.cart
  }
};

mapDispatchToProps = dispatch => ({

});

const CartScreenContainer = connect(mapStateToProps, mapDispatchToProps)(CartScreen);

export default CartScreenContainer;