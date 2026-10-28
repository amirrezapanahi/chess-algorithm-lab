import { describe, expect, it } from 'vitest'
import rookAttack from './exercises/rook-attack'
import { isRtlLanguage, languages, localized, translate } from './i18n'

describe('internationalization', () => {
  it('registers six unique interface languages', () => {
    expect(languages).toHaveLength(6)
    expect(new Set(languages.map(({ code }) => code)).size).toBe(6)
  })

  it('uses RTL only for Persian and Arabic', () => {
    expect(isRtlLanguage('fa')).toBe(true)
    expect(isRtlLanguage('ar')).toBe(true)
    expect(isRtlLanguage('en')).toBe(false)
    expect(isRtlLanguage('pt')).toBe(false)
    expect(isRtlLanguage('fr')).toBe(false)
    expect(isRtlLanguage('ru')).toBe(false)
  })

  it('translates interface and exercise content in every added language', () => {
    for (const language of ['pt', 'fr', 'ru', 'ar'] as const) {
      expect(translate(language, 'run')).not.toBe(translate('en', 'run'))
      expect(localized(language, rookAttack.title)).not.toBe(rookAttack.title.en)
      expect(localized(language, rookAttack.description)).not.toBe(rookAttack.description.en)
    }
  })
})
