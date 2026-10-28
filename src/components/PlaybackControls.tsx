import { Gauge, Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { translate, type TranslationKey } from '../i18n'
import type { Language } from '../types/lab'

interface PlaybackControlsProps {
  language: Language
  step: number
  total: number
  playing: boolean
  speed: number
  onPlayingChange: (playing: boolean) => void
  onStepChange: (step: number) => void
  onSpeedChange: (speed: number) => void
}

export function PlaybackControls(props: PlaybackControlsProps) {
  const t = (key: TranslationKey) => translate(props.language, key)
  const disabled = props.total === 0
  return (
    <div className="playback">
      <div className="playback-buttons">
        <button className="icon-button" disabled={disabled || props.step === 0} onClick={() => props.onStepChange(0)} title={t('restart')} aria-label={t('restart')}><RotateCcw size={16} /></button>
        <button className="icon-button" disabled={disabled || props.step === 0} onClick={() => props.onStepChange(props.step - 1)} title={t('previous')} aria-label={t('previous')}><SkipBack size={16} /></button>
        <button className="icon-button play-button" disabled={disabled} onClick={() => props.onPlayingChange(!props.playing)} title={t(props.playing ? 'pause' : 'play')} aria-label={t(props.playing ? 'pause' : 'play')}>
          {props.playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
        </button>
        <button className="icon-button" disabled={disabled || props.step >= props.total} onClick={() => props.onStepChange(props.step + 1)} title={t('next')} aria-label={t('next')}><SkipForward size={16} /></button>
        <button className="text-button compact" disabled={disabled || props.step >= props.total} onClick={() => props.onStepChange(props.total)}>{t('finish')}</button>
      </div>
      <div className="timeline-group">
        <span className="step-count">{t('step')} <strong>{props.step}</strong> {t('of')} {props.total}</span>
        <input
          className="timeline"
          type="range"
          min="0"
          max={Math.max(1, props.total)}
          value={props.step}
          disabled={disabled}
          onChange={(event) => props.onStepChange(Number(event.target.value))}
          aria-label={t('step')}
          style={{ '--progress': `${props.total ? (props.step / props.total) * 100 : 0}%` } as React.CSSProperties}
        />
      </div>
      <label className="speed-control">
        <Gauge size={15} />
        <span>{t('speed')}</span>
        <input type="range" min="1" max="5" value={props.speed} onChange={(event) => props.onSpeedChange(Number(event.target.value))} />
        <strong>{props.speed}×</strong>
      </label>
    </div>
  )
}
