import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { PanelBottom, PanelsTopLeft, TerminalSquare } from 'lucide-react'
import { AppHeader } from './components/AppHeader'
import { ChessBoard } from './components/ChessBoard'
import { ConsolePanel } from './components/ConsolePanel'
import { EditorPanel } from './components/EditorPanel'
import { EventGuide } from './components/EventGuide'
import { InputControls } from './components/InputControls'
import { PlaybackControls } from './components/PlaybackControls'
import { ProblemPanel } from './components/ProblemPanel'
import { executeStudentCode, type ActiveExecution, ExecutionError } from './execution/runner'
import { exerciseRegistry } from './exercises/registry'
import { isRtlLanguage, localized, translate } from './i18n'
import { emptyConsoleData, type ConsoleData } from './lib/console'
import { clearWorkspace, loadWorkspace, saveWorkspace, type WorkspaceSettings } from './lib/storage'
import { emptyVisualState, sanitizeTrace, stateAtStep } from './lib/trace'
import type { Language, Position, TestResult, Theme, TraceEvent, ValidationResult } from './types/lab'

const exercises = exerciseRegistry.list()
const defaultExercise = exercises[0]!
const cloneInput = (value: Record<string, unknown>): Record<string, unknown> => JSON.parse(JSON.stringify(value)) as Record<string, unknown>
const defaultCodes = (): Record<string, string> => Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise.starterCode]))
const defaultInputs = (): Record<string, Record<string, unknown>> => Object.fromEntries(exercises.map((exercise) => [exercise.id, cloneInput(exercise.defaultInput)]))
const validationMessages: Record<Exclude<Language, 'en'>, { valid: string; invalid: string }> = {
  fa: { valid: 'خروجی از نظر ریاضی معتبر است و همهٔ محدودیت‌های تمرین را برآورده می‌کند.', invalid: 'خروجی با قرارداد یا محدودیت‌های این تمرین سازگار نیست.' },
  pt: { valid: 'O resultado é matematicamente válido e cumpre todas as restrições.', invalid: 'O resultado não cumpre o contrato ou as restrições deste exercício.' },
  fr: { valid: 'Le résultat est mathématiquement valide et respecte toutes les contraintes.', invalid: 'Le résultat ne respecte pas le contrat ou les contraintes de cet exercice.' },
  ru: { valid: 'Результат математически корректен и удовлетворяет всем ограничениям.', invalid: 'Результат не соответствует формату или ограничениям задачи.' },
  ar: { valid: 'النتيجة صحيحة رياضيًا وتحقق جميع قيود التمرين.', invalid: 'النتيجة لا تطابق صيغة هذا التمرين أو قيوده.' },
}
const validationForLanguage = (result: ValidationResult, language: Language): ValidationResult => {
  if (language === 'en') return result
  return { ...result, message: language === 'fa' && result.messageFa ? result.messageFa : validationMessages[language][result.valid ? 'valid' : 'invalid'] }
}

type BusyMode = 'run' | 'test' | null
type MobileTab = 'code' | 'board' | 'console'
type ConsoleView = 'output' | 'tests'

export default function App() {
  const [selectedId, setSelectedId] = useState(defaultExercise.id)
  const [language, setLanguage] = useState<Language>('en')
  const [theme, setTheme] = useState<Theme>(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const [codes, setCodes] = useState<Record<string, string>>(defaultCodes)
  const [inputs, setInputs] = useState<Record<string, Record<string, unknown>>>(defaultInputs)
  const [speed, setSpeed] = useState(2)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)
  const [saved, setSaved] = useState(true)
  const [busy, setBusy] = useState<BusyMode>(null)
  const [consoleData, setConsoleData] = useState<ConsoleData>(emptyConsoleData)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [events, setEvents] = useState<TraceEvent[]>([])
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [editorMode, setEditorMode] = useState<'code' | 'problem'>('code')
  const [mobileTab, setMobileTab] = useState<MobileTab>('code')
  const [consoleView, setConsoleView] = useState<ConsoleView>('output')
  const [selectingKey, setSelectingKey] = useState<string>()
  const [leftPercent, setLeftPercent] = useState(49)
  const [consoleHeight, setConsoleHeight] = useState(232)
  const workspaceRef = useRef<HTMLDivElement>(null)
  const activeExecution = useRef<ActiveExecution | undefined>(undefined)
  const operationId = useRef(0)

  const exercise = exerciseRegistry.get(selectedId) ?? defaultExercise
  const code = codes[exercise.id] ?? exercise.starterCode
  const input = inputs[exercise.id] ?? exercise.defaultInput
  const boardSize = Math.max(1, Math.min(20, Math.floor(exercise.getBoardSize(input))))
  const visualState = useMemo(() => events.length ? stateAtStep(events, step, exercise.piece) : emptyVisualState(), [events, step, exercise.piece])
  const selectedPosition = selectingKey ? input[selectingKey] as Position | undefined : undefined
  const repositoryUrl = import.meta.env.VITE_REPOSITORY_URL ?? 'https://github.com/amirrezapanahi/chess-algorithm-lab'
  const wikiUrl = `${repositoryUrl.replace(/\/$/, '')}/wiki`
  const supportsRuntime = typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined'

  useEffect(() => {
    let live = true
    loadWorkspace()
      .then((stored) => {
        if (!live) return
        if (stored.settings) {
          if (exerciseRegistry.get(stored.settings.selectedExercise)) setSelectedId(stored.settings.selectedExercise)
          setLanguage(stored.settings.language)
          setTheme(stored.settings.theme)
          setSpeed(stored.settings.speed)
          setInputs((current) => ({ ...current, ...stored.settings?.inputs }))
          setCompletedExercises(stored.settings.completedExercises ?? [])
        }
        setCodes((current) => ({ ...current, ...stored.code }))
      })
      .catch(() => setSaved(false))
      .finally(() => { if (live) setLoaded(true) })
    return () => { live = false }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.lang = language
    document.documentElement.dir = isRtlLanguage(language) ? 'rtl' : 'ltr'
  }, [language, theme])

  useEffect(() => {
    if (!loaded) return
    setSaved(false)
    const timer = window.setTimeout(() => {
      const settings: WorkspaceSettings = { selectedExercise: selectedId, language, theme, speed, inputs, completedExercises }
      saveWorkspace(settings, codes).then(() => setSaved(true)).catch(() => setSaved(false))
    }, 600)
    return () => window.clearTimeout(timer)
  }, [codes, completedExercises, inputs, language, loaded, selectedId, speed, theme])

  useEffect(() => {
    if (!playing || step >= events.length) {
      if (step >= events.length) setPlaying(false)
      return
    }
    const timer = window.setTimeout(() => setStep((current) => Math.min(events.length, current + 1)), Math.max(70, 850 / speed))
    return () => window.clearTimeout(timer)
  }, [events.length, playing, speed, step])

  useEffect(() => () => activeExecution.current?.cancel(), [])

  const stopActive = useCallback(() => {
    operationId.current += 1
    activeExecution.current?.cancel()
    activeExecution.current = undefined
    setBusy(null)
  }, [])

  const resetPlayback = useCallback(() => {
    setEvents([])
    setStep(0)
    setPlaying(false)
    setSelectingKey(undefined)
  }, [])

  const selectExercise = (id: string): void => {
    stopActive()
    resetPlayback()
    setSelectedId(id)
    setConsoleData(emptyConsoleData())
    setTestResults([])
    setConsoleView('output')
    setEditorMode('code')
  }

  const runCode = useCallback(async () => {
    if (!supportsRuntime || busy) return
    stopActive()
    const currentOperation = ++operationId.current
    setBusy('run')
    setConsoleData(emptyConsoleData())
    setTestResults([])
    setConsoleView('output')
    resetPlayback()
    const execution = executeStudentCode({ code, input, mode: 'run', timeoutMs: 2_000, maxEvents: 5_000 })
    activeExecution.current = execution
    try {
      const payload = await execution.promise
      if (operationId.current !== currentOperation) return
      const rawValidation = exercise.validate(input, payload.result)
      const validation = validationForLanguage(rawValidation, language)
      const sanitizedStudentEvents = sanitizeTrace(payload.events, boardSize)
      const fallbackEvents = sanitizedStudentEvents.length === 0
        ? sanitizeTrace(exercise.resultToEvents(input, payload.result), boardSize).map((event) => (
            event.type === 'complete' && language !== 'en' ? { ...event, message: translate(language, 'completed') } : event
          ))
        : []
      const nextEvents = sanitizedStudentEvents.length ? sanitizedStudentEvents : fallbackEvents
      const warnings: string[] = []
      if (payload.truncated) warnings.push(translate(language, 'traceTruncated'))
      if (sanitizedStudentEvents.length !== payload.events.length) warnings.push(translate(language, 'invalidEvents'))
      const backtracks = nextEvents.filter((event) => event.type === 'backtrack').length
      setEvents(nextEvents)
      setStep(0)
      setPlaying(nextEvents.length > 0)
      setConsoleData({
        result: payload.result,
        logs: payload.logs,
        validation,
        warnings,
        stats: { durationMs: payload.durationMs, steps: nextEvents.length, backtracks },
      })
      if (rawValidation.valid) setCompletedExercises((current) => current.includes(exercise.id) ? current : [...current, exercise.id])
      setMobileTab(nextEvents.length > 0 ? 'board' : 'console')
    } catch (error) {
      if (operationId.current !== currentOperation) return
      const message = error instanceof Error ? error.message : String(error)
      setConsoleData({ ...emptyConsoleData(), error: message })
      setMobileTab('console')
    } finally {
      if (operationId.current === currentOperation) {
        setBusy(null)
        activeExecution.current = undefined
      }
    }
  }, [boardSize, busy, code, exercise, input, language, resetPlayback, stopActive, supportsRuntime])

  const testCode = useCallback(async () => {
    if (!supportsRuntime || busy) return
    stopActive()
    const currentOperation = ++operationId.current
    setBusy('test')
    setTestResults([])
    setConsoleData(emptyConsoleData())
    setConsoleView('tests')
    resetPlayback()
    const results: TestResult[] = []
    for (const test of exercise.tests) {
      if (operationId.current !== currentOperation) break
      const execution = executeStudentCode({ code, input: test.input, mode: 'test', timeoutMs: 1_500, maxEvents: 0 })
      activeExecution.current = execution
      try {
        const payload = await execution.promise
        const validation = validationForLanguage(exercise.validate(test.input, payload.result), language)
        results.push({ id: test.id, name: localized(language, test.name), passed: validation.valid, message: validation.message, durationMs: payload.durationMs })
      } catch (error) {
        if (operationId.current !== currentOperation) break
        results.push({
          id: test.id,
          name: localized(language, test.name),
          passed: false,
          message: error instanceof ExecutionError ? error.message : String(error),
          durationMs: 0,
        })
      }
      setTestResults([...results])
    }
    if (operationId.current === currentOperation) {
      if (results.length === exercise.tests.length && results.every((result) => result.passed)) {
        setCompletedExercises((current) => current.includes(exercise.id) ? current : [...current, exercise.id])
      }
      setBusy(null)
      activeExecution.current = undefined
      setMobileTab('console')
    }
  }, [busy, code, exercise, language, resetPlayback, stopActive, supportsRuntime])

  const changeInput = (nextInput: Record<string, unknown>): void => {
    setInputs((current) => ({ ...current, [exercise.id]: nextInput }))
    resetPlayback()
  }

  const selectSquare = (position: Position): void => {
    if (!selectingKey) return
    changeInput({ ...input, [selectingKey]: position })
  }

  const importCode = async (file: File): Promise<void> => {
    if (file.size > 200_000) {
      setConsoleData({ ...emptyConsoleData(), error: translate(language, 'fileTooLarge') })
      return
    }
    const source = await file.text()
    setCodes((current) => ({ ...current, [exercise.id]: source }))
  }

  const exportCode = (): void => {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${exercise.slug}-solution.js`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  const resetWorkspace = async (): Promise<void> => {
    if (!window.confirm(translate(language, 'confirmReset'))) return
    stopActive()
    await clearWorkspace().catch(() => undefined)
    setSelectedId(defaultExercise.id)
    setLanguage('en')
    setTheme('light')
    setSpeed(2)
    setCodes(defaultCodes())
    setInputs(defaultInputs())
    setCompletedExercises([])
    setConsoleData(emptyConsoleData())
    setTestResults([])
    setConsoleView('output')
    resetPlayback()
  }

  const resizeColumns = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.preventDefault()
    const bounds = workspaceRef.current?.getBoundingClientRect()
    if (!bounds) return
    const move = (pointer: PointerEvent) => setLeftPercent(Math.max(32, Math.min(68, ((pointer.clientX - bounds.left) / bounds.width) * 100)))
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const resizeConsole = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.preventDefault()
    const move = (pointer: PointerEvent) => setConsoleHeight(Math.max(150, Math.min(390, window.innerHeight - pointer.clientY)))
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const layoutStyle = {
    '--editor-width': `${leftPercent}%`,
    '--console-height': `${consoleHeight}px`,
  } as CSSProperties

  return (
    <div className="app-shell" style={layoutStyle}>
      <AppHeader
        exercises={exercises}
        selectedId={exercise.id}
        language={language}
        theme={theme}
        repositoryUrl={repositoryUrl}
        wikiUrl={wikiUrl}
        saved={saved}
        onExerciseChange={selectExercise}
        onLanguageChange={setLanguage}
        onThemeChange={setTheme}
        onResetWorkspace={() => void resetWorkspace()}
      />
      {!supportsRuntime && <div className="unsupported-banner">{translate(language, 'unsupported')}</div>}
      <nav className="mobile-tabs" aria-label={translate(language, 'appStatus')}>
        <button className={mobileTab === 'code' ? 'active' : ''} onClick={() => setMobileTab('code')}><PanelsTopLeft size={16} />{translate(language, 'mobileCode')}</button>
        <button className={mobileTab === 'board' ? 'active' : ''} onClick={() => setMobileTab('board')}><PanelBottom size={16} />{translate(language, 'mobileBoard')}</button>
        <button className={mobileTab === 'console' ? 'active' : ''} onClick={() => setMobileTab('console')}><TerminalSquare size={16} />{translate(language, 'mobileConsole')}</button>
      </nav>
      <main className="lab-main" ref={workspaceRef}>
        <div className={`top-workspace mobile-${mobileTab}`}>
          <EditorPanel
            code={code}
            language={language}
            theme={theme}
            busy={busy}
            mode={editorMode}
            onModeChange={setEditorMode}
            onChange={(source) => setCodes((current) => ({ ...current, [exercise.id]: source }))}
            onRun={() => void runCode()}
            onTest={() => void testCode()}
            onCancel={stopActive}
            onReset={() => setCodes((current) => ({ ...current, [exercise.id]: exercise.starterCode }))}
            onImport={(file) => void importCode(file)}
            onExport={exportCode}
            problem={<ProblemPanel key={exercise.id} exercise={exercise} language={language} />}
          />
          <div className="resize-handle vertical" onPointerDown={resizeColumns} role="separator" aria-orientation="vertical" />
          <section className="panel visualizer-panel" aria-label={translate(language, 'visualizer')}>
            <div className="panel-toolbar visualizer-toolbar">
              <div><span className="eyebrow">{translate(language, 'visualizer')}</span><h2>{localized(language, exercise.shortTitle)}</h2></div>
              <span className="board-size-badge">{boardSize} × {boardSize}</span>
            </div>
            <div className="visualizer-body">
              <InputControls exercise={exercise} input={input} language={language} selectingKey={selectingKey} onSelectingKey={setSelectingKey} onChange={changeInput} />
              <div className="board-stage">
                <ChessBoard size={boardSize} state={visualState} language={language} selected={selectedPosition} onSelect={selectSquare} />
                {visualState.message && <div className="board-message">{visualState.message}</div>}
              </div>
              <EventGuide language={language} />
            </div>
            <PlaybackControls
              language={language}
              step={step}
              total={events.length}
              playing={playing}
              speed={speed}
              onPlayingChange={setPlaying}
              onStepChange={(nextStep) => { setPlaying(false); setStep(Math.max(0, Math.min(events.length, nextStep))) }}
              onSpeedChange={setSpeed}
            />
          </section>
        </div>
        <div className="resize-handle horizontal" onPointerDown={resizeConsole} role="separator" aria-orientation="horizontal" />
        <div className={`console-slot mobile-${mobileTab}`}>
          <ConsolePanel
            language={language}
            data={consoleData}
            testResults={testResults}
            busy={busy}
            tab={consoleView}
            onTabChange={setConsoleView}
            onClear={() => { setConsoleData(emptyConsoleData()); setTestResults([]) }}
          />
        </div>
      </main>
    </div>
  )
}
