import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { setBackendUrl } from '../config/backend';

export default function BackendUrlModal({ visible, onClose, onSave, isRequired, initialUrl }) {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  const handleSave = async () => {
    if (url.trim()) {
      await setBackendUrl(url.trim());
      onSave(url.trim());
    }
  };

  const handleBackdropPress = () => {
    if (!isRequired) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleBackdropPress}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cấu hình Backend URL</Text>
              <TextInput
                style={styles.input}
                value={url}
                onChangeText={setUrl}
                placeholder="Nhập URL backend"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.buttonContainer}>
                {!isRequired && (
                  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                    <Text style={styles.buttonText}>Hủy</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton, isRequired && styles.fullWidthButton]} 
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  saveButton: {
    backgroundColor: '#34c759',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  fullWidthButton: {
    width: '100%',
  },
}); 