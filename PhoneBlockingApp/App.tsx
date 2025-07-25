/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import BlockedNumbersScreen from './src/BlockedNumbersScreen';
import {BlockedNumbersProvider} from './src/store/BlockedNumbersContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <BlockedNumbersProvider>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <BlockedNumbersScreen />
      </View>
    </BlockedNumbersProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
