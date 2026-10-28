import Editor, { type OnMount } from '@monaco-editor/react'
import { Download, FileUp, LoaderCircle, Play, RotateCcw, Square, TestTube2 } from 'lucide-react'
import { useRef } from 'react'
import type { Language, Theme } from '../types/lab'
import { translate, type TranslationKey } from '../i18n'

interface EditorPanelProps {
  code: string
  language: Language
  theme: Theme
  busy: 'run' | 'test' | null
  mode: 'code' | 'problem'
  onModeChange: (mode: 'code' | 'problem') => void
  onChange: (value: string) => void
  onRun: () => void
  onTest: () => void
  onCancel: () => void
  onReset: () => void
  onImport: (file: File) => void
  onExport: () => void
  problem: React.ReactNode
}

export function EditorPanel(props: EditorPanelProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const runRef = useRef(props.onRun)
  runRef.current = props.onRun
  const t = (key: TranslationKey) => translate(props.language, key)

  const mount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current())
    editor.focus()
  }

  return (
    <section className="panel editor-panel" aria-label={t('code')} aria-busy={props.busy !== null}>
      <div className="panel-toolbar editor-toolbar">
        <div className="segmented" role="tablist">
          <button className={props.mode === 'code' ? 'active' : ''} onClick={() => props.onModeChange('code')} role="tab" aria-selected={props.mode === 'code'}>{t('code')}</button>
          <button className={props.mode === 'problem' ? 'active' : ''} onClick={() => props.onModeChange('problem')} role="tab" aria-selected={props.mode === 'problem'}>{t('problem')}</button>
        </div>
        <div className="editor-actions">
          {props.busy && <span className="execution-status" role="status"><LoaderCircle size={13} />{t(props.busy === 'run' ? 'running' : 'testing')}</span>}
          <button className="icon-button subtle" onClick={() => fileInput.current?.click()} disabled={props.busy !== null} title={t('import')} aria-label={t('import')}><FileUp size={15} /></button>
          <button className="icon-button subtle" onClick={props.onExport} title={t('export')} aria-label={t('export')}><Download size={15} /></button>
          <button className="icon-button subtle" onClick={props.onReset} disabled={props.busy !== null} title={t('resetCode')} aria-label={t('resetCode')}><RotateCcw size={15} /></button>
          <button className="button secondary" onClick={props.onTest} disabled={props.busy !== null}><TestTube2 size={15} />{t(props.busy === 'test' ? 'testing' : 'test')}</button>
          {props.busy ? (
            <button className="button danger" onClick={props.onCancel}><Square size={14} />{t('cancel')}</button>
          ) : (
            <button className="button primary" onClick={props.onRun}><Play size={15} fill="currentColor" />{t('run')}<kbd>Ctrl/⌘ ↵</kbd></button>
          )}
        </div>
        <input
          ref={fileInput}
          className="sr-only"
          type="file"
          accept=".js,text/javascript"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) props.onImport(file)
            event.currentTarget.value = ''
          }}
        />
      </div>
      <div className="editor-body">
        {props.mode === 'code' ? (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={props.code}
            theme={props.theme === 'dark' ? 'vs-dark' : 'light'}
            loading={<div className="editor-loading">{t('editorLoading')}</div>}
            onChange={(value) => props.onChange(value ?? '')}
            onMount={mount}
            options={{
              automaticLayout: true,
              minimap: { enabled: false },
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              fontSize: 13,
              lineHeight: 21,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              tabSize: 2,
              wordWrap: 'on',
              bracketPairColorization: { enabled: true },
              overviewRulerBorder: false,
              renderLineHighlight: 'gutter',
            }}
          />
        ) : props.problem}
      </div>
    </section>
  )
}
