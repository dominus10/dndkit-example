import { mainStore } from "@/store/main";
import { PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "../ui/menubar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { ItemsArray, WidgetEditor } from "./widget-editor";

// todo - fetch from api
const initialItems: ItemsArray[] = Array.from({ length: 90 }, (_, i) => ({
  id: (i + 1).toString(),
  isDropped: false,
  size: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1],
}));
// [
//   { id: "1", isDropped: false, size: [4, 3] },
//   { id: "2", isDropped: false, size: [2, 6] },
// ];

export const Appbar = ({
  disabled,
  className,
  rerenderTrigger,
}: {
  disabled: boolean;
  className?: string;
  rerenderTrigger?: () => void;
}) => {
  const [currentTime, setCurrentTime] = useState<string>("Syncing time..");

  // long running
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date(Date.now()).toLocaleTimeString());
    }, 1000);
  }, []);
  // ui
  return (
    <div aria-label="toolbar" className={className}>
      <div className="flex flex-row mr-[0.25rem] items-center relative p-1">
        {disabled && (
          <div className="z-[10000] w-[100.4%] h-12 absolute top-0 left-0 bg-gray-300 opacity-50" />
        )}
        <Select value="light">
          <SelectTrigger className="w-[300px] mx-2">
            <SelectValue
              placeholder="Theme"
              aria-labelledby="Account / Email"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="logout">Logout</SelectItem>
          </SelectContent>
        </Select>
        <AddWidgetPopup rerenderTrigger={rerenderTrigger} />
        <AppbarMenu />

        <div className="flex w-full"></div>
        <strong className="w-40 text-sm">{currentTime}</strong>
      </div>

      <Separator />
    </div>
  );
};

const AddWidgetPopup = ({
  rerenderTrigger,
}: {
  rerenderTrigger?: () => void;
}) => {
  const data = mainStore.getState().widgetLayoutData;
  const updateMain = mainStore.getState().widgetLayoutMutate;
  useEffect(() => {}, [data]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-2">
          <PlusIcon className="mr-[0.5rem]" />
          Widgets
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] min-h-[90%] flex flex-col h-[90%] gap-y-1">
        <DialogHeader>
          <DialogTitle>Add / Edit widgets</DialogTitle>
        </DialogHeader>
        <DialogDescription className="h-0 p-0 m-0" />
        <div className="flex h-[calc(100%-64px)] w-full rounded-sm flex-row justify-start">
          <WidgetEditor initialItems={initialItems} />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (rerenderTrigger) {
                rerenderTrigger();
              }
              return updateMain;
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AppbarMenu = () => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New.. <MenubarShortcut>Ctrl+N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Save as.. <MenubarShortcut>Ctrl+Alt+S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Report</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Generate CSV <MenubarShortcut>Ctrl+N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Export as.. <MenubarShortcut>Ctrl+Alt+S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
