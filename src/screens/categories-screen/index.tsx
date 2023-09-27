import React from "react";
import { FlatList } from "react-native";
import axiosInstance from "@/services/config";
import SafeAreaWrapper from "@/components/shared/safe-area-wrapper";
import { Box, Text } from "@/utils/theme";
import Loader from "@/components/shared/loader";
import Category from "@/components/categories/category";
import CreateNewList from "@/components/categories/create-new-list";
import { ICategory } from "@/types";
import useSWR, { mutate } from "swr";

const CategoriesScreen = () => {
  const { data, error } = useSWR(
    "categories/",
    (url) => axiosInstance.get(url).then((response) => response.data),
    {
      refreshInterval: 1000,
    }
  );
  const isLoading = !data && !error;

  if (isLoading) {
    return <Loader />;
  }

  const renderItem = ({ item }: { item: ICategory }) => (
    <Category category={item} />
  );

  const handleCategoryCreatedOrDeleted = () => {
    mutate("categories/");
  };

  return (
    <SafeAreaWrapper>
      <Box flex={1} px="4">
        <Text variant="textXl" fontWeight="700" mb="10">
          Categories
        </Text>

        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Box height={14} />}
          keyExtractor={(item) => item._id}
          ListFooterComponent={() => (
            <Box mt="6" p="6">
              <CreateNewList
                onCategoryChange={handleCategoryCreatedOrDeleted}
              />
            </Box>
          )}
        />
      </Box>
    </SafeAreaWrapper>
  );
};

export default CategoriesScreen;
