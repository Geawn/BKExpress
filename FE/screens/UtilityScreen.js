import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';

const UtilityScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lunarDate, setLunarDate] = useState('');

  // Hàm chuyển đổi ngày dương sang âm lịch (giả lập)
  const convertToLunarDate = (date) => {
    const lunarMonths = [
      'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 
      'Bảy', 'Tám', 'Chín', 'Mười', 'Một', 'Chạp'
    ];
    const lunarDays = [
      'Mồng 1', 'Mồng 2', 'Mồng 3', 'Mồng 4', 'Mồng 5', 
      'Mồng 6', 'Mồng 7', 'Mồng 8', 'Mồng 9', 'Mồng 10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
    ];
    
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    return `Ngày ${lunarDays[day % 30]} tháng ${lunarMonths[month]} (ÂL), năm ${year}`;
  };

  // Lấy dữ liệu thời tiết từ API
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Thay thế bằng API thời tiết thực tế như OpenWeatherMap
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather?q=Hanoi&units=metric&appid=YOUR_API_KEY'
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
    setLunarDate(convertToLunarDate(selectedDate));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Tiện ích</Text>
      
      {/* Phần dự báo thời tiết */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DỰ BÁO THỜI TIẾT</Text>
        <View style={styles.weatherContainer}>
          {weatherData ? (
            <>
              <Text style={styles.weatherTemp}>{Math.round(weatherData.main.temp)}°C</Text>
              <Text style={styles.weatherDesc}>{weatherData.weather[0].description}</Text>
              <View style={styles.weatherDetails}>
                <Text>Độ ẩm: {weatherData.main.humidity}%</Text>
                <Text>Gió: {weatherData.wind.speed} m/s</Text>
              </View>
            </>
          ) : (
            <Text>Đang tải dữ liệu thời tiết...</Text>
          )}
        </View>
      </View>

      {/* Phần lịch Việt */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LỊCH VIỆT</Text>
        <View style={styles.calendarHeader}>
          <Text style={styles.dayName}>THỨ TƯ</Text>
          <Text style={styles.dateNumber}>{selectedDate.getDate()}</Text>
          <Text style={styles.monthYear}>
            Th{selectedDate.getMonth() + 1} - {selectedDate.getFullYear()}
          </Text>
          <Text style={styles.lunarDate}>{lunarDate}</Text>
        </View>
        
        <Calendar
          style={styles.calendar}
          current={selectedDate.toISOString().split('T')[0]}
          markedDates={{
            [selectedDate.toISOString().split('T')[0]]: { selected: true }
          }}
          onDayPress={(day) => {
            setSelectedDate(new Date(day.dateString));
            setLunarDate(convertToLunarDate(new Date(day.dateString)));
          }}
          theme={{
            calendarBackground: '#fff',
            selectedDayBackgroundColor: '#ff6b6b',
            selectedDayTextColor: '#fff',
            todayTextColor: '#ff6b6b',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#fff',
            arrowColor: '#ff6b6b',
            monthTextColor: '#ff6b6b',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ff6b6b',
  },
  weatherContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  weatherDesc: {
    fontSize: 16,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginVertical: 4,
  },
  monthYear: {
    fontSize: 14,
    color: '#666',
  },
  lunarDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  calendar: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default UtilityScreen;