import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import MyButton from "@/components/MyButton";
import FormField from "@/components/FormField";
import { useAuth } from "@/context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay";
// import { login } from "@/services/api";

const SignIn = () => {
  const router = useRouter();
  const { setUser, user, login, isLoading } = useAuth();

  const [userName, setUserName] = useState("ththieu");
  const [password, setPassword] = useState("24122003");
  const [error, setError] = useState<string>("");

  const validateLogin = async () => {
    if (userName === "" || password === "") {
      setError("Please enter both username and password");
    } else {
      try {
        const response = await login(userName, password);
        console.log("sign-in response: ", response);
        if (response && response.token) {
          setUser({
            token: response.token,
            username: response.username,
            role: response.role,
            employee_id: response.employee_id,
            image: response.image || null,
          });
          router.replace("/(tabs)");
        } else {
          setError("Invalid username or password");
        }
      } catch (error: any) {
        // Lỗi xảy ra từ login
        console.error("Login error:", error.message);
        setError(error.message || "An error occurred during login");
      }
    }
  };

  const onForgotPassword = () => {
    router.push("/forget-pass");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0055A8" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <Spinner visible={isLoading} />
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/login.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.form}>
            <FormField
              title={"Username"}
              placeholder={"Enter your username"}
              value={userName}
              onChangeText={setUserName}
            />
            <FormField
              title={"Password"}
              placeholder={"Enter your password"}
              value={password}
              onChangeText={setPassword}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={styles.forgetPass}>Forget Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <MyButton title={"Login"} onPress={validateLogin} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: "80%",
    height: 250,
    marginBottom: 30,
  },
  form: {
    width: "100%",
    padding: 20,
    gap: 20,
  },
  forgetPass: {
    textAlign: "right",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginTop: -10,
  },
  errorText: {
    color: "#FF6347", // Thay đổi màu lỗi thành màu đỏ nhẹ nhàng (tomato)
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
  },
});
