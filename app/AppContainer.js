import React from 'react';
import { Image, AsyncStorage } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { FontAwesome , EvilIcons, Ionicons, Entypo, MaterialCommunityIcons, MaterialIcons, Foundation, AntDesign } from '@expo/vector-icons';
import { connect } from "react-redux";
import { fetchCartItems } from "./actions/cart";
console.disableYellowBox = true;

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

class AppContainer extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  componentDidMount() {
    this.fetchCartItemsAsync();
    // this.removeCartItemsAsync();
  }

  fetchCartItemsAsync = async () => {
    const items = await AsyncStorage.getItem('items');
    const itemsparsed = JSON.parse(items);

    this.props.fetchCartItems(itemsparsed ? itemsparsed: []);
    // console.log(itemsparsed);
    
  }

  removeCartItemsAsync = async () => {
    await AsyncStorage.removeItem('items');
  }

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return this.props.children;
    }
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      require('../assets/icon.png'),
      require('../assets/splash.png'),
    ]);

    const fontAssets = cacheFonts([
      FontAwesome.font,
      EvilIcons.font,
      Ionicons.font,
      Entypo.font,
      MaterialCommunityIcons.font,
      MaterialIcons.font,
      Foundation.font,
      AntDesign.font,
    ]);

    await Promise.all([...imageAssets, ...fontAssets]);
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const mapStateToProps = state => {
  return {
    cart: state.cart
  }
};

mapDispatchToProps = dispatch => ({
  fetchCartItems: items => dispatch(fetchCartItems(items))
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
