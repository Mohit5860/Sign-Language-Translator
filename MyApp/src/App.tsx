import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet} from 'react-native';
import VideoSelection from './components/VideoSelection';
import Prediction from './components/Prediction';

export type StackParamList = {
  Home: undefined;
  Prediction: {video: string};
};
const Stack = createNativeStackNavigator<StackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={VideoSelection}
          options={{title: 'Video Selection'}}
        />
        <Stack.Screen
          name="Prediction"
          component={Prediction}
          options={{title: 'Prediction'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
