import Toast from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import PowerButton from '@/components/PowerButton';
import { View, Text } from '@/components/Themed';
import useThingStore from '@/store/thingStore';

export default function TabOneScreen() {
    const { thingName, attributes } = useThingStore((state: any) => state.selectedThing)

  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.text}>{[thingName, attributes?.name].join(' - ')}</Text>
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