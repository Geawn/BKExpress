import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BackendUrlModal from '../components/BackendUrlModal';
import { getBackendUrl } from '../config/backend';
import { useDevBackendUrl } from '../config/url';
import ErrorPopup from '../components/ErrorPopup.js';

const SettingsScreen = () => {
  const [showBackendModal, setShowBackendModal] = useState(false);
  const [backendUrl, setBackendUrl] = useState('');

  const handleBackendUrlSave = (newUrl) => {
    setBackendUrl(newUrl);
    setShowBackendModal(false);
    // Có thể thêm logic lưu URL vào AsyncStorage hoặc gọi API ở đây
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => { setShowBackendModal(true) }}
      >
        <Text style={styles.buttonText}>Thay đổi Backend URL</Text>
      </TouchableOpacity>

      <BackendUrlModal
        visible={showBackendModal}
        onClose={() => setShowBackendModal(false)}
        onSave={handleBackendUrlSave}
        isRequired={false}
        initialUrl={backendUrl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;