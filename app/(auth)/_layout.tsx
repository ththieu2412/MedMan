// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown:false }}>
      {/* <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="forget-pass" options={{ title: 'Forget Password' }} /> */}
    </Stack>
  );
};

export default AuthLayout;
