import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'
import BoxIcon from './box-icon'

interface ActionCardProps {
  stateConfig: {
    [key in CardState]: {
      title: string
      description: string
    }
  }
  actionText: string
  onAction: (
    setCardState: React.Dispatch<React.SetStateAction<CardState>>
  ) => void
  cardState: CardState
  setCardState: React.Dispatch<React.SetStateAction<CardState>>
  className?: string
}

export enum CardState {
  Action = 'action',
  Loading = 'loading',
  Empty = 'empty',
}

export const ActionCard: React.FC<ActionCardProps> = ({
  stateConfig,
  actionText,
  onAction,
  cardState,
  setCardState,
  className,
}) => {
  const handleAction = () => {
    onAction(setCardState)
  }

  return (
    <Card className={cn('border-none p-0 shadow-none', className)}>
      <CardContent
        className={cn('flex flex-col items-center justify-center gap-2 p-0')}
      >
        {cardState === CardState.Loading && (
          <ReloadIcon className='size-16 animate-spin' />
        )}
        {cardState === CardState.Empty && <BoxIcon className='size-16' />}
        <h3 className={cn('text-lg font-bold')}>
          {stateConfig[cardState].title}
        </h3>
        <p className={cn('text-sm')}>{stateConfig[cardState].description}</p>
        {cardState === CardState.Action && (
          <Button onClick={handleAction}>{actionText}</Button>
        )}
      </CardContent>
    </Card>
  )
}
