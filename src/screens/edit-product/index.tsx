import { Box, Text, Theme } from "@/utils/theme";
import React, { useState } from "react";
import SafeAreaWrapper from "@/components/shared/safe-area-wrapper";
import NavigateBack from "@/components/shared/navigate-back";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { FlatList, Pressable, TextInput } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { HomeStackParamList } from "@/navigation/types";
import Loader from "@/components/shared/loader";
import axiosInstance, { fetcher } from "@/services/config";
import { ICategory, IProduct } from "@/types";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

type EditProductRouteType = RouteProp<HomeStackParamList, "EditProduct">;

const updateProductRequest = async (
  url: string,
  { arg }: { arg: IProduct }
) => {
  try {
    await axiosInstance.put(url + "/" + arg._id, {
      ...arg,
    });
  } catch (error) {
    console.log("error in updateProductRequest", error);
    throw error;
  }
};
const deleteProductRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.delete(url + "/" + arg.id);
  } catch (error) {
    console.log("error in updateProductRequest", error);
    throw error;
  }
};

const EditProductScreen = () => {
  const theme = useTheme<Theme>();

  const route = useRoute<EditProductRouteType>();

  const navigation = useNavigation();

  const { trigger } = useSWRMutation("products/edit", updateProductRequest);
  const { trigger: triggerDelete } = useSWRMutation(
    "products/",
    deleteProductRequest
  );

  const { product } = route.params;

  const [updatedProduct, setUpdatedProduct] = useState(product);

  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const { mutate } = useSWRConfig();

  const [isSelectingCategory, setIsSelectingCategory] =
    useState<boolean>(false);

  const { data: categories, isLoading } = useSWR<ICategory[]>(
    "categories",
    fetcher
  );

  const deleteProduct = async () => {
    try {
      await triggerDelete({
        id: product._id,
      });
      await mutate("products/");
      navigation.goBack();
    } catch (error) {
      console.log("error in deleteProduct", error);
      throw error;
    }
  };

  const updateProduct = async () => {
    try {
      if (updatedProduct.name.length.toString().trim.length > 0) {
        trigger({ ...updatedProduct });
        await mutate("products/");
        navigation.goBack();
      }
    } catch (error) {
      console.log("error in updateProduct", error);
      throw error;
    }
  };

  if (isLoading || !categories) {
    return <Loader />;
  }

  const selectedCategory = categories?.find(
    (_category) => _category._id === updatedProduct.categoryId
  );

  const handleNameChange = (text) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      name: text,
    }));
    setNameError(false);
  };

  const handlePriceChange = (text) => {
    const parsedPrice = parseFloat(text);

    if (!isNaN(parsedPrice) || text === "") {
      setUpdatedProduct((prev) => ({
        ...prev,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
      }));
      setPriceError(false);
    } else {
      setPriceError(true);
    }
  };

  return (
    <SafeAreaWrapper>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <NavigateBack />
        <Pressable onPress={deleteProduct}>
          <MaterialCommunityIcons
            name="delete"
            size={24}
            color={theme.colors.rose500}
          />
        </Pressable>
      </Box>

      <Box height={20} />
      <Box
        bg="lightGray"
        p="4"
        py="3.5"
        borderRadius="rounded-5xl"
        flexDirection="row"
        position="relative"
      >
        <TextInput
          placeholder="Add a new product"
          style={{
            paddingVertical: 8,
            paddingHorizontal: 8,
            fontSize: 20,
            width: "50%",
          }}
          maxLength={36}
          textAlignVertical="center"
          value={updatedProduct.name}
          onChangeText={handleNameChange}
          onSubmitEditing={updateProduct}
        />
        <TextInput
          placeholder="Price"
          style={{
            paddingVertical: 8,
            paddingHorizontal: 8,
            fontSize: 20,
            width: "50%",
          }}
          keyboardType="numeric"
          value={
            updatedProduct.price !== 0 ? updatedProduct.price.toString() : ""
          }
          onChangeText={handlePriceChange}
          onSubmitEditing={updateProduct}
        />
        {priceError && (
          <Text
            style={{
              color: "red",
              fontSize: 12,
              marginTop: 5,
            }}
          >
            Please enter a valid price.
          </Text>
        )}
        <Box flexDirection="row" alignItems="center">
          <Pressable
            onPress={() => {
              setIsSelectingCategory((prev) => prev);
            }}
          >
            <Box
              flexDirection="row"
              alignContent="center"
              bg="white"
              p="2"
              borderWidth={2}
              borderRadius="rounded-xl"
            >
              <Box
                width={12}
                height={12}
                borderRadius="rounded"
                borderWidth={2}
                mr="1"
                style={{
                  borderColor: selectedCategory?.color.code,
                }}
              ></Box>
              <Text
                style={{
                  color: selectedCategory?.color.code,
                }}
              >
                {selectedCategory?.name}
              </Text>
            </Box>
          </Pressable>
        </Box>

        {isSelectingCategory && (
          <Box position="absolute" right={40} bottom={-120}>
            <FlatList
              data={categories}
              renderItem={({ item, index }) => {
                return (
                  <Pressable
                    onPress={() => {
                      setUpdatedProduct((prev) => {
                        return {
                          ...prev,
                          categoryId: item._id,
                        };
                      });
                      setIsSelectingCategory(false);
                    }}
                  >
                    <Box
                      bg="gray250"
                      p="2"
                      borderTopStartRadius={
                        index === 0 ? "rounded-3xl" : "none"
                      }
                      borderTopEndRadius={index === 0 ? "rounded-3xl" : "none"}
                      borderBottomStartRadius={
                        categories.length - 1 === index ? "rounded-2xl" : "none"
                      }
                      borderBottomEndRadius={
                        categories.length - 1 === index ? "rounded-2xl" : "none"
                      }
                    >
                      <Box flexDirection="row">
                        <Text>{item.icon.symbol}</Text>
                        <Text
                          ml="2"
                          fontWeight={
                            updatedProduct.categoryId === item._id
                              ? "700"
                              : "400"
                          }
                        >
                          {item.name}
                        </Text>
                      </Box>
                    </Box>
                  </Pressable>
                );
              }}
            />
          </Box>
        )}
      </Box>
    </SafeAreaWrapper>
  );
};

export default EditProductScreen;
