import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Importamos el ícono

interface PowerButtonProps {
    thingName: string
}

const PowerButton = ({thingName}: PowerButtonProps) => {
    // Estado para saber si está encendido o apagado
    const [isOn, setIsOn] = useState(false);

    // Función para cambiar el estado
    const handlePress = () => {
        const url = process.env.EXPO_PUBLIC_MANUAL_POWER ?? '';
        const response = fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                thingName,
                pin: 16,
                action: isOn ? 'OFF' : 'ON'
            })
        });

        response.then((payload) => {
            payload.json().then((data) => {
                console.log(isOn ? 'Apagando...' : 'Encendiendo...');
                setIsOn(prevState => !prevState);

            }).catch((err) => {
                console.error(err);
                Toast.show({
                    type: 'error', // 'success', 'error', 'info'
                    text1: String(err),
                    position: 'top', // 'top', 'bottom'
                    visibilityTime: 6000, // Duración en ms
                });
            })
        }).catch((err) => {
            console.error(err);
            Toast.show({
                type: 'error', // 'success', 'error', 'info'
                text1: String(err),
                position: 'top', // 'top', 'bottom'
                visibilityTime: 6000, // Duración en ms
            });
        });
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                // Cambia el color de fondo según el estado 'isOn'
                { backgroundColor: isOn ? '#28a745' : '#dc3545' },
                // Efecto visual al presionar
                pressed && styles.buttonPressed,
            ]}
            onPress={handlePress}
        >
            <Feather
                name="power" // Nombre del ícono de encendido
                size={32}   // Tamaño del ícono
                color="#ffffff" // Color del ícono
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 70,
        height: 70,
        borderRadius: 35, // La mitad del ancho/alto para hacerlo redondo
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Sombra para Android
        // Sombra para iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonPressed: {
        opacity: 0.8, // Reduce la opacidad al presionar
    },
});

export default PowerButton;