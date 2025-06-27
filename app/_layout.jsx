import { Stack } from "expo-router";
import "../global.css"; // Import global styles for NativeWind
import AuthGate from '../components/AuthGate';
   
export default function Layout() {
  return (
    <AuthGate>
      <Stack
        screenOptions={{
          headerShown: false,
          }}
        />
    </AuthGate>
  );
}
