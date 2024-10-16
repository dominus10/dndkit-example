import { useEffect, useState } from "react";
import "./App.css";
import { Appbar } from "./components/composed/appbar";
import { WidgetCard } from "./components/composed/widget-editor";
import { mainStore } from "./store/main";

function App() {
  const data = mainStore.getState().widgetLayoutData;
  const [rerender, srerender] = useState<number>(0);
  useEffect(() => {}, [data, rerender]);
  return (
    <div className="h-[100dvh] flex flex-col">
      <Appbar
        disabled={false}
        rerenderTrigger={() => srerender((prev) => prev + 1)}
      />
      <div className="grid grid-cols-12 grid-rows-12 gap-1 w-full h-full p-1 flex-1">
        {data
          .filter((e) => e.isDropped)
          .map((e) => (
            <WidgetCard
              key={e.id}
              editorMode={false}
              id={e.id}
              col={e.size[0]}
              row={e.size[1]}
            ></WidgetCard>
          ))}
      </div>
    </div>
  );
}

export default App;
