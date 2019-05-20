import React, { Component } from 'react';
import { 
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import _ from "lodash";
import { Ionicons } from "@expo/vector-icons";
import { statusBarHeight, screenWidth, screens, borderWidth } from "../../constants";
import { convertToRupiah } from "../../helpers";
import { ProductCard } from "../../components";

// fake data
// import { products } from "./data";

const HEADER_MAX_HEIGHT = 150;
const HEADER_MIN_HEIGHT = 50;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      loading: false,
      page: 1,
      products: [],
      keyword: '',
    };

    this.scrollYAnimatedValue = new Animated.Value(0);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this._scrollToTop
    });

    this.fetchDataAsync();
  }

  fetchDataAsync = async () => {
    this.setState({ loading: true });

    var body = {
      "page": this.state.page,
      "count": 10,
      "keyword": this.state.keyword
    };

    try {
      const response = await fetch('http://api.witcomdev.wit.co.id/api/product/search', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });
      const result = await response.json();

      if (result.length > 0) {
        this.setState({
          products: this.state.page === 1 ? result: [...this.state.products, ...result],
        });
      }
      this.setState({ loading: false });
      this.setState({ isFetching: false });
      
    } catch (error) {
      this.setState({ loading: false });
      this.setState({ isFetching: false });
      Alert.alert('Error', error.message);
    }
  }

  onPressItem = (item) => {
    this.props.navigation.navigate(screens.ProductDetail, {
      item
    });
  }

  handleRefresh = () => {
    this.setState({
      isFetching: true,
      page: 1,
    }, () => this.fetchDataAsync());
  }

  handleLoadMore = () => {
    this.setState({
      page: this.state.page + 1,
    }, () => {
      this.fetchDataAsync()
    })
  }

  handleSearch = _.debounce((keyword) => {
    this.setState({
      keyword: keyword,
      products: [],
      page: 1,
    });

    this.fetchDataAsync();
  }, 1000);

  _scrollToTop = () => {
    if (this.scrollview) {
      this.scrollview.scrollToOffset({x: 0, y: 0, animated: true});
    }
  }

  _keyExtractor = (item, index) => index.toString();

  _renderFooter = () => {
    if (!this.state.loading) return null
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" animating color="#4EAA2E" />
      </View>
    )
  }

  _renderItem = ({item}) => {
    return (
      <ProductCard item={item} onPress={() => this.onPressItem(item)} />
    )
  }

  render() {
    const headerElevation = this.scrollYAnimatedValue.interpolate({
      inputRange: [ 0, HEADER_SCROLL_DISTANCE ],
      outputRange: [ 0, 5 ],
      extrapolate: 'clamp'
    });

    const headerBorderBottomWidth = this.scrollYAnimatedValue.interpolate({
      inputRange: [ 0, HEADER_SCROLL_DISTANCE ],
      outputRange: [ 0, borderWidth ],
      extrapolate: 'clamp'
    });

    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.searchContainer, {elevation: headerElevation, borderBottomWidth: headerBorderBottomWidth}]}>
          <Ionicons name="md-search" style={styles.searchIcon} size={23} />
          <TextInput 
            style={styles.searchTextInput}
            placeholder="Search Product"
            underlineColorAndroid="transparent"
            onChangeText={keyword => this.handleSearch(keyword)}
          />
        </Animated.View>
        <FlatList 
          ref={(scrollview) => { this.scrollview = scrollview }}
          onScroll = { Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollYAnimatedValue }}}]
          )}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 20,
          }}
          columnWrapperStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
          numColumns={2}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          data={this.state.products}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          refreshing={this.state.isFetching}
          onRefresh={this.handleRefresh}
          ListFooterComponent={this._renderFooter}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={1}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: statusBarHeight,
  },

  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderBottomColor: '#ccc',
    // borderBottomWidth: borderWidth,
    // borderRadius: 3,
    // marginHorizontal: 10,
    // marginBottom: 10,
  },
  searchIcon:{
    color: '#ccc',
    marginRight: 15,
    marginLeft: 8,
  },
  searchTextInput:{
    flex: 1,
  },
});

export default SearchScreen;
