import Button from "@/components/shared/button";
import SafeAreaWrapper from "@/components/shared/safe-area-wrapper";
import { AuthScreenNavigationType } from "@/navigation/types";
import { Box, Text } from "@/utils/theme";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import Input from "@/components/shared/input";
import { Pressable } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { registerUser } from "@/services/api";
import { IUser } from "@/types";

const SignUpScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationType<"SignUp">>();
  const navigateToSignInScreen = () => {
    navigation.navigate("SignIn");
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: IUser) => {
    try {
      const { email, name, password } = data;
      await registerUser({
        email,
        name,
        password,
      });
      navigateToSignInScreen();
    } catch (error) {
      throw error;
    }
  };

  return (
    <SafeAreaWrapper>
      <Box flex={1} px="5.5" mt={"13"}>
        <Text variant="textXl" fontWeight="700">
          Welcome to myTindy!
        </Text>
        <Text variant="textXl" fontWeight="700" mb="6">
          Join our community of Artisans
        </Text>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Name"
              error={errors.name}
            />
          )}
          name="name"
        />
        <Box mb="6" />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              error={errors.email}
            />
          )}
          name="email"
        />
        <Box mb="6" />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              error={errors.name}
              secureTextEntry
            />
          )}
          name="password"
        />
        <Box mt="5.5" />
        <Pressable onPress={navigateToSignInScreen}>
          <Text color="primary" textAlign="right">
            Log in?
          </Text>
        </Pressable>
        <Box mb="5.5" />

        <Button label="Register" onPress={handleSubmit(onSubmit)} uppercase />
      </Box>
    </SafeAreaWrapper>
  );
};

export default SignUpScreen;
