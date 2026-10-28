import { CircleAlert, CornerUpLeft, Crown, Eye, Plus } from 'lucide-react'
import { translate } from '../i18n'
import type { Language } from '../types/lab'

export function EventGuide({ language }: { language: Language }) {
  const items = [
    [Plus, 'placeEvent', 'event-place'],
    [Eye, 'visitEvent', 'event-visit'],
    [CircleAlert, 'conflictEvent', 'event-conflict'],
    [CornerUpLeft, 'backtrackEvent', 'event-backtrack'],
    [Crown, 'solutionEvent', 'event-solution'],
  ] as const
  return (
    <details className="event-guide">
      <summary>{translate(language, 'eventGuide')}</summary>
      <div>{items.map(([Icon, key, className]) => <span key={key}><i className={className}><Icon size={13} /></i>{translate(language, key)}</span>)}</div>
    </details>
  )
}
