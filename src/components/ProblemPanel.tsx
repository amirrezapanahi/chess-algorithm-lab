import { BookOpen, ChevronRight, Lightbulb, Target } from 'lucide-react'
import { useState } from 'react'
import { isRtlLanguage, localized, translate, type TranslationKey } from '../i18n'
import type { ExerciseDefinition, Language } from '../types/lab'

interface ProblemPanelProps {
  exercise: ExerciseDefinition
  language: Language
}

export function ProblemPanel({ exercise, language }: ProblemPanelProps) {
  const [visibleHints, setVisibleHints] = useState(0)
  const t = (key: TranslationKey) => translate(language, key)
  return (
    <div className="problem-scroll">
      <div className="problem-hero">
        <span className={`difficulty ${exercise.difficulty}`}>{t(exercise.difficulty)}</span>
        <h2>{localized(language, exercise.title)}</h2>
        <p>{localized(language, exercise.description)}</p>
        <div className="concept-chips">
          {exercise.concepts.map((concept) => <span key={concept.en}>{localized(language, concept)}</span>)}
        </div>
      </div>

      <div className="problem-section">
        <h3><Target size={17} />{t('objectives')}</h3>
        <ul>{exercise.objectives.map((objective) => <li key={objective.en}>{localized(language, objective)}</li>)}</ul>
      </div>
      <div className="spec-grid">
        <div><h3>{t('inputSpec')}</h3><p className="code-spec" dir="ltr">{localized(language, exercise.inputSpec)}</p></div>
        <div><h3>{t('outputSpec')}</h3><p className="code-spec" dir="ltr">{localized(language, exercise.outputSpec)}</p></div>
      </div>
      <div className="problem-section">
        <h3><BookOpen size={17} />{t('constraints')}</h3>
        <ul>{exercise.constraints.map((constraint) => <li key={constraint.en}>{localized(language, constraint)}</li>)}</ul>
      </div>
      <div className="problem-section hint-section">
        <h3><Lightbulb size={17} />{t('hints')}</h3>
        <ol>
          {exercise.hints.slice(0, visibleHints).map((hint) => <li key={hint.en}>{localized(language, hint)}</li>)}
        </ol>
        {visibleHints < exercise.hints.length && (
          <button className="text-button" onClick={() => setVisibleHints((count) => count + 1)}>
            {t('revealHint')}<ChevronRight size={15} className={isRtlLanguage(language) ? 'rtl-flip' : ''} />
          </button>
        )}
      </div>
    </div>
  )
}
