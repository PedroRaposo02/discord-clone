'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ActionToolTip } from '@/components/action-tooltip'
import { ReactNode } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Server } from '@prisma/client'

interface NavigationItemProps {
  server: Server
  index: number
}

export default function NavigationItem({ server, index }: NavigationItemProps): ReactNode {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${server.id}`);
  };

  return (
    <Draggable draggableId={server.id} key={server.id} index={index}>
      {(provided, snapshot) => (
        <div
          className="flex items-center justify-center group mb-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ActionToolTip side="right" align="center" label={server.name}>
            <div
              onClick={() => {
                onClick();
              }}
              className="group relative flex items-center cursor-pointer"
            >
              <div
                className={cn(
                  "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                  params?.serverId !== server.id && "group-hover:h-[20px]",
                  params?.serverId === server.id ? "h-[36px]" : "h-[8px]",
                  snapshot.isDragging && "h-[0px]"
                )}
              />
              <div
                className={cn(
                  "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                  (params?.serverId === server.id || snapshot.isDragging) &&
                    "bg-primary/10 text-primary rounded-[16px]"
                )}
              >
                <Image
                  fill
                  src={server.imageUrl}
                  alt="Channel"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </ActionToolTip>
        </div>
      )}
    </Draggable>
  );
}
