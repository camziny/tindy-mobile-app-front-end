import React from "react";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Box, Text, Theme } from "@/utils/theme";
import { CategoriesNavigationType } from "@/navigation/types";
import { useTheme } from "@shopify/restyle";

interface CreateNewListProps {
  onCategoryChange: () => void;
}

const CreateNewList: React.FC<CreateNewListProps> = ({ onCategoryChange }) => {
  const navigation = useNavigation<CategoriesNavigationType>();
  const theme = useTheme<Theme>();

  const navigateToCreateCategory = () => {
    navigation.navigate("CreateCategory", {
      onCategoryChange: onCategoryChange,
    });
  };

  return (
    <Pressable onPress={navigateToCreateCategory}>
      <Box p="4" bg="lightGray" borderRadius="rounded-5xl" flexDirection="row">
        <Feather name="plus" size={24} color={theme.colors.gray500} />
        <Text variant="textXl" fontWeight="600" color="gray650" ml="3">
          Create New List
        </Text>
      </Box>
    </Pressable>
  );
};

export default CreateNewList;
