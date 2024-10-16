import { ItemsArray } from "@/components/composed/widget-editor";
import { create, StateCreator } from "zustand";

interface WidgetLayoutSlice {
  widgetLayoutData: ItemsArray[] | [];
  widgetLayoutMutate: (val: ItemsArray[]) => void;
}

const widgetLayoutStore: StateCreator<
  WidgetLayoutSlice,
  [],
  [],
  WidgetLayoutSlice
> = (set) => ({
  widgetLayoutData: [],
  widgetLayoutMutate: (v: ItemsArray[]) => set(() => ({ widgetLayoutData: v })),
});
export const mainStore = create<WidgetLayoutSlice>()((...a) => ({
  ...widgetLayoutStore(...a),
}));
