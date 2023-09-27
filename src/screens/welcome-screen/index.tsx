import React from "react";
import { Box, Text } from "@/utils/theme";
import { useNavigation } from "@react-navigation/native";
import { AuthScreenNavigationType } from "@/navigation/types";
import SafeAreaWrapper from "@/components/shared/safe-area-wrapper";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import Button from "@/components/shared/button";

const TINDY_IMAGE = "";

const WelcomeScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationType<"Welcome">>();
  const navigateToSignInScreen = () => {
    navigation.navigate("SignIn");
  };
  const navigateToSignUpScreen = () => {
    navigation.navigate("SignUp");
  };
  return (
    <SafeAreaWrapper>
      <LinearGradient
        colors={[
          "#ffffff",
          "#fcecff",
          "#f8daff",
          "#fae2ff",
          "#fae2ff",
          "#ffffff",
        ]}
        style={{ flex: 1 }}
      >
        <Box flex={1} justifyContent="center">
          <Box alignItems="center" mb="3.5">
            <Image
              source={{
                uri: TINDY_IMAGE,
                width: 150,
                height: 150,
              }}
            />
          </Box>
          <Text textAlign="center" variant="textXl" fontWeight="700">
            myTindy
          </Text>
          <Text
            textAlign="center"
            variant="textXs"
            fontWeight="700"
            color="gray5"
          >
            connecting the world with local craftspeople
          </Text>
          <Box my="3.5" mx="10">
            <Button
              label="Login to your account"
              onPress={navigateToSignInScreen}
            />
          </Box>
          <Box my="3.5" mx="10">
            <Button
              label="Become a myTindy Artisan"
              onPress={navigateToSignUpScreen}
            />
          </Box>
        </Box>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

export default WelcomeScreen;
