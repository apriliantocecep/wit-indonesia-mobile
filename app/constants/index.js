import { Dimensions, StyleSheet } from 'react-native';
import { Constants } from "expo";

export const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
export const statusBarHeight = Constants.statusBarHeight;

export const borderWidth = StyleSheet.hairlineWidth;

export const screens = {
  MainTab: 'MainTab',
  MainStack: 'MainStack',

  Home: 'Home',
  HomeStack: 'HomeStack',

  Search: 'Search',
  SearchStack: 'SearchStack',

  Category: 'Category',
  CategoryStack: 'CategoryStack',

  Product: 'Product',

  ProductDetail: 'ProductDetail',
};

export const actionType = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
}