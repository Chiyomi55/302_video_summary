import { Card as ShadcnCard } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function Card({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <ShadcnCard className={cn(className)}>{children}</ShadcnCard>
}
