import React, { Component } from 'react';
import { 
  View,
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import _ from 'lodash';
import Swiper from 'react-native-swiper';
import { screenWidth } from "../../constants";
import { CartIcon } from "../../components";

// fake data
import { banner, homeBlock } from "./data";

const NUM_COLUMN = 2;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,

      banners: [],
      blocks: [],
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this._scrollToTop
    });

    this.fetchBannersAsync();
    this.fetchBlocksAsync();
  }

  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;
    return {
      headerRight: <CartIcon onPress={() => navigation.openDrawer()} />
    }
  }

  fetchBannersAsync = async () => {
    this.setState({ isFetching: true });

    try {
      const response = await fetch('http://api.witcomdev.wit.co.id/api/post/banner');
      const result = await response.json();
      this.setState({
        banners: result.data,
        isFetching: false,
      });
    } catch (error) {
      this.setState({ isFetching: false });
      Alert.alert('Error', error.message);
    }
  }

  fetchBlocksAsync = async () => {
    this.setState({ isFetching: true });

    try {
      const response = await fetch('http://api.witcomdev.wit.co.id/api/post/homeblock');
      const result = await response.json();
      this.setState({
        blocks: result.data,
        isFetching: false,
      });
    } catch (error) {
      this.setState({ isFetching: false });
      Alert.alert('Error', error.message);
    }
  }

  handleRefresh = () => {
    this.setState({
      isFetching: true,
    }, () => {
      this.fetchBannersAsync();
      this.fetchBlocksAsync();
    });
  }

  _scrollToTop = () => {
    if (this.scrollview) {
      this.scrollview.scrollTo({x: 0, y: 0, animated: true});
    }
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => {
    return(
      <View style={styles.itemContainer}>
        <Image resizeMode="cover" source={{uri: item.image}} style={styles.itemImage} />
        <Text numberOfLines={1} style={styles.itemText}>{item.name}</Text>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          ref={(scrollview) => { this.scrollview = scrollview }}
          contentContainerStyle={{
            paddingVertical: 20,
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isFetching}
              onRefresh={this.handleRefresh}
            />
          }
        >
          <Swiper 
            style={styles.wrapper} 
            paginationStyle={{
              bottom: 0,
            }}
            showsButtons={false} 
            autoplay={true}
            autoplayTimeout={5}
            loop={true}
          >
            {_.map(this.state.banners, (item, index) => {
              return(
                <View key={index} style={styles.imageContainer}>
                  <Image resizeMode="cover" source={{uri: item.image}} style={styles.image} />
                </View>
              )
            })}
          </Swiper>
          <FlatList 
            columnWrapperStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
            }}
            data={this.state.blocks}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            numColumns={NUM_COLUMN}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    backgroundColor: 'white',
    height: 150+30,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 150,
    width: screenWidth-40,
    borderRadius: 5,
    backgroundColor: '#ddd',
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
    backgroundColor: '#ddd',
  },
  itemText: {
    paddingVertical: 7,
  }
});

export default HomeScreen;
