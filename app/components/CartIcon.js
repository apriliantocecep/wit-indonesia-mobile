import React from 'react';
import { 
  Text, 
  View, 
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { borderWidth } from "../constants";

class CartIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.props.onPress} style={styles.buttonCartContainer}>
        {this.props.cart.items.length > 0 && (
          <View style={styles.buttonCartBadgeContainer}>
            <Text numberOfLines={1} style={styles.buttonCartBadgeText}>{this.props.cart.items.length}</Text>
          </View>
        )}
        <Ionicons name="md-cart" size={25} style={styles.buttonCartIcon} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonCartContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    // borderRadius: 3,
    // borderWidth: borderWidth,
    borderColor: '#ccc',
    backgroundColor: 'transparent',
  },
  buttonCartIcon: {
    color: '#333'
  },
  buttonCartBadgeContainer: {
    position: 'absolute',
    top: 3,
    right: 5,
    backgroundColor: '#ED3833',
    height: 20, width: 20,
    borderRadius: 20/2,
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10,
  },
  buttonCartBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 11,
    zIndex: 9,
  },
});

const mapStateToProps = state => {
  return {
    cart: state.cart
  }
};

export default connect(mapStateToProps, null)(CartIcon);
