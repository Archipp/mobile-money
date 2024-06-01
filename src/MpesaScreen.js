import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { db } from '../config';
import { ref, onValue } from 'firebase/database';

const MpesaScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAmountModalVisible, setAmountModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState('');
  const [balanceVodaDollar, setBalanceVodaDollar] = useState('0.00');
  const [balanceVodaFranc, setBalanceVodaFranc] = useState('0.00');

  useEffect(() => {
    const balanceVodaDollarRef = ref(db, 'mpesa_dollars');
    const balanceVodaFrancRef = ref(db, 'mpesa_fc');

    const unsubscribeDollar = onValue(balanceVodaDollarRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setBalanceVodaDollar(data.toString());
      }
    });

    const unsubscribeFranc = onValue(balanceVodaFrancRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setBalanceVodaFranc(data.toString());
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribeDollar();
      unsubscribeFranc();
    };
  }, []);

  const handleTransaction = (type) => {
    setTransactionType(type);
    setModalVisible(false);
    setAmountModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <View style={styles.balanceBox}>
          <Text>Balance en FC</Text>
          <TextInput 
            style={styles.balanceInput} 
            value={balanceVodaFranc} 
            editable={false} 
          />
        </View>
        <View style={styles.balanceBox}>
          <Text>Balance en $</Text>
          <TextInput 
            style={styles.balanceInput} 
            value={balanceVodaDollar} 
            editable={false} 
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Envoi" onPress={() => setModalVisible(true)} />
        <Button title="Retrait" onPress={() => setModalVisible(true)} />
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleTransaction('Option 1')}>
              <Text>Option 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleTransaction('Option 2')}>
              <Text>Option 2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleTransaction('Option 3')}>
              <Text>Option 3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleTransaction('Option 4')}>
              <Text>Option 4</Text>
            </TouchableOpacity>
            <Button title="Fermer" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isAmountModalVisible}
        animationType="slide"
        onRequestClose={() => setAmountModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.balanceInput}
              placeholder="montant"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.balanceInput}
              placeholder="numero agent"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.balanceInput}
              placeholder="mot de passe"
              value={amount}
              onChangeText={setAmount}
            />
            <Button title="Valider" onPress={() => alert(`Montant ${transactionType} : ${amount}`)} />
            <Button title="Fermer" onPress={() => setAmountModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  balanceBox: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  balanceInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    width: '50%',
    justifyContent: 'space-between',
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default MpesaScreen;
