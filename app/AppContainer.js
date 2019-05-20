import React from 'react';
import { Image } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { FontAwesome , EvilIcons, Ionicons, Entypo, MaterialCommunityIcons, MaterialIcons, Foundation, AntDesign } from '@expo/vector-icons';
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

export default AppContainer;
