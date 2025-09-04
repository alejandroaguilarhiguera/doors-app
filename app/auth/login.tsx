// app/auth/login.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';
import signIn from '@/src/api/signIn';
import {AuthContext} from '@/src/context/AuthContext'; 
import { StyleSheet } from 'react-native';

const LoginScreen = () => {
  const router = useRouter();
  const { setTokens } = useContext(AuthContext);

  const [requireNewPassword, setRequireNewPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState<string>();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const result = await signIn(username, password, newPassword);
      setTokens(result);
      router.replace('/ListDevices'); // redirige a home
    } catch (err: any) {
      console.error('[error', err)
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  useEffect(() => {
    if (error === 'Usuario debe cambiar la contraseña') setRequireNewPassword(true);
  },[error])

  return (
    <View style={styles.content}>
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="black"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="black"
        style={styles.input}
      />
      {error ? <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text> : null}
    <TextInput
        placeholder="Nueva Contraseña"
        value={newPassword || ''}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholderTextColor="black"
        style={{
          display: requireNewPassword ? undefined: 'none',
          ...styles.input,
        }}
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );  
}

const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      gap: 12,
      padding: 16,
      backgroundColor: '#fff'
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      color: 'black',
      padding: 10,
      borderRadius: 5,
    }
});

export default LoginScreen;