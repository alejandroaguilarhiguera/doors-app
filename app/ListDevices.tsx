import React, { useState } from 'react';
import useSWR from 'swr';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import ThingItem from '../components/ThingItem';

export interface Thing {
    thingName: string;
    thingArn: string;
    attributes: { [key: string]: string | number };
    version:number;
}


const ListDevicesScreen = () => {
    const { data } = useSWR<Thing[]>('devices', async() => {
        const response = await fetch(process.env.EXPO_PUBLIC_LIST_DEVICES ?? '');
        if (response.ok) {
            return await response.json();
        }
    }); 
    
    return (
        <View style={styles.content}>
             {data?.map((thing) => (
                <ThingItem thing={thing} key={thing.thingName} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: 'white',
        gap: 16,
        padding: 16,
        justifyContent: 'center',
    }
});

export default ListDevicesScreen;