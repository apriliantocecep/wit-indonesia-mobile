import React, { Component } from 'react';
import { 
  View,
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { screenWidth, screens } from "../../constants";
import { textSpliter } from "../../helpers";
import { CartIcon } from "../../components";

// fake data
// import { categories } from "./data";

const NUM_COLUMN = 3;

class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      isFetching: false,
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this._scrollToTop
    });

    this.fetchDataAsync();
  }

  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;
    return {
      headerRight: <CartIcon onPress={() => alert('Cart')} />
    }
  }

  fetchDataAsync = async () => {
    this.setState({ isFetching: true });

    try {
      const response = await fetch('http://api.witcomdev.wit.co.id/api/category/get', {
        method: 'POST',
      });
      const result = await response.json();
      this.setState({
        categories: result,
        isFetching: false,
      });
    } catch (error) {
      this.setState({ isFetching: false });
      Alert.alert('Error', error.message);
    }
  }

  onPressItem = (item) => {
    this.props.navigation.navigate(screens.Product, {
      category: item
    });
    
  }

  handleRefresh = () => {
    this.setState({
      isFetching: true,
    }, () => this.fetchDataAsync());
  }

  _scrollToTop = () => {
    if (this.scrollview) {
      this.scrollview.scrollToOffset({x: 0, y: 0, animated: true});
    }
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => {
    let width = (screenWidth/NUM_COLUMN)-20;
    let height = width;
    return(
      <TouchableOpacity activeOpacity={0.8} onPress={() => this.onPressItem(item)}>
        <View style={{
          width: width,
          justifyContent: 'flex-start',
          backgroundColor: 'white',
          marginTop: 10,
          overflow: 'hidden',
        }}>
          <View style={{
            backgroundColor: '#83AFF7',
            width: width,
            height: height,
            borderRadius: 7,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text 
              numberOfLines={1}
              style={{
                color: 'white',
                fontSize: 50,
                fontWeight: '700',
              }}
            >
              {textSpliter(item.name)}
            </Text>
          </View>
          <Text 
            numberOfLines={1} 
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: '#333',
            }}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList 
          ref={(scrollview) => { this.scrollview = scrollview }}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 20,
          }}
          columnWrapperStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
          data={this.state.categories}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          numColumns={NUM_COLUMN}
          refreshing={this.state.isFetching}
          onRefresh={this.handleRefresh}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  renderContainer: {
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  itemContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: (screenWidth/NUM_COLUMN)-20,
    height: (screenWidth/NUM_COLUMN)-20,
    borderRadius: 5,
  },
  itemText: {
    paddingVertical: 7,
  }
});

export default CategoryScreen;
