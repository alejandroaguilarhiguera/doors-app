
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState, useRef, useContext } from 'react';
import { Button } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import ImageWithQRCode from '@/src/components/ImageWithQRCode';
import { Text, View } from '@/src/components/Themed';
import useThingStore from '@/store/thingStore';
import { fetcher } from '@/src/api/fetcher';
import { Code, PayloadGenerateCode } from '@/src/types/aws';
import { AuthContext } from '@/src/context/AuthContext';


interface QRCodeInstance {
  toDataURL: (callback: (dataURL: string) => void) => void;
}

export default function TabTwoScreen() {
  const { tokens, setTokens } = useContext(AuthContext);
  const { thingName, attributes } = useThingStore((state: any) => state.selectedThing)

  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const qrCodeRef = useRef<QRCodeInstance>(null);
  const getRef = (c: any) => (qrCodeRef.current = c);

  const shareQRCode = () => {
    if (!qrCodeRef.current) {
      return;
    }
    qrCodeRef.current.toDataURL(async (data) => {
      const path = FileSystem.cacheDirectory + 'qrcode.png';

      try {
        // 3. Escribir la cadena base64 en un archivo temporal
        await FileSystem.writeAsStringAsync(path, data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // 4. Compartir el archivo usando expo-sharing
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(path, {
            mimeType: 'image/png',
            dialogTitle: 'Compartir código QR',
          });
        } else {
          Alert.alert('Error', 'No es posible compartir en esta plataforma.');
        }

      } catch (error) {
        console.error("Error al compartir el QR:", error);
        Alert.alert('Error', 'No se pudo compartir el código QR.');
      }
    });
  };
  const [code, setCode] = useState<string | null>(null);
  const onGenerateCode = () => {
    setIsLoadingQR(true);
    const response = fetcher(process.env.EXPO_PUBLIC_GENERATE_CODE ?? '', {
      method: 'POST',
      body: JSON.stringify({
        thingName,
      })
    }, tokens, setTokens);
    response.then((dataGenerateCode: PayloadGenerateCode) => {
          setIsLoadingQR(false);
          setCode(dataGenerateCode.code.id)
    }).catch((err) => {
      setIsLoadingQR(false);

      console.error(err);
      Toast.show({
        type: 'error', // 'success', 'error', 'info'
        text1: String(err),
        position: 'top', // 'top', 'bottom'
        visibilityTime: 6000, // Duración en ms
      });
    });
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 8, backgroundColor: '#f4f4f5', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.text}>{[thingName, attributes?.name].join(' - ')}</Text>
      </View>
      <View style={styles.container}>

      <Button style={styles.button} onPress={() => onGenerateCode()}>
        <Text style={styles.buttonText}>
          {code ? 'Generar nuevo codigo': 'Generar codigo'}  
        </Text>

      </Button>

      {!code && isLoadingQR && (
        <ActivityIndicator size="large" color="#00ff00" />
      )}

      {!isLoadingQR && (
        <ImageWithQRCode code={code} getRef={getRef} />
      )}

      {code && (
        <Button style={styles.button} onPress={shareQRCode}>
        <Text style={styles.buttonText}>
          Compartir
        </Text>
      </Button>
      )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f5',
  },
  text: {
    color: 'gray',
    fontSize: 16,
    backgroundColor: '#f4f4f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  // Contenedor del botón
  button: {
    backgroundColor: '#2563eb', // Color de fondo del botón
    paddingVertical: 8,       // Espaciado vertical
    paddingHorizontal: 16,     // Espaciado horizontal
    borderRadius: 4,           // Bordes redondeados
    alignItems: 'center',
    marginBottom: 4,
  },
  // Texto dentro del botón
  buttonText: {
    color: '#ffffff',          // Color del texto
    fontSize: 16,
    marginTop: 4,
    fontWeight: 'bold',
  },
});
