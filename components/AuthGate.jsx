import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useRootNavigationState } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('UserProvider: Loading user from AsyncStorage');
        const userData = await AsyncStorage.getItem('user');
        console.log('UserProvider: User data from storage:', userData);
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('UserProvider: Parsed user:', parsedUser);
          setUser(parsedUser);
        }
      } catch (e) {
        console.log('Error loading user from AsyncStorage:', e);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default function AuthGate({ children }) {
  const { user, loading } = React.useContext(UserContext);
  const router = useRouter();
  const navigationState = useRootNavigationState();

  console.log('AuthGate:', { loading, user, navReady: !!navigationState?.key });

  React.useEffect(() => {
    if (!loading && !user && navigationState?.key) {
      console.log('AuthGate: No user found, redirecting to login');
      router.replace('/login');
    } else if (!loading && user && navigationState?.key) {
      console.log('AuthGate: User found:', user.role);
    }
  }, [loading, user, navigationState]);

  if (loading || !navigationState?.key) {
    console.log('AuthGate: Loading or navigation not ready');
    router.replace('/login');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    console.log('AuthGate: No user, returning null');
    return null;
  }

  console.log('AuthGate: Rendering children for user:', user.role);
  return <>{children}</>;
}



// import React, { createContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter, useRootNavigationState } from 'expo-router';
// import { ActivityIndicator, View } from 'react-native';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const router = useRouter()
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         console.log('UserProvider: Loading user from AsyncStorage');
//         const userData = await AsyncStorage.getItem('user');
//         console.log('UserProvider: User data from storage:', userData);
//         if (userData) {
//           const parsedUser = JSON.parse(userData);
//           console.log('UserProvider: Parsed user:', parsedUser);
//           setUser(parsedUser);
//         } else {
//           setUser("null");
//           setLoading(false);
//           router.push(`/login`)
//         }
//       } catch (e) {
//         console.log('Error loading user from AsyncStorage:', e);
//         setUser(null);
//       }
//       setLoading(false);
//     };
//     loadUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default function AuthGate({ children }) {
//   const { user, loading } = React.useContext(UserContext);
//   const router = useRouter();
//   const navigationState = useRootNavigationState();

//   // Debug log for navigationState
//   console.log('AuthGate navigationState:', navigationState);

//   React.useEffect(() => {
//     if (loading && user && navigationState?.key) {
//       console.log(loading, user)
//       console.log('AuthGate: No user found, redirecting to login');
//       router.replace('/login');
//     } else if (!loading && user && navigationState?.key) {
//       console.log('AuthGate: User found:', user.role);
//     }
//   }, [loading, user, navigationState]);

//   if (loading || !navigationState?.key) {
//     console.log('AuthGate: Loading or navigation not ready');
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!user) {
//     console.log('AuthGate: No user, returning null');
//     return null;
//   }

//   console.log('AuthGate: Rendering children for user:', user.role);
//   return <>{children}</>;
// } 



