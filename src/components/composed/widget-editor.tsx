import { mainStore } from "@/store/main";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Appbar } from "./appbar";
import { createPortal } from "react-dom";

/**
 * Description placeholder
 *
 * @export
 * @interface ItemsArray
 * @typedef {ItemsArray}
 *
 */
export interface ItemsArray {
  id: string;
  isDropped: boolean;
  size: [number, number];
}

export const WidgetEditor = ({
  initialItems,
}: {
  initialItems: ItemsArray[];
}) => {
  const itemsList = mainStore.getState().widgetLayoutData;
  // todo - switch to state management
  const [items, setItems] = useState(itemsList);

  const update = (val: ItemsArray[] | undefined) =>
    mainStore.getState().widgetLayoutMutate(val!);

  if (itemsList.length === 0) {
    update(initialItems);
  }
  const [activeID, setActiveID] = useState("");
  const onDragStart = (e: DragStartEvent) => {
    setActiveID(e.active.id.toString());
  };

  const onDragEnd = (e: DragEndEvent) => {
    const draggedItemId = e.active.id;
    const isDroppedInActiveArea = e.over?.id === "active-area";

    if (isDroppedInActiveArea && e.active.id !== e.over?.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex(
          (item) => item.id === draggedItemId
        );
        const newIndex = prevItems.findIndex((item) => item.id === e.over!.id);
        if (oldIndex === newIndex) return prevItems;

        return arrayMove(prevItems, oldIndex, newIndex);
      });
    } else {
      setItems((prevItems) =>
        [...prevItems].sort((a, b) => a.id.localeCompare(b.id))
      );
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === draggedItemId && item.isDropped !== isDroppedInActiveArea
          ? { ...item, isDropped: isDroppedInActiveArea }
          : item
      )
    );
  };

  useEffect(() => {
    return update(items);
  }, [items, itemsList]);

  return (
    <DndContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      collisionDetection={closestCorners}
    >
      <InactiveDroppableArea>
        {itemsList
          .filter((item) => !item.isDropped)
          .map((item) => {
            const [x, y] = item.size;
            return (
              <WidgetCard
                key={item.id}
                id={item.id}
                col={x}
                row={y}
                customText={`${x}x${y} - ${item.id}`}
              />
            );
          })}
      </InactiveDroppableArea>
      <SortableContext items={itemsList}>
        <DroppableArea>
          {itemsList
            .filter((item) => item.isDropped)
            .map((item) => {
              const [x, y] = item.size;
              return <WidgetCard key={item.id} id={item.id} col={x} row={y} />;
            })}
          {itemsList.every((item) => !item.isDropped) && "Drop here"}
        </DroppableArea>
      </SortableContext>
      {createPortal(
        <DragOverlay adjustScale={false}>
          {activeID && (
            <WidgetCard
              id={activeID}
              col={() => itemsList.filter((e) => e.id === activeID)[0].size[0]}
              row={() => itemsList.filter((e) => e.id === activeID)[0].size[1]}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

const DroppableArea = ({ children }: { children: ReactNode }) => {
  const { setNodeRef: activeAreaRef } = useDroppable({
    id: "active-area",
  });

  return (
    <>
      <div className="w-1/2 flex flex-col ml-1 gap-y-0 relative">
        <p className="text-sm">Preview</p>
        <div className="absolute -top-1 w-full aspect-[16/9]">
          <Appbar
            disabled={true}
            className="scale-50 -translate-x-[25%] w-[200%] translate-y-[25%]"
          />
          <div className="border-2 border-t-0 rounded-t-none w-full h-full mr-1 rounded-md overflow-y-auto">
            <div
              ref={activeAreaRef}
              className="grid grid-cols-12 grid-rows-12 gap-1 w-full p-1"
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const InactiveDroppableArea = ({ children }: { children: ReactNode }) => {
  const { setNodeRef: inactiveAreaRef } = useDroppable({
    id: "inactive-area",
  });
  return (
    <>
      <div className="w-1/2 h-full flex flex-col ml-1 gap-y-0 pb-[8px]">
        <p className="text-sm">Widgets</p>
        <div className="bg-gray-100 w-full h-full mr-1 rounded-md flex overflow-y-auto">
          <div ref={inactiveAreaRef} className="grid grid-cols-12 gap-2 w-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export const WidgetCard = ({
  id,
  col = 3,
  row = 3,
  customText,
  editorMode = true,
}: {
  id: string;
  col?: number | (() => number);
  row?: number | (() => number);
  customText?: string;
  editorMode?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style =
    editorMode && transform
      ? { transform: CSS.Translate.toString(transform) }
      : undefined;

  const gridClasses = `col-span-${col} row-span-${row}`;

  return (
    <Card
      ref={editorMode ? setNodeRef : undefined}
      style={style}
      {...(editorMode ? listeners : {})}
      {...(editorMode ? attributes : {})}
      className={`${gridClasses} rounded-sm`}
    >
      <CardContent className="p-1 pt-1 justify-center items-center flex flex-col h-full w-full text-[11px] aspect-[16/9]">
        {customText ? customText : `Item ID ${id}`}
      </CardContent>
    </Card>
  );
};
