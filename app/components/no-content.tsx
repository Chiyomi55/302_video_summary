'use client'
import { useClientTranslation } from '../hooks/use-client-translation'
import BoxIcon from './box-icon'

const NoContent = ({ message }: { message: string }) => {
  const { t } = useClientTranslation()
  return (
    <div className='flex  flex-col items-center justify-center text-center'>
      <BoxIcon className='size-16' />
      <h2 className='mb-2 text-xl font-semibold'>
        {t('extras:no_content.title')}
      </h2>
      <p className='text-sm text-gray-500'>{message}</p>
    </div>
  )
}

export default NoContent
