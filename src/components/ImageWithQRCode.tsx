import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export interface ImageWithQRCodeProps {
    code: string | null;
    getRef: any;
}

const ImageWithQRCode = ({ code: qrValue, getRef }: ImageWithQRCodeProps) => {
    return (
        <View style={styles.container}>
            {qrValue && (
                <QRCode
                    value={qrValue}
                    size={150} // Tamaño del código QR
                    color="black" // Color de los módulos del QR
                    backgroundColor="white" // Color de fondo del QR
                    logoSize={30}
                    logoBackgroundColor='transparent'
                    getRef={getRef}
                    quietZone={4}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },

});

export default ImageWithQRCode;