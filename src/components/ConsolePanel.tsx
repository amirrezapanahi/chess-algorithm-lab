import { Check, CircleAlert, Clock3, Footprints, GitPullRequestArrow, Trash2, X } from 'lucide-react'
import { isRtlLanguage, translate, type TranslationKey } from '../i18n'
import type { ConsoleData } from '../lib/console'
import type { Language, TestResult } from '../types/lab'

interface ConsolePanelProps {
  language: Language
  data: ConsoleData
  testResults: TestResult[]
  busy: 'run' | 'test' | null
  tab: 'output' | 'tests'
  onTabChange: (tab: 'output' | 'tests') => void
  onClear: () => void
}

export function ConsolePanel({ language, data, testResults, busy, tab, onTabChange, onClear }: ConsolePanelProps) {
  const t = (key: TranslationKey) => translate(language, key)
  const passed = testResults.filter((result) => result.passed).length
  return (
    <section className="panel console-panel" aria-label={t('console')} aria-busy={busy !== null}>
      <div className="panel-toolbar console-toolbar">
        <div className="segmented" role="tablist">
          <button className={tab === 'output' ? 'active' : ''} onClick={() => onTabChange('output')} role="tab" aria-selected={tab === 'output'}>{t('output')}</button>
          <button className={tab === 'tests' ? 'active' : ''} onClick={() => onTabChange('tests')} role="tab" aria-selected={tab === 'tests'}>
            {t('tests')}{testResults.length > 0 && <span className={passed === testResults.length ? 'test-count pass' : 'test-count'}>{passed}/{testResults.length}</span>}
          </button>
        </div>
        <button className="icon-button subtle clear-console" onClick={onClear} title={t('clear')} aria-label={t('clear')}><Trash2 size={14} /></button>
      </div>
      <div className="console-body" dir={isRtlLanguage(language) ? 'rtl' : 'ltr'}>
        {busy && <div className="console-running" role="status"><span />{t(busy === 'run' ? 'running' : 'testing')}</div>}
        {tab === 'output' ? (
          <>
            {!data.error && data.result === undefined && !data.validation && data.logs.length === 0 && (
              <div className="console-empty"><span className="prompt-mark">›_</span><p>{t('idleMessage')}</p></div>
            )}
            {data.error && (
              <div className="message-card error-message">
                <CircleAlert size={17} /><div><strong>{t('executionError')}</strong><pre dir="ltr">{data.error}</pre></div>
              </div>
            )}
            {data.validation && (
              <div className={`message-card ${data.validation.valid ? 'success-message' : 'error-message'}`}>
                {data.validation.valid ? <Check size={17} /> : <X size={17} />}
                <div><strong>{t(data.validation.valid ? 'valid' : 'invalid')}</strong><p>{data.validation.message}</p></div>
              </div>
            )}
            {data.warnings.map((warning) => <div className="message-card warning-message" key={warning}><CircleAlert size={16} /><p>{warning}</p></div>)}
            {data.stats && (
              <div className="stats-row">
                <span><Clock3 size={14} />{t('duration')}<strong>{data.stats.durationMs} ms</strong></span>
                <span><Footprints size={14} />{t('steps')}<strong>{data.stats.steps}</strong></span>
                <span><GitPullRequestArrow size={14} />{t('backtracks')}<strong>{data.stats.backtracks ?? 0}</strong></span>
              </div>
            )}
            {data.result !== undefined && (
              <div className="console-block"><h4>{t('result')}</h4><pre dir="ltr">{JSON.stringify(data.result, null, 2)}</pre></div>
            )}
            <div className="console-block"><h4>{t('logs')}</h4>{data.logs.length ? <pre dir="ltr">{data.logs.join('\n')}</pre> : <p className="muted">{t('noLogs')}</p>}</div>
          </>
        ) : testResults.length ? (
          <div className="test-list">
            {testResults.map((result) => (
              <article key={result.id} className={result.passed ? 'test-pass' : 'test-fail'}>
                <span className="test-icon">{result.passed ? <Check size={15} /> : <X size={15} />}</span>
                <div><strong>{result.name}</strong><p>{result.message}</p></div>
                <time>{result.durationMs} ms</time>
              </article>
            ))}
          </div>
        ) : <div className="console-empty"><TestTubeIcon /><p>{t('noTests')}</p></div>}
      </div>
    </section>
  )
}

function TestTubeIcon() {
  return <span className="prompt-mark">✓?</span>
}
