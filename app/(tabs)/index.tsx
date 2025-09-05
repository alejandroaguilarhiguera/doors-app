import {useEffect, useContext, useState } from 'react';
import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import PowerButton from '@/src/components/PowerButton';
import { View, Text } from '@/src/components/Themed';
import useThingStore from '@/store/thingStore';
import useSWR from 'swr';
import { AuthContext } from '@/src/context/AuthContext';
import { KynesisStream } from '@/src/types/aws';
import { fetcher } from '@/src/api/fetcher';
import Video from 'react-native-video';

export default function TabOneScreen() {
  const { tokens, setTokens } = useContext(AuthContext);
  const [streamName, setStreamName] = useState<string>();
  const  { thingName, attributes } = useThingStore((state: any) => state.selectedThing) ??{}
    const { data: streamList, isLoading, error } = useSWR<{streams: KynesisStream[]}>(
        process.env.EXPO_PUBLIC_LIST_STREAM,
        (url: string) => fetcher(url, {}, tokens, setTokens),
    ); 

    const { data: streamLive, isLoading: isLoadingLive, error: errorStreamLive } = useSWR<{ url: string}>(
        streamName ? `${process.env.EXPO_PUBLIC_STREAM_LIVE}?streamName=${streamName}` : undefined,
        (url: string) => fetcher(url, {}, tokens, setTokens),
    ); 

  useEffect(() => {
    if (streamList?.streams?.length) {
      const [firstStream] = streamList?.streams;
      setStreamName(firstStream.StreamName)
    }
  },[streamList]);  

  useEffect(() => {
    if (!thingName) {
      router.replace('/ListDevices');
    }
  }, [thingName]);

  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.text}>{[thingName, attributes?.name].join(' - ')}</Text>
      </View>
      <View style={styles.container}>
        {streamLive?.url && (
          <View style={styles.container}>

          <Video
          source={{ uri: streamLive.url }}
          style={{
            width: 200,
            height: 200
          }}
          
          controls
          resizeMode="contain"
            paused={false}
          />
          </View>
        )}
      </View>
      <View style={styles.container}>
        <PowerButton thingName={thingName} />
      </View>
      <Toast/>
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
  textView: {
    marginTop: 8,
  },
  text: {
    color: 'gray',
    fontSize: 16,
    backgroundColor: '#f4f4f5',
  },
  testZone: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'yellow',
    margin: 8,
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