import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { LogLevel, OneSignal } from "react-native-onesignal";
import { fetchActiveURL } from "./utils/api";
import { STATUS_BAR_HEIGHT } from "./utils/constant";
import ArrowIcon from "./assets/rightarrow.png";
import HomeBg from "./assets/homebg.png";

const ONE_SIGNAL_APP_ID = "21e182db-3693-4235-b74d-82e4b6fa6e2e";
export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeURL, setActiveURL] = useState([]);
  const [splashBackgroundImage, setSplashBackgroundImage] = useState("");

  const oneSignalInit = useCallback(() => {
    try {
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);

      OneSignal.initialize(ONE_SIGNAL_APP_ID);

      OneSignal.Notifications.requestPermission(true);

      OneSignal.Notifications.addEventListener("click", (event) => {
        console.log("OneSignal: notification clicked:", event);
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    oneSignalInit();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { items, splashImage } = await fetchActiveURL();
      const activeURL = items.filter((item) => item.isActive);
      if (!activeURL) return;
      setSplashBackgroundImage(splashImage);
      setActiveURL(activeURL);
      setLoading(false);
      openURLs(activeURL);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const onClickVisitCasino = async () => {
    try {
      if (!activeURL) {
        fetchData();
      } else {
        openURLs(activeURL);
      }
    } catch (error) {
      console.error("Error handling press:", error);
    }
  };
  const openURLs = async (urls) => {
    console.log(urls, "sss");
    try {
      for (const urlItem of urls) {
        if (urlItem.isActive && urlItem.url) {
          console.log("asdas");
          await Linking.openURL(urlItem.url);
        }
      }
    } catch (error) {
      console.error("Error opening URLs:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>
            Hang tight, We just need a few seconds to get you on the luckiest
            casino
          </Text>
        </View>
      ) : (
        <View style={styles.containetView}>
          <ImageBackground
            source={
              splashBackgroundImage
                ? { uri: `https:${splashBackgroundImage}` }
                : HomeBg
            }
            resizeMode="cover"
            style={styles.imageBgStyles}
          />
          <View style={styles.bottmWrap}>
            <TouchableOpacity
              style={styles.button}
              onPress={onClickVisitCasino}
            >
              <Text style={styles.btnText}>Click here to visit casino</Text>
              <Image
                source={ArrowIcon}
                resizeMode="contain"
                style={styles.arrowstyle}
                width={20}
                height={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  scrollview: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  imageBgStyles: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loadingText: {
    textAlign: "center",
    maxWidth: 200,
    fontSize: 14,
    lineHeight: 16,
    marginTop: 10,
    color: "#000",
  },
  centeredTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    width: "100%",
    height: "100%",
  },
  centeredText: {
    textAlign: "center",
    justifyContent: "center",
  },
  containetView: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexGrow: 1,
  },
  bottmWrap: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  button: {
    paddingVertical: 0,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    width: "100%",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
  },
  arrowstyle: {
    flex: 0.2,
  },
});
