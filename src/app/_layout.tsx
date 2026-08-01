import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, ThemeProvider } from "expo-router";
import { cssInterop } from "nativewind";
import { useState } from "react";
import { useColorScheme } from "react-native";
import "../../global.css";
import { DARK_THEME, LIGHT_THEME } from "../../theme";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  //*nativewind uses this to map Classname string into relative style on runtime
  cssInterop(Ionicons, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true, //* extracts style from ex:- bg-card, and applies to color style
      },
    },
  });

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={isDark ? DARK_THEME : LIGHT_THEME}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </ThemeProvider>
        <PortalHost />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
