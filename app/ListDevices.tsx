import React, { useContext } from 'react';
import useSWR from 'swr';
import { StyleSheet } from 'react-native';
import { View, Text } from '@/src/components/Themed';
import { AuthContext } from '@/src/context/AuthContext';
import ThingItem from '@/src/components/ThingItem';
import { fetcher } from '@/src/api/fetcher';
import { Thing } from '@/src/types/aws';
import SkeletonBar from '@/src/components/SkeletonBar';

const ListDevicesScreen = () => {
    const { tokens, setTokens } = useContext(AuthContext);
    const { data, isLoading, error } = useSWR<Thing[]>(
        process.env.EXPO_PUBLIC_LIST_DEVICES,
        (url: string) => fetcher(url, {}, tokens, setTokens),
    ); 
    return (
        <View style={styles.content}>
            {error && (<View><Text>{JSON.stringify(error)}</Text></View>)} 
            {isLoading && (
                <>
                    <SkeletonBar width="100%" height={40} />
                    <SkeletonBar width="100%" height={40} style={{ marginTop: 8 }} />
                    <SkeletonBar width="100%" height={40} style={{ marginTop: 8 }} />
                </>
            )}
            <Text>{JSON.stringify({ data })}</Text>
            {data?.map((thing) => (
                <ThingItem
                    thing={thing}
                    key={thing.thingName}
                />
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