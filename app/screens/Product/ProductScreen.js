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
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import _ from "lodash";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { statusBarHeight, screenWidth, screenHeight, borderWidth, screens } from "../../constants";
import { compareValues, convertToRupiah } from "../../helpers";
import { ProductCard, ButtonIcon } from "../../components";

// fake data
// import { products } from "./data";

const NUM_COLUMN = 2;
const PRICE_MIN_VALUE = 0;
const PRICE_MAX_VALUE = 10000000;

const ModalSort = ({
  visible,
  onPressClose,
  actions,
  selected,
}) => (
  <Modal 
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onPressClose}
  >
    <TouchableWithoutFeedback onPress={onPressClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeaderContainer}>
            {/* Close */}
            <View style={styles.modalClose}>
              <ButtonIcon icon={<Ionicons name="md-close" size={25} style={{color: '#333'}} />} onPress={onPressClose} />
            </View>

            {/* Title */}
            <View style={{ padding: 8, }}>
              <Text numberOfLines={1} style={styles.modalTitle}>Sort</Text>
            </View>
          </View>

          {/* Actions */}
          {_.map(actions, (item, index) => {
            var selectedSort = selected == item.key;
            var selectedIcon = selectedSort ? 'on': 'off';
            return(
              <TouchableHighlight key={index} underlayColor="#ddd" onPress={item.onPress}>
                <View style={styles.modalButtonActioncontainer}>
                  <Ionicons name={`md-radio-button-${selectedIcon}`} size={25} style={{color: '#333'}} />
                  <Text numberOfLines={1} style={styles.modalButtonActionText}>{item.name}</Text>
                </View>
              </TouchableHighlight>
            )
          })}
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

const ModalFilter = ({
  visible,
  onPressClose,
  children,
}) => (
  <Modal 
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onPressClose}
  >
    {/* <TouchableWithoutFeedback onPress={onPressClose}> */}
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeaderContainer}>
            {/* Close */}
            <View style={styles.modalClose}>
              <ButtonIcon icon={<Ionicons name="md-close" size={25} style={{color: '#333'}} />} onPress={onPressClose} />
            </View>

            {/* Title */}
            <View style={{ padding: 8, }}>
              <Text numberOfLines={1} style={styles.modalTitle}>Filter</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 5}}>
            {children}
          </View>

        </View>
      </View>
    {/* </TouchableWithoutFeedback> */}
  </Modal>
);

class ProductScreen extends Component {
  constructor(props) {
    super(props);

    this.productsHold = [];

    this.state = {
      category: props.navigation.getParam('category'),
      products: [],
      isFetching: false,
      loading: false,
      page: 1,

      modalSortVisible: false,
      modalFilterVisible: false,
      selectedSort: false,

      priceValues: [
        PRICE_MIN_VALUE, PRICE_MAX_VALUE
      ],
      toggleDiscount: false,
      toggleOutOfStock: false,
      toggleInStock: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;
    const category = navigation.getParam('category');
    return {
      title: category.name,
      headerRight: (
        <View style={{
          flexDirection: 'row',
        }}>
          <ButtonIcon icon={<MaterialIcons name="filter-list" size={25} style={styles.iconHeader} />} onPress={() => params.setModalSortVisible(true)} />
          <ButtonIcon icon={<MaterialIcons name="tune" size={25} style={styles.iconHeader} />} onPress={() => params.setModalFilterVisible(true)} />
        </View>
      )
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      setModalSortVisible: this.setModalSortVisible,
      setModalFilterVisible: this.setModalFilterVisible,
    });

    this.fetchDataAsync();
  }
  
  fetchDataAsync = async () => {
    this.setState({ loading: true });
    const { category } = this.state;

    try {
      const response = await this.getData(this.state.page);
      const result = await response.json();

      if (result.length > 0) {
        this.setState({
          products: this.state.page === 1 ? result: [...this.state.products, ...result],
        });

        this.productsHold = this.state.page === 1 ? result: [...this.state.products, ...result];
      }
      this.setState({ loading: false });
      this.setState({ isFetching: false });

    } catch (error) {
      this.setState({ loading: false });
      this.setState({ isFetching: false });
      Alert.alert('Error', error.message);
    }
  }

  getData = (page = 1) => {
    const { category } = this.state;

    var body = {
      "page": page,
      "count": 10,
      "category": category.name
    };

    return fetch('http://api.witcomdev.wit.co.id/api/product/get', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
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

  _keyExtractor = (item, index) => item.idProduct;

  _renderItem = ({item}) => {
    return <ProductCard item={item} onPress={() => this.onPressItem(item)} />
  }

  _renderFooter = () => {
    if (!this.state.loading) return null
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" animating color="#4EAA2E" />
      </View>
    )
  }

  onPressItem = (item) => {
    this.props.navigation.navigate(screens.ProductDetail, {
      item
    });
  }

  onPressApplyFilter = () => {
    this.setModalFilterVisible(false);

    // just for price
    const { products, priceValues } = this.state;

    var productsFiltered = _.filter(products, (product) => {
      return product.price >= priceValues[0] && product.price <= priceValues[1];
    });

    if (products.length > 0) {
      this.setState({ products: productsFiltered });
    } else {
      this.setState({ products: this.productsHold })
    }
  }

  onPressResetFilter = () => {
    this.setState({
      priceValues: [PRICE_MIN_VALUE, PRICE_MAX_VALUE],
      toggleDiscount: false,
      toggleInStock: false,
      toggleOutOfStock: false,
      products: this.productsHold,
    });
    this.setModalFilterVisible(false);
  }

  onPressToggleDiscount = async () => {
    this.setToggleDiscount();
    const { products, toggleDiscount, priceValues } = this.state;
    if (!toggleDiscount) {
      var productsFiltered = _.filter(products, (product) => {
        return product.totalDiscount > 0;
      });
      this.setState({ products: productsFiltered });
    } else {
      this.setState({ products: this.productsHold })
    }
  }

  onPressToggleOutOfStock = () => {
    this.setToggleOutOfStock();
    const { products, toggleOutOfStock, priceValues } = this.state;
    if (!toggleOutOfStock) {
      var productsFiltered = _.filter(products, (product) => {
        return product.quantity <= 0;
      });
      this.setState({ products: productsFiltered });
    } else {
      this.setState({ products: this.productsHold })
    }
  }

  onPressToggleInStock = () => {
    this.setToggleInStock();
    const { products, toggleInStock, priceValues } = this.state;
    if (!toggleInStock) {
      var productsFiltered = _.filter(products, (product) => {
        return product.quantity > 0;
      });
      this.setState({ products: productsFiltered });
    } else {
      this.setState({ products: this.productsHold })
    }
  }

  setModalSortVisible = visible => this.setState({ modalSortVisible: visible });
  setModalFilterVisible = visible => this.setState({ modalFilterVisible: visible });
  
  setToggleDiscount = () => this.setState(prevState => ({ toggleDiscount: !prevState.toggleDiscount }));
  setToggleOutOfStock = () => this.setState(prevState => ({ toggleOutOfStock: !prevState.toggleOutOfStock }));
  setToggleInStock = () => this.setState(prevState => ({ toggleInStock: !prevState.toggleInStock }));

  setPriceValuesChange = values => {
    this.setState({
      priceValues: values,
    });
  };

  setSort = (key, sort = 'asc') => {
    this.state.products.sort(compareValues(key, sort));
    this.setModalSortVisible(false);
    this.setState({ selectedSort: `${key}-${sort}` });
  }

  render() {
    const { 
      products: data, 
      priceValues, 
      toggleDiscount,
      toggleInStock,
      toggleOutOfStock,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {/* Modal Sort */}
        <ModalSort 
          visible={this.state.modalSortVisible} 
          onPressClose={() => this.setModalSortVisible(false)} 
          selected={this.state.selectedSort}
          actions={[
            {
              key: 'name-asc',
              name: 'Name A-Z',
              onPress: () => this.setSort('name', 'asc')
            },
            {
              key: 'name-desc',
              name: 'Name Z-A',
              onPress: () => this.setSort('name', 'desc')
            },
            {
              key: 'price-asc',
              name: 'Lower Price',
              onPress: () => this.setSort('price', 'asc')
            },
            {
              key: 'price-desc',
              name: 'Highest Price',
              onPress: () => this.setSort('price', 'desc')
            },
            {
              key: 'quantity-asc',
              name: 'Lower Quantity',
              onPress: () => this.setSort('quantity', 'asc')
            },
            {
              key: 'quantity-desc',
              name: 'Highest Quantity',
              onPress: () => this.setSort('quantity', 'desc')
            }
          ]}
        />

        {/* Modal Filter */}
        <ModalFilter 
          visible={this.state.modalFilterVisible} 
          onPressClose={() => this.setModalFilterVisible(false)}
        >
          {/* Promotion */}
          <Text numberOfLines={1} style={styles.modalSubTitle}>Promotion</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
            <TouchableOpacity activeOpacity={0.9} onPress={this.onPressToggleDiscount}>
              <View style={[styles.labelContainer, toggleDiscount && styles.labelSelectedContainer]}>
                <Text numberOfLines={1} style={[styles.labelText, toggleDiscount && styles.labelSelectedText]}>Discount</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Quantity */}
          <Text numberOfLines={1} style={styles.modalSubTitle}>Quantity</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
            <TouchableOpacity activeOpacity={0.9} onPress={this.onPressToggleInStock}>
              <View style={[styles.labelContainer, toggleInStock && styles.labelSelectedContainer]}>
                <Text numberOfLines={1} style={[styles.labelText, toggleInStock && styles.labelSelectedText]}>In Stock</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} onPress={this.onPressToggleOutOfStock}>
              <View style={[styles.labelContainer, toggleOutOfStock && styles.labelSelectedContainer]}>
                <Text numberOfLines={1} style={[styles.labelText, toggleOutOfStock && styles.labelSelectedText]}>Out of Stock</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Price */}
          <Text numberOfLines={1} style={styles.modalSubTitle}>Price</Text>
          <View style={styles.filterPriceContainer}>
            <View>
              <Text numberOfLines={1}>Min. Price</Text>
              <Text numberOfLines={1}>{convertToRupiah(priceValues[0])}</Text>
            </View>
            <View>
              <Text numberOfLines={1}>Max. Price</Text>
              <Text numberOfLines={1}>{convertToRupiah(priceValues[1])}</Text>
            </View>
          </View>
          <MultiSlider 
            values={[priceValues[0], priceValues[1]]}
            onValuesChange={this.setPriceValuesChange}
            min={0}
            max={10000000}
            step={5000}
            sliderLength={screenWidth-40}
          />

          <TouchableOpacity activeOpacity={0.8} onPress={this.onPressApplyFilter}>
            <View style={styles.buttonFilterContainer}>
              <Text numberOfLines={1} style={styles.buttonFilterText}>Apply Filter</Text>
            </View>
          </TouchableOpacity>
          <Text onPress={this.onPressResetFilter} numberOfLines={1} style={styles.resetButton}>Reset</Text>
        </ModalFilter>

        <FlatList 
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          columnWrapperStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
          numColumns={NUM_COLUMN}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          data={data}
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
  resetButton: {
    color: '#4EAA2E',
    marginVertical: 10,
    textAlign: 'center',
  },

  filterPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonFilterContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonFilterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  labelContainer: {
    backgroundColor: '#ddd',
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginRight: 5,
    borderRadius: 100,
  },
  labelText: {
    fontSize: 12,
    color: '#333'
  },
  labelSelectedContainer: {
    backgroundColor: '#4EAA2E',
  },
  labelSelectedText: {
    color: 'white'
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  modalContainer: {
    elevation: 6,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
  },
  modalHeaderContainer: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalClose: {
    position: 'absolute',
    right: 0,
  },
  modalTitle: {
    fontSize: 16,
  },
  modalSubTitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  modalButtonActioncontainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  modalButtonActionText: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  },

  container: {
    flex: 1,
    // paddingTop: statusBarHeight + 10,
  },

  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 3,
    padding: 6,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon:{
    color: '#ccc',
    marginRight: 15,
    marginLeft: 8,
  },
  searchTextInput:{
    flex: 1,
  },

  iconHeader: {
    color: '#333'
  }
});

export default ProductScreen;
