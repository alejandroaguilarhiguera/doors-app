// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CognitoTokens } from '@/src/types/auth';

interface AuthContextProps {
  tokens: CognitoTokens | null;
  setTokens: (tokens: CognitoTokens | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  tokens: null,
  setTokens: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokensState] = useState<CognitoTokens | null>(null);

  useEffect(() => {
    // Cargar tokens al iniciar la app
    const loadTokens = async () => {
      const json = await AsyncStorage.getItem('cognitoTokens');
      if (json) setTokensState(JSON.parse(json));
    };
    loadTokens();
  }, []);

  const setTokens = async (newTokens: CognitoTokens | null) => {
    setTokensState(newTokens);
    if (newTokens) {
      await AsyncStorage.setItem('cognitoTokens', JSON.stringify(newTokens));
    } else {
      await AsyncStorage.removeItem('cognitoTokens');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('cognitoTokens');
    setTokensState(null);
  };

  return (
    <AuthContext.Provider value={{ tokens, setTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
};