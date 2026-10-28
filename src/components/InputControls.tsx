import { Crosshair } from 'lucide-react'
import { localized, translate } from '../i18n'
import type { ExerciseDefinition, Language, Position } from '../types/lab'

interface InputControlsProps {
  exercise: ExerciseDefinition
  input: Record<string, unknown>
  language: Language
  selectingKey?: string
  onSelectingKey: (key?: string) => void
  onChange: (input: Record<string, unknown>) => void
}

export function InputControls({ exercise, input, language, selectingKey, onSelectingKey, onChange }: InputControlsProps) {
  const set = (key: string, value: unknown) => onChange({ ...input, [key]: value })
  return (
    <div className="input-controls">
      {exercise.inputFields.map((field) => {
        if (field.type === 'number') {
          const storedValue = input[field.key]
          const value: number = typeof storedValue === 'number' ? storedValue : field.min
          return (
            <label className="input-field" key={field.key}>
              <span>{localized(language, field.label)}</span>
              <input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                value={value}
                onChange={(event) => set(field.key, Math.max(field.min, Math.min(field.max, Math.round(Number(event.target.value)))))}
              />
            </label>
          )
        }
        if (field.type === 'toggle') {
          return (
            <label className="toggle-field" key={field.key}>
              <input type="checkbox" checked={input[field.key] === true} onChange={(event) => set(field.key, event.target.checked)} />
              <span>{localized(language, field.label)}</span>
            </label>
          )
        }
        const position = input[field.key] as Position | undefined
        return (
          <div className={`position-field ${selectingKey === field.key ? 'selecting' : ''}`} key={field.key}>
            <span className="position-label">{localized(language, field.label)}</span>
            <label>
              <span>{translate(language, 'row')}</span>
              <input type="number" min="0" value={position?.row ?? 0} onChange={(event) => set(field.key, { row: Number(event.target.value), col: position?.col ?? 0 })} />
            </label>
            <label>
              <span>{translate(language, 'column')}</span>
              <input type="number" min="0" value={position?.col ?? 0} onChange={(event) => set(field.key, { row: position?.row ?? 0, col: Number(event.target.value) })} />
            </label>
            <button
              className="icon-button subtle"
              onClick={() => onSelectingKey(selectingKey === field.key ? undefined : field.key)}
              title={translate(language, 'selectSquare')}
              aria-label={translate(language, 'selectSquare')}
            >
              <Crosshair size={15} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
