'use client'

import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Server } from '@prisma/client'
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable
} from 'react-beautiful-dnd'
import NavigationItem from './navigation-item'
import {  useState } from 'react'
import { ActionToolTip } from '../action-tooltip'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface NavigationServerListProps {
  servers: Server[]
}

const NavigationServerList = ({ servers }: NavigationServerListProps) => {
  const [serversList, setServersList] = useState(servers)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(servers)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setServersList(items)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ScrollArea>
        <Droppable droppableId='SERVERS' direction='vertical'>
          {(provided, snapshot) => (
            <div
              className='space-y-2'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {serversList.map((server, index) => (
                <NavigationItem
                  key={server.id}
                  id={server.id}
                  imageUrl={server.imageUrl}
                  name={server.name}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </ScrollArea>
    </DragDropContext>
  )
}

export default NavigationServerList
