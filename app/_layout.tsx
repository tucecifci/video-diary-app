import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { queryClient } from "@/lib/queryClient";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="crop" options={{ headerShown: false }} />
          <Stack.Screen name="crop/metadata" options={{ headerShown: false }} />
          <Stack.Screen
            name="video/detailPage"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="video/editPage"
            options={{ headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
