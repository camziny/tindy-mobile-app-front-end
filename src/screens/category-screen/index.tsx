import SafeAreaWrapper from "@/components/shared/safe-area-wrapper";
import { Box, Text } from "@/utils/theme";
import React from "react";
import { CategoriesStackParamList } from "@/navigation/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import useSWR from "swr";
import { fetcher } from "@/services/config";
import { ICategory, IProduct } from "@/types";
import Loader from "@/components/shared/loader";
import NavigateBack from "@/components/shared/navigate-back";
import ProductActions from "@/components/products/product-actions";
import { FlatList } from "react-native";
import Product from "@/components/products/product";

type CategoryScreenRouteProp = RouteProp<CategoriesStackParamList, "Category">;

const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>();

  const { id } = route.params;

  const { data: category, isLoading: isLoadingCategory } = useSWR<ICategory>(
    `categories/${id}`,
    fetcher
  );

  console.log(`category`, JSON.stringify(category, null, 2));

  const {
    data: products,
    isLoading: isLoadingProducts,
    mutate: mutateProducts,
  } = useSWR<IProduct[]>(`products/products-by-categories/${id}`, fetcher, {
    refreshInterval: 1000,
  });

  if (isLoadingProducts || isLoadingCategory || !category || !products) {
    return <Loader />;
  }

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box width={40}>
          <NavigateBack />
        </Box>
        <Box height={16} />
        <Box flexDirection="row">
          <Text variant="textXl" fontWeight="700">
            {category?.icon.symbol}
          </Text>
          <Text
            variant="textXl"
            fontWeight="700"
            ml="3"
            style={{
              color: category.color.code,
            }}
          >
            {category?.name}
          </Text>
        </Box>
        <Box height={16} />
        <ProductActions categoryId={category._id} />
        <Box height={16} />
        <FlatList
          data={products}
          renderItem={({ item, index }) => {
            return <Product product={item} mutateProducts={mutateProducts} />;
          }}
          ItemSeparatorComponent={() => <Box height={14} />}
        />
      </Box>
    </SafeAreaWrapper>
  );
};

export default CategoryScreen;
