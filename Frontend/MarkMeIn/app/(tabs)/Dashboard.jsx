import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { API_URLS } from "../config/apiUrl";
import ToastManager, { Toast } from 'toastify-react-native'
import LinearGradientColor from "../components/LinearGradient";
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function Dashboard() {
  const token = useAuthStore((s) => s.token);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading , setIsLoading] = useState(false);
  const [presentCount ,setPresentCount] =useState(0);
  useEffect(() => {
    fetchMonthlyAttendance();
  }, [month, year]);
  const handleMonthlyReport =()=>{
    Toast.warn('Reports will be downloded in next update')
  }
  const fetchMonthlyAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_URLS.MONTHLY}?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setDays(response.data.days);
      
        setPresentCount(response.data.summary.present)
      }
    } catch (err) {
      console.log("Monthly attendance error", err);
    }
    finally{
      setIsLoading(false);
    }
  };

  const getDayColor = (status, day) => {
    if (day === "Sat" || day === "Sun") return "bg-yellow-400";

    switch (status) {
      case "PRESENT":
        return "bg-green-500";
      case "ABSENT":
        return "bg-red-500";
      case "HOLIDAY":
        return "bg-yellow-400";
      case "OFF":
        return "bg-gray-300";
      default:
        return "bg-gray-200";
    }
  };

  const openDayModal = (day) => {
    setSelectedDay(day);
    setModalVisible(true);
  };
  if(isLoading){
    return(<ActivityIndicator size={"large"}/>)
  }
  return (
    <SafeAreaView className="flex-1 bg-background px-4 pb-28">
      <ToastManager />
      <LinearGradientColor height={25}/>
      {/* Header */}
      <Text className="text-xl font-bold text-white mb-4">
        Monthly Attendance
      </Text>

      {/* Month Selector */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity
          onPress={() => setMonth(month === 1 ? 12 : month - 1)}
          className="px-3 py-2 bg-primary rounded-lg"
        >
          <Text className="text-white text-lg">◀</Text>
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-white">
          {MONTHS[month - 1]} {year}
        </Text>

        <TouchableOpacity
          onPress={() => setMonth(month === 12 ? 1 : month + 1)}
          className="px-3 py-2 bg-primary rounded-lg"
        >
          <Text className="text-white text-lg">▶</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <FlatList
        data={days}
        numColumns={7}
        keyExtractor={(item) => item.date}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openDayModal(item)}
            className="items-center mb-4 w-[13%]"
          >
            <Text className="text-[10px] text-gray-500">
              {item.day}
            </Text>

            <Text className="text-xs font-semibold text-gray-700">
              {item.date.split("-")[2]}
            </Text>

            <View
              className={`w-8 h-8 mt-1 rounded-lg ${getDayColor(
                item.status,
                item.day
              )}`}
            />
          </TouchableOpacity>
        )}
      />
      <View style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between" }} className="w-100 rounded p-4 border border-blue-200">
        <Text className="font-large text-white p-2 bg-primary p-2 font-bold rounded">Total Present :{presentCount}</Text>
        <TouchableOpacity onPress ={handleMonthlyReport}className="bg-red-500 p-2 rounded">
          <Text className="text-white"> Download Monthly Report</Text>
        </TouchableOpacity>
      </View>
      {/* Legend */}
      <View className="flex-row flex-wrap justify-center gap-4 mt-6">
        <Legend color="bg-green-500" label="Present" />
        <Legend color="bg-red-500" label="Absent" />
        <Legend color="bg-yellow-400" label="Holiday" />
        <Legend color="bg-yellow-400" label="Weekend" />
      </View>

      {/* Day Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-center px-4">
          <View className="bg-white rounded-2xl p-5">

            <Text className="text-lg font-bold text-primary mb-2">
              {selectedDay?.day}, {selectedDay?.date}
            </Text>

            <DetailRow label="Status" value={selectedDay?.status} />

            {selectedDay?.punchInTime && (
              <DetailRow
                label="Punch In"
                value={new Date(selectedDay.punchInTime).toLocaleTimeString()}
              />
            )}

            {selectedDay?.punchOutTime && (
              <DetailRow
                label="Punch Out"
                value={new Date(selectedDay.punchOutTime).toLocaleTimeString()}
              />
            )}

            {selectedDay?.workSummary && (
              <DetailRow
                label="Work Summary"
                value={selectedDay.workSummary}
                multiline
              />
            )}

            {selectedDay?.holidayName && (
              <DetailRow
                label="Holiday"
                value={selectedDay.holidayName}
              />
            )}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 bg-primary py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Close
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const Legend = ({ color, label }) => (
  <View className="flex-row items-center">
    <View className={`w-4 h-4 rounded ${color} mr-1`} />
    <Text className="text-xs text-gray-700">{label}</Text>
  </View>
);

const DetailRow = ({ label, value, multiline }) => (
  <View className="mb-2">
    <Text className="text-xs text-gray-500">{label}</Text>
    <Text
      className={`text-sm text-gray-800 ${
        multiline ? "leading-5" : ""
      }`}
    >
      {value}
    </Text>
  </View>
);
