import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { db } from '../config';
import { Picker } from '@react-native-picker/picker';
import { ref, onValue, set, get } from 'firebase/database';

const AirtelScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAmountModalVisible, setAmountModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [network, setNetwork] = useState('');
  const [amount, setAmount] = useState('');
  const [agentNumber, setAgentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [balanceAirtelDollar, setbalanceAirtelDollar] = useState(0.00);
  const [balanceAirtelFranc, setbalanceAirtelFranc] = useState(0.00);

  useEffect(() => {
    const balanceAirtelDollarRef = ref(db, 'airtel_dollars');
    const balanceAirtelFrancRef = ref(db, 'airtel_fc');

    const unsubscribeDollar = onValue(balanceAirtelDollarRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setbalanceAirtelDollar(data);
      }
    });

    const unsubscribeFranc = onValue(balanceAirtelFrancRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setbalanceAirtelFranc(data);
      }
    });

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

  const handleValidation = async () => {
    let validAgentNumber;
    let targetRef;
    let targetBalance;

    if (transactionType === 'Mpesa') {
      validAgentNumber = '0822058326';
      targetRef = network === 'dollar' ? ref(db, 'mpesa_dollars') : ref(db, 'mpesa_fc');
    } else if (transactionType === 'Orange Money') {
      validAgentNumber = '0896100856';
      targetRef = network === 'dollar' ? ref(db, 'orange_dollars') : ref(db, 'orange_fc');
    }

    if (agentNumber !== validAgentNumber || password !== '0000') {
      Alert.alert('Erreur', 'Numéro d\'agent ou mot de passe incorrect');
      return;
    }

    const amountValue = parseFloat(amount);
    if (network === 'dollar') {
      if (amountValue > balanceAirtelDollar) {
        Alert.alert('Erreur', 'Le montant entré est supérieur à la balance disponible en dollars');
        return;
      } else {
        setbalanceAirtelDollar((prevBalance) => prevBalance - amountValue);
        set(ref(db, 'airtel_dollars'), balanceAirtelDollar - amountValue);
      }
    } else if (network === 'franc') {
      if (amountValue > balanceAirtelFranc) {
        Alert.alert('Erreur', 'Le montant entré est supérieur à la balance disponible en francs');
        return;
      } else {
        setbalanceAirtelFranc((prevBalance) => prevBalance - amountValue);
        set(ref(db, 'airtel_fc'), balanceAirtelFranc - amountValue);
      }
    }

    // Update the target service balance
    const targetSnapshot = await get(targetRef);
    targetBalance = targetSnapshot.val() || 0;
    set(targetRef, targetBalance + amountValue);

    Alert.alert('Succès', `Transaction ${transactionType} de ${amountValue} ${network === 'dollar' ? '$' : 'fc'} réussie`);
    setAmountModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <View style={styles.balanceBox}>
          <Text>Balance en FC</Text>
          <TextInput 
            style={styles.balanceInput} 
            value={balanceAirtelFranc.toString()} 
            editable={false} 
          />
        </View>
        <View style={styles.balanceBox}>
          <Text>Balance en $</Text>
          <TextInput 
            style={styles.balanceInput} 
            value={balanceAirtelDollar.toString()} 
            editable={false} 
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
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
            <TouchableOpacity style={styles.modalButton} onPress={() => handleTransaction('Mpesa')}>
              <Text>Vodacom M-pesa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleTransaction('Airtel Money')}>
              <Text>Airtel Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleTransaction('Orange Money')}>
              <Text>Orange Money</Text>
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
            <Text>Saisissez le montant pour {transactionType}</Text>
            <TextInput
              style={styles.balanceInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <Picker
              selectedValue={network}
              style={styles.input}
              onValueChange={(itemValue) => setNetwork(itemValue)}
            >
              <Picker.Item label="Sélectionnez une devise" value="" />
              <Picker.Item label="$" value="dollar" />
              <Picker.Item label="fc" value="franc" />
            </Picker>
            <TextInput
              style={styles.balanceInput}
              placeholder="numero agent"
              value={agentNumber}
              onChangeText={setAgentNumber}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.balanceInput}
              placeholder="mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button title="Valider" onPress={handleValidation} />
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
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default AirtelScreen;
