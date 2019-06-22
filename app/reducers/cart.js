import { actionType } from "../constants";
const initialState = {
  items: []
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    case actionType.ADD_TO_CART:
      return Object.assign({}, state, {
        items: [...state.items, action.payload],
      });

    case actionType.REMOVE_FROM_CART:
      return Object.assign({}, state, {
        items: state.items.filter(item => item.idProduct !== action.payload.idProduct),
      });

    case actionType.FETCH_CART:
      return Object.assign({}, state, {
        items: action.payload,
      });
  
    default:
      return state;
  }
}

export default cart;