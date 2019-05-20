import React from 'react';
import { 
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { statusBarHeight, screenWidth, screens, borderWidth } from "../constants";
import { convertToRupiah } from "../helpers";

let paddingText = 8;
let width = (screenWidth/2)-20;
let imageWidth = width;
let height = imageWidth+paddingText+70;

const ProductCard = ({
  item,
  onPress,
}) => {
  return(
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.itemContainer}>
        <View style={{
          backgroundColor: '#eee',
        }}>
          <Image 
            resizeMode="cover"
            source={{uri: item.cover}}
            style={{
              width: imageWidth,
              height: imageWidth,
            }} 
          />
        </View>

        <View style={{
          padding: paddingText,
        }}>
          <Text numberOfLines={2} style={styles.name}>
            {item.name}
          </Text>
          
          {/* Normal Price */}
          {item.priceBeforeDiscount == item.price && (
            <Text numberOfLines={1} style={styles.price}>
              {convertToRupiah(item.price)}
            </Text>
          )}

          {/* Discount Price */}
          {item.priceBeforeDiscount != item.price && (
            <View>
              <Text numberOfLines={1} style={styles.priceDiscount}>
                {convertToRupiah(item.priceBeforeDiscount)}
              </Text>
              <Text numberOfLines={1} style={styles.price}>
                {convertToRupiah(item.price)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 5,
    marginTop: 10,
    width: width,
    height: height,
    overflow: 'hidden',
    borderWidth: borderWidth,
    borderColor: '#ddd',
  },

  price: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ED3833',
  },
  priceDiscount: {
    fontSize: 11,
    textDecorationLine: 'line-through',
    color: '#ccc',
  },
  name: {
    fontSize: 11,
    color: '#333',
  },
});

export default ProductCard;
