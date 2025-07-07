import { Stack } from "expo-router";
import "../global.css"; // Import global styles for NativeWind
import AuthGate, { UserProvider } from '../components/AuthGate';
   
export default function Layout() {
  return (
    <UserProvider>
      {/* <AuthGate> */}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      {/* </AuthGate> */}
    </UserProvider>
  );
}
