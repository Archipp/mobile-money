import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import OrangeScreen from './src/OrangeScreen';
import MpesaScreen from './src/MpesaScreen';
import AirtelScreen from './src/AirtelScreen';

export default function App() {
  const [name, setName] = useState('');
  const [network, setNetwork] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [screen, setScreen] = useState(null);

  const handleLogin = () => {
    if (name === 'Daniel' && network === 'vodacom' && email === 'danielmulenda@gmail.com' && password === "123456789") {
      setScreen(<MpesaScreen />);
    } else if (name === 'Aristarque' && network === 'airtel' && email === 'aristarquemulenda@gmail.com' && password === "0000") {
      setScreen(<AirtelScreen />);
    } else if (name === 'Archipp' && network === 'orange' && email === 'archippmulenda@gmail.com' && password === "1234") {
      setScreen(<OrangeScreen />);
    } else {
      alert('Informations de connexion incorrectes');
    }
  };

  return screen ? screen : (
    <View style={styles.container}>
      <Text>Connectez-vous</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />
      <Picker
        selectedValue={network}
        style={styles.input}
        onValueChange={(itemValue) => setNetwork(itemValue)}
      >
        <Picker.Item label="Sélectionnez un réseau" value="" />
        <Picker.Item label="Vodacom" value="vodacom" />
        <Picker.Item label="Airtel" value="airtel" />
        <Picker.Item label="Orange" value="orange" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
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
