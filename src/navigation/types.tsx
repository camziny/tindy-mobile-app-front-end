import { ICategory, IProduct } from "@/types";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type RootBottomTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  CategoriesStack: NavigatorScreenParams<CategoriesStackParamList>;
};

export type HomeStackParamList = {
  Home: undefined;
  EditProduct: {
    product: IProduct;
  };
};
export type CategoriesStackParamList = {
  Categories: undefined;
  Category: {
    id: string;
  };
  CreateCategory: {
    category?: ICategory;
  };
};

export type AppStackParamList = {
  Root: NavigatorScreenParams<RootBottomTabParamList>;
  Settings: undefined;
};

export type RootStackParamList = {
  AppStack: NavigatorScreenParams<AppStackParamList>;
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type AuthScreenNavigationType<
  RouteName extends keyof AuthStackParamList
> = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList, RouteName>,
  NativeStackNavigationProp<AppStackParamList, "Root">
>;

export type CategoriesNavigationType =
  NativeStackNavigationProp<CategoriesStackParamList>;

export type HomeScreenNavigationType =
  NativeStackNavigationProp<HomeStackParamList>;
