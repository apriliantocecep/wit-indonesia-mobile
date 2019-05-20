import React from 'react';
import { 
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const ButtonIconHeader = ({
  icon,
  onPress,
  style,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <View style={[{
      paddingVertical: 8,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    }, style]}>
      {icon}
    </View>
  </TouchableOpacity>
);

export default ButtonIconHeader;