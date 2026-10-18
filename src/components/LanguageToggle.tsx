import { LANGUAGES, type Language, useLanguage } from '../i18n/context'

const LABELS: Record<Language, string> = { en: 'EN', pt: 'PT' }

/** Two buttons rather than a select: with exactly two options a dropdown costs
 *  a click to show what a pair of labels already shows. */
export function LanguageToggle() {
  const { language, setLanguage, copy } = useLanguage()

  return (
    <div className="flex items-center gap-1" role="group" aria-label={copy.nav.language}>
      {LANGUAGES.map((option) => (
        <button
          key={option}
          type="button"
          lang={option === 'pt' ? 'pt-BR' : 'en'}
          onClick={() => setLanguage(option)}
          aria-pressed={option === language}
          className={`px-1.5 py-0.5 text-xs font-semibold tracking-wide ${
            option === language ? 'text-paper' : 'text-paper-dim hover:text-paper'
          }`}
        >
          {LABELS[option]}
        </button>
      ))}
    </div>
  )
}
