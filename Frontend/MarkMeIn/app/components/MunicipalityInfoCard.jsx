import { View, Text, ActivityIndicator } from "react-native";

/**
 * Props:
 * - municipalities: array from useMyMunicipalities()
 * - loading: boolean
 */
export default function MunicipalityInfoCard({ municipalities, loading }) {
  if (loading) {
    return (
      <View className="bg-white rounded-xl p-4 mt-4 items-center">
       <Text> Municipality loading ...</Text>
      </View>
    );
  }

  if (!municipalities || municipalities.length === 0) {
    return (
      <View className="bg-red-100 border border-red-300 rounded-xl p-4 mt-4">
        <Text className="text-red-700 font-semibold text-center">
          Municipality not assigned
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-4 mt-4 shadow">
      <Text className="text-sm font-semibold text-gray-700 mb-3">
        Assigned Municipality
      </Text>

      {municipalities.map((m, index) => (
        <View
          key={m._id}
          className={`rounded-xl p-3 mb-3 ${
            index === 0
              ? "bg-blue-50 border border-blue-200"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <Text className="font-semibold text-gray-800">
            {m.name}
          </Text>

          <Text className="text-xs text-gray-600 mt-1">
            {m.city}, {m.state}
          </Text>

          <View className="mt-2 self-start px-2 py-1 rounded-full bg-gray-200">
            <Text className="text-[10px] text-gray-700 font-semibold">
              {index === 0 ? "Primary Municipality" : "Extra Charge"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
