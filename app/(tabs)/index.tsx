import { useState, useRef } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import ImageWithQRCode from '@/components/ImageWithQRCode';
import { Text, View } from '@/components/Themed';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export interface Code {
  uuid: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}
export interface PayloadGenerateCode {
  message: string;
  code: Code;
}


interface QRCodeInstance {
  toDataURL: (callback: (dataURL: string) => void) => void;
}

export default function TabOneScreen() {
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

    const response = fetch(process.env.EXPO_PUBLIC_GENERATE_CODE ?? '', {
      method: 'POST'
    });
    response.then((payload) => {
      if (payload.ok) {
        payload.json().then((dataGenerateCode: PayloadGenerateCode) => {
          setCode(dataGenerateCode.code.uuid)
        }).catch(console.error)
      }
    }).catch(console.error);
  }
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Gate controls</Text> */}

      <Button onPress={() => onGenerateCode()}>Generar codigo</Button>


      <ImageWithQRCode code={code} getRef={getRef} />

      <Button onPress={shareQRCode}>compartir</Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testZone: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'yellow',
    margin: 8,
  },
  button: {
    backgroundColor: 'white',
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
});
