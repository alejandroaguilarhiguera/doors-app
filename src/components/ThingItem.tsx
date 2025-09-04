import React from 'react';
import { router } from 'expo-router';
import { StyleSheet, Pressable } from 'react-native';
import { Text } from './Themed';
import { Thing } from '@/src/types/aws';
import useThingStore from '@/store/thingStore';

interface ThingItemProps {
    thing: Thing
}

const ThingItem = ({thing}: ThingItemProps) => {
    const selectThing = useThingStore((state: any) => state.selectThing)
    const handlePress = () => {
        selectThing(thing);
        router.push('/(tabs)');
    };

    return (
        <Pressable
            style={styles.content}
            onPress={handlePress}
        >
            <Text style={{ color: '#e7e5e4'}}>
                {thing.thingName} - {thing.attributes.name}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#5A67D8', // Un color índigo por defecto
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    }
});

export default ThingItem;