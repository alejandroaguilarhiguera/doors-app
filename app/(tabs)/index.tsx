import { useState, useEffect } from 'react';
import { db } from '@/config/firebase/config';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { doc, onSnapshot } from 'firebase/firestore';
import Spinner from '@/components/Spinner';
import { openDoor, closeDoor, Zone} from '@/config/firebase/firestore';
import { Text, View } from '@/components/Themed';
import Svg, { Rect, Polygon, Line, Circle } from 'react-native-svg';

const GateOpen = () => {
  return (
  <Svg width="200" height="150" viewBox="0 0 200 150">
  <Rect width="100%" height="100%" fill="#e5e5e5" />
  <Rect x="20" y="20" width="160" height="110" fill="none" stroke="#333" stroke-width="4" />
  <Polygon points="24,24 10,50 10,100 24,126" fill="#4B4B4B" stroke="#222" stroke-width="2" />
  <Line x1="10" y1="60" x2="24" y2="60" stroke="#666" stroke-width="1" />
  <Line x1="10" y1="95" x2="24" y2="95" stroke="#666" stroke-width="1" />
  <Circle cx="14" cy="75" r="3" fill="#FFD700" />

  <Polygon points="176,24 190,50 190,100 176,126" fill="#4B4B4B" stroke="#222" stroke-width="2" />
  <Line x1="176" y1="60" x2="190" y2="60" stroke="#666" stroke-width="1" />
  <Line x1="176" y1="95" x2="190" y2="95" stroke="#666" stroke-width="1" />
  <Circle cx="186" cy="75" r="3" fill="#FFD700" />
</Svg>

)
}

const GateClose = () => {

  return (
    
    <Svg width="200" height="150" viewBox="0 0 200 150">
  <Rect width="100%" height="100%" fill="#e5e5e5" />

  <Rect x="20" y="20" width="160" height="110" fill="none" stroke="#333" stroke-width="4" />

  <Rect x="24" y="24" width="72" height="102" fill="#4B4B4B" stroke="#222" stroke-width="2" />
  <Line x1="24" y1="60" x2="96" y2="60" stroke="#666" stroke-width="1" />
  <Line x1="24" y1="95" x2="96" y2="95" stroke="#666" stroke-width="1" />

  <Rect x="104" y="24" width="72" height="102" fill="#4B4B4B" stroke="#222" stroke-width="2" />
  <Line x1="104" y1="60" x2="176" y2="60" stroke="#666" stroke-width="1" />
  <Line x1="104" y1="95" x2="176" y2="95" stroke="#666" stroke-width="1" />

  <Circle cx="94" cy="75" r="3" fill="#FFD700" />
  <Circle cx="106" cy="75" r="3" fill="#FFD700" />
</Svg>)
}

export default function TabOneScreen() {

  const [doorData, setDoorData] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const collectionId = process.env.EXPO_PUBLIC_COLLECTION_ID ?? '';
    const documentId = process.env.EXPO_PUBLIC_DOCUMENT_ID ?? '';

    if (!collectionId || !documentId) {
      setError("Error: database configuration or collection.");
      setLoading(false);
      return;
    }
    
    const doorDocRef = doc(db, collectionId, documentId);

    const unsubscribe = onSnapshot(
      doorDocRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setDoorData(docSnap.data() as Zone);
        } else {
          setError(`document ${documentId} not found.`);
        }
      }, 
      (err) => {
        setError("Error to listen the document.");
        console.error("Error on onSnapshot: ", err);
        setLoading(false);
      }
    );

    return () => {
      console.log("Clean event.");
      unsubscribe();
    };

  }, []);


  if (!doorData) return <View style={styles.container}></View>
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gate controls</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.testZone}>

      <Text style={{ color: 'black'}}>
        {JSON.stringify(doorData)}
      </Text>
      </View>

      <View style={{ display: 'flex', gap: 8 }}>
        <Button style={styles.button} loading={doorData.status === 'in_progress'}  disabled={doorData.status === 'in_progress' || doorData.status === 'opened'} onPress={() => {
          openDoor().then((response) => console.log(response)).catch(console.error);
        }}>
          Open
        </Button>

        
        <Button style={styles.button} loading={doorData.status === 'in_progress'} disabled={doorData.status === 'in_progress' || doorData.status === 'closed'} onPress={() => {
          closeDoor().then((response) => console.log(response)).catch(console.error);
        }}>
        Close
      </Button>
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    
    {doorData.status === 'in_progress' && (
      <Spinner size={60} color="#e74c3c" />
    )}
    
    {doorData.status === 'opened' && (
      <GateOpen />
    )}
    {doorData.status === 'closed' && (
    <GateClose />
    )}
  </View>


      </View>
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
