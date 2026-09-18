import { APP_NAME } from "@storex/shared";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import "./global.css";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900 px-6">
      <StatusBar style="light" />
      <View className="w-full max-w-sm rounded-2xl bg-slate-800 p-6 border border-slate-700 shadow-lg">
        <Text className="text-3xl font-bold text-sky-400 text-center mb-2">{APP_NAME} Mobile</Text>
        <Text className="text-slate-400 text-center mb-6">React Native + Expo + NativeWind</Text>

        <View className="space-y-3">
          <View className="flex-row items-center justify-between py-2 border-b border-slate-700">
            <Text className="text-slate-300 font-medium">Framework</Text>
            <Text className="text-emerald-400 font-semibold">Expo SDK 57</Text>
          </View>
          <View className="flex-row items-center justify-between py-2 border-b border-slate-700">
            <Text className="text-slate-300 font-medium">Styling</Text>
            <Text className="text-emerald-400 font-semibold">NativeWind v5</Text>
          </View>
          <View className="flex-row items-center justify-between py-2 border-b border-slate-700">
            <Text className="text-slate-300 font-medium">Shared Package</Text>
            <Text className="text-emerald-400 font-semibold">@storex/shared</Text>
          </View>
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-slate-300 font-medium">Runtime</Text>
            <Text className="text-emerald-400 font-semibold">React Native 0.86</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
