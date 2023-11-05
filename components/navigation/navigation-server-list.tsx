"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Server } from "@prisma/client";
import {
  DragDropContext,
  DropResult,
  Droppable,
  resetServerContext,
} from "react-beautiful-dnd";
import NavigationItem from "./navigation-item";
import { useEffect, useState } from "react";

interface NavigationServerListProps {
  servers: Server[];
}

const NavigationServerList = ({ servers }: NavigationServerListProps) => {
  const [serversList, setServersList] = useState(servers);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(serversList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setServersList(items);
  };

  useEffect(() => {
    resetServerContext();
  }, [servers]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ScrollArea>
        <Droppable droppableId="SERVERS" direction="vertical">
          {(provided, snapshot) => (
            <div
              className="space-y-2"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {serversList.map((server, index) => (
                <div key={index}>
                  <NavigationItem server={server} index={index} />
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </ScrollArea>
    </DragDropContext>
  );
};

export default NavigationServerList;
