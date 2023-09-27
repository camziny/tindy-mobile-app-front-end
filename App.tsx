import { ThemeProvider } from "@shopify/restyle";
import theme from "@/utils/theme";
import Navigation from "@/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import useUserGlobalStore from "@/store/useUserGlobalStore";
import { useEffect } from "react";

export default function App() {
  const { user, updateUser } = useUserGlobalStore();
  // console.log(`user`, JSON.stringify(user, null, 2));

  // useEffect(() => {
  //   updateUser({
  //     email: "timm@test.com",
  //     name: "tim",
  //   });
  //   return () => {};
  // }, []);
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <Navigation />
        <StatusBar translucent />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
