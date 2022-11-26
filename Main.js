import { SafeAreaView, View } from 'react-native';
import { NativeBaseProvider } from "native-base";
import { getCachedUserProfile } from "./services/GlobalConfig";
import { useDispatch } from "react-redux";
import { setUserProfile } from './redux/UserProfileSlice';
import { DefaultTheme } from './configurations/DefaultTheme';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { AppNavigator } from './configurations/AppNavigator';
import Loader from "./components/Loader";

export default function Main() {

  const dispatch = useDispatch();

  const [fontsLoaded, updateFontState] = useState(false);
  const [cacheLoaded, setCacheLoaded] = useState(false);

  const _loadFontsAsync = async () => {
    await Font.loadAsync({
      'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
      'PoppinsMedium': require('./assets/fonts/Poppins-Medium.ttf'),
      'PoppinsSemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
      'PoppinsBold': require('./assets/fonts/Poppins-Bold.ttf'),
      'ChangaOne': require('./assets/fonts/ChangaOne-Regular.ttf'),
    })
    updateFontState(true);
  }

  const loadCachedData = async () => {
    await getCachedUserProfile().then(data => {
      if (data == null || data == undefined) {
        data = null;
      }
      else {
        dispatch(setUserProfile(data));
      }
    });
  }

  useEffect(() => {
    _loadFontsAsync();

    if (cacheLoaded == false) {
      setCacheLoaded(true);
      loadCachedData();
    }
  }, [fontsLoaded, cacheLoaded,])

  if (fontsLoaded == false || cacheLoaded == false) {
    return (
      <SafeAreaView style={{ flex: 1, }}>
        <NativeBaseProvider theme={DefaultTheme}>
          <View alignItems="center" justifyContent="center" flex="1" background="#f8f9fa">
            <Loader></Loader>
          </View>
        </NativeBaseProvider>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NativeBaseProvider theme={DefaultTheme}>        
        <AppNavigator />        
      </NativeBaseProvider>
    </SafeAreaView>
  )
}
