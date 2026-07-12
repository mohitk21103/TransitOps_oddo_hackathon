import { useId } from 'react'
import { cn } from '@/lib/utils'

/** TransitOps logo mark — an amber crosshatched square. */
export function BrandMark({
  size = 40,
  className,
}: {
  size?: number
  className?: string
}) {
  const id = useId().replace(/:/g, '')
  const hatchA = `hatchA-${id}`
  const hatchB = `hatchB-${id}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label="TransitOps"
      className={cn('shrink-0', className)}
    >
      <defs>
        <pattern
          id={hatchA}
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="5" stroke="#e0a82e" strokeWidth="1.25" />
        </pattern>
        <pattern
          id={hatchB}
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <line x1="0" y1="0" x2="0" y2="5" stroke="#e0a82e" strokeWidth="1.25" />
        </pattern>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="5" fill={`url(#${hatchA})`} />
      <rect x="1" y="1" width="38" height="38" rx="5" fill={`url(#${hatchB})`} />
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="5"
        stroke="#e0a82e"
        strokeWidth="2"
      />
    </svg>
  )
}
