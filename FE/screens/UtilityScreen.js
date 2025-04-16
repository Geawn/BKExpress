import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

const UtilityScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`https://www.vietcombank.com.vn/api/exchangerates?date=${today}`);
      const data = await response.json();
      
      if (data.Data) {
        // Format the rates data and take only needed currencies
        const formattedRates = data.Data
          .filter(item => ['USD', 'EUR', 'GBP', 'JPY', 'HKD', 'AUD', 'NZD', 'CAD', 'SGD', 'THB', 'KRW'].includes(item.currencyCode))
          .map(item => ({
            currency: item.currencyCode,
            rate: parseFloat(item.sell).toFixed(2)
          }));
        
        setExchangeRates(formattedRates);
        setLastUpdated(new Date(data.UpdatedDate).toLocaleDateString('vi-VN'));
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}
    bounces={true}
    overScrollMode="always">
      <Text style={styles.header}>Tiện ích</Text>

      {/* Phần lịch Việt */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LỊCH VIỆT</Text>
        <View style={styles.calendarHeader}>
          <Text style={styles.dayName}>{selectedDate.toLocaleDateString('vi-VN', { weekday: 'long' }).toUpperCase()}</Text>
          <Text style={styles.dateNumber}>{selectedDate.getDate()}</Text>
          <Text style={styles.monthYear}>
            Tháng {selectedDate.getMonth() + 1} - {selectedDate.getFullYear()}
          </Text>
        </View>
        
        <Calendar
          style={styles.calendar}
          current={getLocalDateString(selectedDate)} // Hiển thị đúng ngày GMT+7
          markedDates={{
            [getLocalDateString(selectedDate)]: { selected: true } // Đánh dấu đúng
          }}
          onDayPress={(day) => {
            setSelectedDate(new Date(day.dateString)); // Không cần chỉnh timezone vì day.dateString đã là YYYY-MM-DD
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

      {/* Phần tỷ giá ngoại tệ */}
      <View style={[styles.section, { marginBottom: 1 }]}>
        <Text style={styles.sectionTitle}>THAM KHẢO TỶ GIÁ</Text>
        <Text style={styles.updateDate}>Cập nhật ngày {lastUpdated}</Text>
        
        {loading ? (
          <Text style={styles.loadingText}>Đang tải tỷ giá...</Text>
        ) : (
          <View style={styles.ratesContainer}>
            <View style={styles.ratesHeader}>
              <Text style={styles.ratesHeaderText}>Ngoại tệ</Text>
              <Text style={styles.ratesHeaderText}>Tỷ giá bán</Text>
            </View>
            
            {exchangeRates.map((item, index) => (
              <View key={index} style={styles.rateRow}>
                <Text style={styles.currencyText}>{item.currency}</Text>
                <Text style={styles.rateText}>
                  {parseFloat(item.rate).toLocaleString('vi-VN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} VND
                </Text>
              </View>
            ))} 
          </View>
        )}
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
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 1,
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
  calendar: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  updateDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 16,
  },
  ratesContainer: {
    marginTop: 8,
  },
  ratesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  ratesHeaderText: {
    fontWeight: 'bold',
    color: '#333',
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  currencyText: {
    color: '#333',
  },
  rateText: {
    color: '#333',
    fontWeight: '500',
  },
});

export default UtilityScreen;