import { useDndContext } from "@dnd-kit/core";
import { cva } from "class-variance-authority";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import React from "react";

type IDndContainer = {
  children: React.ReactNode;
  dir?: "horizontal" | "vertical";
};

export const DndContainer = (props: IDndContainer) => {
  const dndCtx = useDndContext();
  const variations = cva("flex w-full", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({ dragging: dndCtx.active ? "active" : "default" })}
    >
      <div className="flex flex-row w-full h-full gap-x-2">
        {props.children}
      </div>
      <ScrollBar orientation={props.dir ? props.dir : "horizontal"} />
    </ScrollArea>
  );
};
