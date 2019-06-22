import React from 'react';
import { screens } from "../constants";
import { createBottomTabNavigator, createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import { Ionicons } from "@expo/vector-icons";

// screens
import HomeScreen from "../screens/Home/HomeScreen";
import CategoryScreen from "../screens/Category/CategoryScreen";
import SearchScreen from "../screens/Search/SearchScreen";
import ProductScreen from "../screens/Product/ProductScreen";
import ProductDetail from "../screens/ProductDetail";
import CartScreen from "../screens/Cart";

const HomeStackNavigator = createStackNavigator({
  [screens.HomeStack]: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'WIT Indonesia'
    })
  },
});

const SearchStackNavigator = createStackNavigator({
  [screens.SearchStack]: {
    screen: SearchScreen,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
});

const CategoryStackNavigator = createStackNavigator({
  [screens.CategoryStack]: {
    screen: CategoryScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Category'
    })
  },
});

const MainTabNavigator = createBottomTabNavigator({
  [screens.Home]: {
    screen: HomeStackNavigator
  },
  [screens.Search]: {
    screen: SearchStackNavigator
  },
  [screens.Category]: {
    screen: CategoryStackNavigator
  },
}, {
  initialRouteName: screens.Home,
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let IconComponent = Ionicons;
      let iconName;

      if (routeName === screens.Home) {
        iconName = `md-home`;
      } 
      else if (routeName === screens.Search) {
        iconName = `md-search`;
      }
      else if (routeName === screens.Category) {
        iconName = `md-pricetags`;
      }

      return <IconComponent name={iconName} size={25} color={tintColor} />;
    },
    tabBarOnPress: ({ navigation, defaultHandler }) => {
      if (navigation.state.index === 0) {
        const navigationInRoute = navigation.getChildNavigation(navigation.state.routes[0].key);

        if (!!navigationInRoute && navigationInRoute.isFocused() && !!navigationInRoute.state.params && !!navigationInRoute.state.params.scrollToTop) {
          navigationInRoute.state.params.scrollToTop();
        }
        else {
          navigation.navigate(navigation.state.key)
        }
      } else {
        navigation.goBack(null); // TODO: tab on press 
      }
    }
  }),
  tabBarOptions: {
    activeTintColor: '#ED3833',
    inactiveTintColor: '#888',
  }
});

const MainStackNavigator = createStackNavigator({
  [screens.MainTab]: {
    screen: MainTabNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  [screens.Product]: {
    screen: ProductScreen
  },
  [screens.ProductDetail]: {
    screen: ProductDetail,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
}, {
  initialRouteName: screens.MainTab
});

const MainDrawerNavigator = createDrawerNavigator({
  [screens.DrawerTabs]: {
    screen: MainStackNavigator
  },
  [screens.MainDrawer]: {
    screen: HomeScreen
  }
}, {
  drawerPosition: 'right',
  contentComponent: CartScreen
});

export default createAppContainer(MainDrawerNavigator);