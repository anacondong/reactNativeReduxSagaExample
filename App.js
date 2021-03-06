import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import AppNavigator from './navigation/AppNavigator'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas';
import { theme } from './constants/Theme'
import { ThemeProvider } from 'styled-components'


const logger = store => next => action => {
  console.log('prev state', store.getState())
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(logger, sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return null;
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <AppNavigator />
            </Provider>
          </ThemeProvider>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
