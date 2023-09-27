import { AnimatedBox, Box, Text } from "@/utils/theme";
import React from "react";
import { IProduct } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Image } from "react-native";
import useSWRMutation from "swr/mutation";
import axiosInstance from "@/services/config";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationType } from "@/navigation/types";
import { FadeIn, FadeInLeft, FadeInRight } from "react-native-reanimated";
import { useTheme } from "@shopify/restyle";

type ProductProps = {
  product: IProduct;
  mutateProducts: () => Promise<IProduct[] | undefined>;
};

interface IProductStatusRequest {
  id: string;
}

const toggleProductStatusRequest = async (
  url: string,
  { arg }: { arg: IProductStatusRequest }
) => {
  try {
    await axiosInstance.put(url + "/" + arg.id, {
      ...arg,
    });
  } catch (error) {
    console.log("error in toggleProductStatusRequest", error);
    throw error;
  }
};

const Product = ({ product }: ProductProps) => {
  const { trigger } = useSWRMutation(
    "products/update",
    toggleProductStatusRequest
  );

  const navigation = useNavigation<HomeScreenNavigationType>();

  const toggleProductStatus = async () => {
    try {
      const _updatedProduct = {
        id: product._id,
      };
      await trigger(_updatedProduct);
    } catch (error) {
      console.log("error in toggleProductStatus", error);
      throw error;
    }
  };

  const navigateToEditProduct = () => {
    navigation.navigate("EditProduct", {
      product,
    });
  };

  const theme = useTheme();

  return (
    <AnimatedBox entering={FadeInRight} exiting={FadeInLeft}>
      <Pressable
        onPress={toggleProductStatus}
        onLongPress={navigateToEditProduct}
      >
        <Box
          p="4"
          bg="lightGray"
          borderRadius="rounded-5xl"
          flexDirection="column"
          alignItems="center"
        >
          <Text variant="text2Xl">{product.name}</Text>
          <Text variant="textXl" mt="2">
            ${product.price}
          </Text>
          {product.image && (
            <Image
              source={{ uri: product.image }}
              style={{
                width: theme.spacing["18"],
                height: theme.spacing["18"],
                marginTop: 10,
              }}
            />
          )}
        </Box>
      </Pressable>
    </AnimatedBox>
  );
};

export default Product;
