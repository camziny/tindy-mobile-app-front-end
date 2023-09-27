import { IProductRequest } from "@/types";
import { Box, Text } from "@/utils/theme";
import React, { useState } from "react";
import { FlatList, Pressable, TextInput, Image, Alert } from "react-native";
import useSWR from "swr";
import Loader from "../shared/loader";
import { ICategory } from "@/types";
import axiosInstance, { fetcher } from "@/services/config";
import useSWRMutation from "swr/mutation";
import * as ImagePicker from "expo-image-picker";
import { AxiosError } from "axios";

type ProductActionsProps = {
  categoryId: string;
};
type CreateProductOptions = {
  formData: FormData;
};
interface MyImagePickerResult extends ImagePicker.ImagePickerSuccessResult {
  uri: string;
}

const createProductRequest = async (
  key: string,
  options: { arg: CreateProductOptions }
) => {
  const { formData } = options.arg;
  try {
    console.log("options before response", options);
    const response = await axiosInstance.post("products/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log("error in createProductRequest", axiosError);

    if (axiosError.response) {
      console.log("Server error response:", axiosError.response.data);
    }
    throw axiosError;
  }
};

const ProductActions = ({ categoryId }: ProductActionsProps) => {
  const [newProduct, setNewProduct] = useState<IProductRequest>({
    categoryId: categoryId,
    price: 0,
    image: "",
  });

  const [priceError, setPriceError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { data, trigger } = useSWRMutation<
    undefined,
    any,
    string,
    CreateProductOptions
  >("products/create", createProductRequest);

  const [isSelectingCategory, setIsSelectingCategory] =
    useState<boolean>(false);

  const { data: categories, isLoading } = useSWR<ICategory[]>(
    "categories",
    fetcher
  );

  if (isLoading || !categories) {
    return <Loader />;
  }

  const selectedCategory = categories?.find(
    (_category) => _category._id === newProduct.categoryId
  );

  console.log(`selectedCategory`, JSON.stringify(selectedCategory, null, 2));

  const handleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need media access to continue.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        console.log("Selected Image URI:", selectedAsset.uri);
        setImage(selectedAsset.uri);
      }
    } catch (error) {
      console.log("Error selecting image:", error);
    }
  };

  const base64ToBlob = async (
    base64: string,
    mimeType: string
  ): Promise<Blob> => {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const formDataToString = (formData: FormData) => {
    let output = "";
    formData.forEach((value, key) => {
      output += key + ": " + value + "\n";
    });
    return output;
  };

  const handleCreateProduct = async () => {
    setNameError(!newProduct.name.trim().length);
    setPriceError(newProduct.price <= 0);
    if (!nameError && !priceError && image) {
      try {
        if (newProduct.name.trim().length > 0 && image) {
          let fileExtension = image.split(".").pop();

          const blob = await uriToBlob(image);
          console.log("Generated blob:", blob);

          const formData = new FormData();
          formData.append("name", newProduct.name.trim());
          formData.append("price", newProduct.price.toString());
          formData.append("categoryId", newProduct.categoryId);
          formData.append("image", blob, `product-image.${fileExtension}`);
          console.log("Form Data:", formDataToString(formData));

          await trigger({ formData });

          resetFormData();
          setImage(null);
          Alert.alert("Success", "Product successfully added!");
        } else {
          Alert.alert(
            "Error",
            "Please ensure product name and image are provided."
          );
        }
      } catch (error) {
        console.log("Error in handleCreateProduct", error);
        Alert.alert(
          "Error",
          "An error occurred while adding the product. Please try again."
        );
      }
    } else {
      Alert.alert("Error", "Please ensure all product details are valid.");
    }
  };

  const resetFormData = () => {
    setNewProduct({
      categoryId: categoryId,
      name: "",
      price: 0,
      image: "",
    });
    setImage(null);
  };

  const handleNameChange = (text) => {
    setNewProduct((prev) => ({
      ...prev,
      name: text,
    }));
    setNameError(false);
  };

  const handlePriceChange = (text) => {
    const isValidPrice = /^\d+(\.\d{0,2})?$/.test(text);
    if (isValidPrice || text === "") {
      setNewProduct((prev) => ({
        ...prev,
        price: text === "" ? 0 : parseFloat(text),
      }));
      setPriceError(false);
    } else {
      setPriceError(true);
    }
  };

  const submitButton = () => {
    handleCreateProduct();
  };

  return (
    <Box>
      <Text
        style={{
          paddingVertical: 8,
          paddingHorizontal: 8,
          fontSize: 18,
          width: "50%",
          fontWeight: 600,
        }}
      >
        Add a Product
      </Text>
      <Box
        bg="lightGray"
        p="4"
        py="3.5"
        borderRadius="rounded-5xl"
        flexDirection="row"
        position="relative"
      >
        <TextInput
          placeholder="Name"
          style={{
            paddingVertical: 8,
            paddingHorizontal: 8,
            fontSize: 20,
            width: "50%",
          }}
          maxLength={36}
          textAlignVertical="center"
          value={newProduct.name}
          onChangeText={handleNameChange}
          onSubmitEditing={handleCreateProduct}
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
          value={newProduct.price !== 0 ? newProduct.price.toString() : ""}
          onChangeText={handlePriceChange}
          onSubmitEditing={handleCreateProduct}
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
        <Pressable onPress={handleImageSelect}>
          <Text>Choose Image</Text>
        </Pressable>
        {image && (
          <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
        )}
        {/* <Box flexDirection="row" alignItems="center">
          <Pressable
            onPress={() => {
              setIsSelectingCategory((prev) => !prev);
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
        </Box> */}
      </Box>
      <Box flexDirection="row" justifyContent="center" mt="5">
        <Pressable
          onPress={submitButton}
          style={{
            backgroundColor: "#3498db",
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Add Product</Text>
        </Pressable>
      </Box>
      <Box>
        <Text
          style={{
            paddingVertical: 8,
            paddingHorizontal: 8,
            fontSize: 18,
            width: "50%",
            fontWeight: 600,
          }}
        >
          Current Listings
        </Text>
      </Box>
      {isSelectingCategory && (
        <Box position="absolute" right={40} bottom={-120}>
          <FlatList
            data={categories}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  onPress={() => {
                    setNewProduct((prev) => {
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
                    borderTopStartRadius={index === 0 ? "rounded-3xl" : "none"}
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
                          newProduct.categoryId === item._id ? "700" : "400"
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
  );
};

export default ProductActions;
