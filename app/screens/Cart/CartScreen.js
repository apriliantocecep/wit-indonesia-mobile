import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Image } from 'react-native';
import { convertToRupiah } from "../../helpers";

class CartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _keyExtractor = (item, index) => index.toString();

  renderItem = ({item}) => {
    return (
      <View style={{
        flexDirection: 'row',
        marginBottom: 25,
        backgroundColor: 'transparent',
      }}>
        <Image resizeMode="cover" source={{uri: item.cover}} style={{
          width: 100, height: 100,
          backgroundColor: '#ddd',
          marginRight: 5,
        }} />
        <View style={{
          justifyContent: 'space-between',
          flex: 1,
        }}>
          <Text numberOfLines={2} style={{
            flexWrap: 'wrap',
          }}>{item.name}</Text>
          <Text numberOfLines={1} style={{
            fontWeight: '600'
          }}>{convertToRupiah(item.price)}</Text>
          <Text numberOfLines={1}>QTY: {item.quantity}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <FlatList 
        contentContainerStyle={{
          paddingTop: 30,
          backgroundColor: 'transparent',
        }}
        data={this.props.cart.items}
        renderItem={this.renderItem}
        keyExtractor={this._keyExtractor}
      />
    );
  }
}

export default CartScreen;
