import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/cn'

export type SelectFieldOption = { value: string; label: string }

type SelectFieldProps = {
  value: string
  options: SelectFieldOption[]
  onValueChange?: (value: string) => void
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  id?: string
  'aria-label'?: string
}

/**
 * The main CIMS app's SelectField API (single value) on a native <select>: inside Telegram the phone's own
 * picker opens, which works better in a bottom sheet than a popover menu. Same look as the main app's trigger.
 */
export function SelectField({ value, options, onValueChange, className, disabled = false, size = 'md', id, 'aria-label': ariaLabel }: SelectFieldProps) {
  return (
    <span className={cn('relative flex w-full min-w-0 items-center', className)}>
      <select
        id={id}
        data-ui-control="true"
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => onValueChange?.(event.target.value)}
        className={cn(
          'control-field w-full min-w-0 cursor-pointer appearance-none truncate',
          size === 'sm' ? 'h-8 rounded-[8px] pr-7 pl-2.5 text-[12.5px]' : 'min-h-10 rounded-[10px] pr-9 pl-3 text-[13.5px]',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <ChevronDown size={size === 'sm' ? 14 : 16} className={cn('pointer-events-none absolute text-[var(--muted)]', size === 'sm' ? 'right-2' : 'right-3')} />
    </span>
  )
}
