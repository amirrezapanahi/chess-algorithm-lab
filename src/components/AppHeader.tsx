import { BookOpen, Check, ChevronDown, Github, Languages, Moon, Settings, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { languages, localized, translate, type TranslationKey } from '../i18n'
import type { ExerciseDefinition, Language, Theme } from '../types/lab'

interface AppHeaderProps {
  exercises: ExerciseDefinition[]
  selectedId: string
  language: Language
  theme: Theme
  repositoryUrl: string
  wikiUrl: string
  saved: boolean
  onExerciseChange: (id: string) => void
  onLanguageChange: (language: Language) => void
  onThemeChange: (theme: Theme) => void
  onResetWorkspace: () => void
}

export function AppHeader(props: AppHeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)
  const t = (key: TranslationKey) => translate(props.language, key)
  const currentLanguage = languages.find(({ code }) => code === props.language) ?? languages[0]!

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) setSettingsOpen(false)
      if (!languageRef.current?.contains(event.target as Node)) setLanguageOpen(false)
    }
    window.addEventListener('pointerdown', close)
    return () => window.removeEventListener('pointerdown', close)
  }, [])

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true"><span>♞</span><i /></div>
        <div><h1>{t('appName')}</h1><p>{t('appTagline')}</p></div>
      </div>
      <div className="exercise-picker">
        <label htmlFor="exercise-select">{t('exercise')}</label>
        <div className="select-wrap">
          <select id="exercise-select" value={props.selectedId} onChange={(event) => props.onExerciseChange(event.target.value)}>
            {props.exercises.map((exercise, index) => <option key={exercise.id} value={exercise.id}>{String(index + 1).padStart(2, '0')} · {localized(props.language, exercise.shortTitle)}</option>)}
          </select>
          <ChevronDown size={15} />
        </div>
      </div>
      <div className="header-actions">
        <span className={`save-indicator ${props.saved ? 'saved' : ''}`}><Check size={13} />{t('localOnly')}</span>
        <a className="icon-button header-icon wiki-link" href={props.wikiUrl} target="_blank" rel="noreferrer" title={t('wiki')} aria-label={t('wiki')}><BookOpen size={18} /></a>
        <a className="icon-button header-icon" href={props.repositoryUrl} target="_blank" rel="noreferrer" title={t('repository')} aria-label={t('repository')}><Github size={18} /></a>
        <button className="icon-button header-icon" onClick={() => props.onThemeChange(props.theme === 'dark' ? 'light' : 'dark')} title={t(props.theme === 'dark' ? 'lightTheme' : 'darkTheme')} aria-label={t(props.theme === 'dark' ? 'lightTheme' : 'darkTheme')}>
          {props.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="language-wrap" ref={languageRef}>
          <button className="language-button" onClick={() => setLanguageOpen((open) => !open)} title={t('language')} aria-label={t('language')} aria-expanded={languageOpen}>
            <Languages size={16} /><span>{currentLanguage.short}</span><ChevronDown size={12} />
          </button>
          {languageOpen && (
            <div className="language-menu" role="menu" aria-label={t('language')}>
              <div className="menu-heading"><Languages size={14} /><strong>{t('language')}</strong></div>
              <div className="language-grid">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    className={item.code === props.language ? 'active' : ''}
                    dir={item.rtl ? 'rtl' : 'ltr'}
                    onClick={() => { props.onLanguageChange(item.code); setLanguageOpen(false) }}
                    role="menuitem"
                  >
                    <span className="language-code">{item.short}</span>
                    <span>{item.label}</span>
                    {item.code === props.language && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="settings-wrap" ref={settingsRef}>
          <button className="icon-button header-icon" onClick={() => setSettingsOpen((open) => !open)} title={t('settings')} aria-label={t('settings')} aria-expanded={settingsOpen}><Settings size={18} /></button>
          {settingsOpen && (
            <div className="settings-menu">
              <strong>{t('settings')}</strong>
              <p>{t('storageNote')}</p>
              <div className="settings-links">
                <button onClick={() => props.onThemeChange(props.theme === 'dark' ? 'light' : 'dark')}>
                  {props.theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{t(props.theme === 'dark' ? 'lightTheme' : 'darkTheme')}</span>
                </button>
                <a href={props.wikiUrl} target="_blank" rel="noreferrer"><BookOpen size={15} /><span>{t('wiki')}</span></a>
                <a href={props.repositoryUrl} target="_blank" rel="noreferrer"><Github size={15} /><span>{t('repository')}</span></a>
              </div>
              <button className="menu-danger" onClick={props.onResetWorkspace}>{t('resetWorkspace')}</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
