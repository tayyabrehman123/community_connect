import { Stack } from "expo-router";
import "../global.css"; // Import global styles for NativeWind
import { UserProvider } from '../components/AuthGate';
import '../i18n';

export default function Layout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </UserProvider>
  );
}











// import { Stack } from "expo-router";
// import "../global.css"; // Import global styles for NativeWind
// import AuthGate from '../components/AuthGate';
   
// export default function Layout() {
//   return (
//     <AuthGate>
//       <Stack
//         screenOptions={{
//           headerShown: false,
//           }}
//         />
//     </AuthGate>
//   );
// }
