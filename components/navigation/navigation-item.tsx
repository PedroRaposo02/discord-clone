'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ActionToolTip } from '@/components/action-tooltip'
import { ReactNode } from 'react'
import { Draggable } from 'react-beautiful-dnd'

interface NavigationItemProps {
  id: string
  imageUrl: string
  name: string
  index: number
}

export default function NavigationItem({
  id,
  imageUrl,
  name,
  index
}: NavigationItemProps): ReactNode {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <Draggable draggableId={id} key={id} index={index}>
      {(provided, snapshot) => (
        <div
          className='flex items-center justify-center group mb-2'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ActionToolTip side='right' align='center' label={name}>
            <div
              onClick={onClick}
              className='group relative flex items-center cursor-pointer'
            >
              <div
                className={cn(
                  'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
                  params?.serverId !== id && 'group-hover:h-[20px]',
                  params?.serverId === id ? 'h-[36px]' : 'h-[8px]',
                  snapshot.isDragging && 'h-[0px]',
                )}
              />
              <div
                className={cn(
                  'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
                  (params?.serverId === id || snapshot.isDragging) &&
                  'bg-primary/10 text-primary rounded-[16px]'
                )}
              >
                <Image
                  fill
                  src={imageUrl}
                  alt='Channel'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
              </div>
            </div>
          </ActionToolTip>
        </div>
      )}
    </Draggable>
  )
}
