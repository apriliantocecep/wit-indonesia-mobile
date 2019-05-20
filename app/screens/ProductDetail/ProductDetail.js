import React, { Component } from 'react';
import { 
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from "expo";
import _ from "lodash";
import Swiper from "react-native-swiper";
import { Ionicons } from "@expo/vector-icons";
import { screenHeight, screenWidth, borderWidth, statusBarHeight } from "../../constants";
import { convertToRupiah } from "../../helpers";
import { ButtonIcon } from "../../components";

// fake data
import { product } from "./data";

const IMAGE_HEIGHT = screenHeight/2;
const HEADER_MAX_HEIGHT = 150;
const HEADER_MIN_HEIGHT = 50;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Price = ({
  product,
  style,
}) => {
  return (
    <View
      style={[{
        flexDirection: 'row',
      }, style]}
    >
      {/* Normal Price */}
      {product.priceBeforeDiscount == product.price && (
        <Text numberOfLines={1} style={styles.price}>{convertToRupiah(product.price)}</Text>
      )}
  
      {/* Discoumt Price */}
      {product.priceBeforeDiscount != product.price && (
        <View style={styles.priceContainer}>
          <View>
            <Text numberOfLines={1} style={styles.priceDiscount}>{convertToRupiah(product.priceBeforeDiscount)}</Text>
            <Text numberOfLines={1} style={styles.price}>{convertToRupiah(product.price)}</Text>
          </View>
  
          {product.typeDiscountPercent && (
            <View style={styles.discountPercentContainer}>
              <Text numberOfLines={1} style={styles.discountPercentNumber}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
};

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    const { navigation } = props;
    
    this.state = {
      product: navigation.getParam('item'),
      // product: product,
      readMore: false,
    };

    this.scrollYAnimatedValue = new Animated.Value(0);
  }

  onPressBack = () => {
    this.props.navigation.goBack()
  }

  onPressMore = () => {
    this.setState(prevState => ({ readMore: !prevState.readMore }));
  }

  onPressOptions = () => {
    Alert.alert('More Options', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.')
  }

  onPressShareAsync = async () => {
    const { product } = this.state;

    try {
      const result = await Share.share({
        message: `${product.name} | ${product.cover}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          Alert.alert('Shared', result.activityType)
        } else {
          // shared
          Alert.alert('Shared', 'Product shared')
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  onPressAddToBag = () => {
    const { product } = this.state;
    
    this.props.addItemToCart(product);
  }

  render() {
    const { product, readMore } = this.state;
    const disabled = product.quantity <= 0;

    const headerBackgroundColor = this.scrollYAnimatedValue.interpolate({
      inputRange: [ 0, HEADER_SCROLL_DISTANCE ],
      outputRange: [ 'transparent', 'white' ],
      extrapolate: 'clamp'
    });

    const headerElevation = this.scrollYAnimatedValue.interpolate({
      inputRange: [ 0, HEADER_SCROLL_DISTANCE ],
      outputRange: [ 0, 6 ],
      extrapolate: 'clamp'
    });

    const headerBorderBottomWidth = this.scrollYAnimatedValue.interpolate({
      inputRange: [ 0, HEADER_SCROLL_DISTANCE ],
      outputRange: [ 0, borderWidth ],
      extrapolate: 'clamp'
    });

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          style={[styles.container]}
          scrollEventThrottle={16}
          onScroll = { Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollYAnimatedValue }}}]
          )}
        >
          <Swiper style={styles.wrapper} showsButtons={false}>
            {_.times(5, (i) => {
              return (
                <View key={i} style={styles.imageContainer}>
                  <Image resizeMode="cover" source={{uri: product.cover}} style={styles.imageCover} />
                </View>
              )
            })}
          </Swiper>

          <View style={styles.contentContainer}>
            {disabled && <Text numberOfLines={1} style={styles.outOfStockText}>Out of stock</Text>}
            <Text numberOfLines={3} style={styles.title}>{product.name}</Text>

            <Price product={product} />

            <View style={styles.line} />

            <View style={styles.informationContainer}>
              <Text numberOfLines={1} style={styles.informationTitle}>Product Information</Text>

              <View style={styles.informationRowContainer}>
                <Text numberOfLines={1} style={styles.informationRowText}>Stock</Text>
                <Text numberOfLines={1} style={styles.informationRowText}>{product.quantity}</Text>
              </View>
              <View style={styles.informationRowContainer}>
                <Text numberOfLines={1} style={styles.informationRowText}>Category</Text>
                <Text numberOfLines={1} style={styles.informationRowText}>{product.defaultCategory}</Text>
              </View>
              <View style={styles.informationRowContainer}>
                <Text numberOfLines={1} style={styles.informationRowText}>Manufacturer</Text>
                <Text numberOfLines={1} style={styles.informationRowText}>{product.manufacturer}</Text>
              </View>
              <View style={styles.informationRowContainer}>
                <Text numberOfLines={1} style={styles.informationRowText}>Weight</Text>
                <Text numberOfLines={1} style={styles.informationRowText}>{product.weight} Kg</Text>
              </View>

              <Text numberOfLines={1} style={styles.informationTitle}>Product Description</Text>
              <Text style={styles.informationRowText}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut nam porro libero, assumenda eligendi optio soluta odit omnis sunt ex ea excepturi voluptatem maxime similique incidunt voluptas doloremque ipsam aliquam?
                {readMore && <Text> Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore quo omnis natus, enim minus voluptate error facilis, ab aliquam harum delectus fugit placeat quidem repellendus in, minima pariatur eaque officia.</Text>}
                {readMore && <Text> Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore quo omnis natus, enim minus voluptate error facilis, ab aliquam harum delectus fugit placeat quidem repellendus in, minima pariatur eaque officia.</Text>}
              </Text>
              <Text onPress={this.onPressMore} numberOfLines={1} style={styles.informationReadMore}>
                {readMore == true ? 'Close': 'Read More'}
              </Text>
            </View>
          </View>
        </ScrollView>
        
        <Animated.View style={[styles.header, { elevation: headerElevation, backgroundColor: headerBackgroundColor, borderBottomWidth: headerBorderBottomWidth}]}>
          <LinearGradient 
            style={styles.bar}
            colors={[ '#ddd', 'rgba(255,255,255,0)']}
          >
            <ButtonIcon icon={<Ionicons name="md-arrow-round-back" size={25} style={{color: '#333'}} />} onPress={this.onPressBack} />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <ButtonIcon icon={<Ionicons name="md-share" size={25} style={{color: '#333'}} />} onPress={this.onPressShareAsync} />
              <ButtonIcon icon={<Ionicons name="md-more" size={25} style={{color: '#333'}} />} onPress={this.onPressOptions} />
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity disabled={disabled} activeOpacity={0.8} onPress={this.onPressAddToBag} style={[styles.buttonBagContainer, disabled && styles.buttonBagDisabled]}>
            <Ionicons name="ios-add-circle-outline" size={25} style={styles.buttonBagIcon} />
            <Text numberOfLines={1} style={styles.buttonBagText}>Add To Bag</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={() => alert('Cart')} style={styles.buttonCartContainer}>
            {this.props.cart.items.length > 0 && (
              <View style={styles.buttonCartBadgeContainer}>
                <Text numberOfLines={1} style={styles.buttonCartBadgeText}>{this.props.cart.items.length}</Text>
              </View>
            )}
            <Ionicons name="md-cart" size={25} style={styles.buttonCartIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // backgroundColor: '#03A9F4',
    backgroundColor: 'transparent',
    borderBottomColor: '#ccc',
    overflow: 'hidden',
  },
  bar: {
    paddingTop: statusBarHeight,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 15,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },

  bottomContainer: {
    elevation: 6,
    borderTopColor: '#eee',
    borderTopWidth: borderWidth,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonBagContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: '#ED3833',
    borderRadius: 5,
    justifyContent: 'center', alignItems: 'center',
    flexDirection: 'row'
  },
  buttonBagDisabled: {
    backgroundColor: '#ddd',
  },
  buttonBagIcon: {
    color: 'white',
    marginRight: 5,
  },
  buttonBagText: {
    color: 'white',
  },
  outOfStockText: {
    color: '#ED3833',
    fontWeight: '500',
  },

  buttonCartContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 3,
    borderWidth: borderWidth,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginLeft: 10,
  },
  buttonCartIcon: {
    color: '#ccc'
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

  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {
    height: IMAGE_HEIGHT,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    backgroundColor: '#ddd',
    height: IMAGE_HEIGHT,
  },
  imageCover: {
    width: screenWidth,
    height: IMAGE_HEIGHT,
  },

  line: {
    height: borderWidth,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  title: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 7,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  priceStrike: {
    textDecorationLine: 'line-through',
  },
  priceDiscount: {
    color: '#ccc',
    textDecorationLine: 'line-through',
  },
  price: {
    color: '#ED3833',
    fontWeight: '500',
    fontSize: 15,
  },
  discountPercentContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ED3833',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  discountPercentNumber: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },

  informationContainer: {
    // elevation: 1,
    // borderWidth: borderWidth,
    borderColor: '#eee',
    borderRadius: 8,
    // padding: 10,
  },
  informationTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: '#666',
    marginBottom: 10,
  },
  informationRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  informationRowText: {fontSize: 13,color: '#888'},
  informationReadMore: {
    color: '#4EAA2E',
    fontSize: 13,
  }
});

export default ProductDetail;
