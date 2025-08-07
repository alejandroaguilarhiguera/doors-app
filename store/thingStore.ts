// store/thingStore.tsx
import { Thing } from '@/app/ListDevices';
import { create } from 'zustand';

const useThingStore = create((set) => ({
  selectedThing: null,

  selectThing: (thing: Thing) => set({ selectedThing: thing }),
}));

export default useThingStore;