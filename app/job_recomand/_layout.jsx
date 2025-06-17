import { Stack } from "expo-router";

export default function JobLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add-job" />
    </Stack>
  );
}