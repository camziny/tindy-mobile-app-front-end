import SafeAreaWrapper from "@/components/shared/safe-area-wrapper";
import { AnimatedText, Box, Text } from "@/utils/theme";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/services/config";
import useUserGlobalStore from "@/store/useUserGlobalStore";
import ProductActions from "@/components/products/product-actions";
import Loader from "@/components/shared/loader";
import { FlatList } from "react-native";
import { ICategory, IProduct } from "@/types";
import Product from "@/components/products/product";
import { ZoomIn, ZoomInEasyDown } from "react-native-reanimated";

const HomeScreen = () => {
  const { user } = useUserGlobalStore();
  const {
    data: products,
    isLoading,
    mutate: mutateProducts,
  } = useSWR<IProduct[]>("products/", fetcher);

  if (isLoading || !products) {
    return <Loader />;
  }

  return (
    <SafeAreaWrapper>
      <Box>
        <AnimatedText
          variant="textXl"
          fontWeight="500"
          entering={ZoomInEasyDown.delay(500).duration(700)}
        >
          Hello {user?.name}{" "}
        </AnimatedText>
        <Box height={26} />
        <ProductActions categoryId="" />
      </Box>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <Product product={item} mutateProducts={mutateProducts} />
        )}
        ItemSeparatorComponent={() => <Box height={14} />}
      />
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
