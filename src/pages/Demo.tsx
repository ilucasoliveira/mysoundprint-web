import { StatsView } from '../components/StatsView'
import { useCopy } from '../i18n/context'

export function Demo() {
  const copy = useCopy()

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-extrabold tracking-[-0.03em]">{copy.demo.title}</h1>
        <p className="mt-3 max-w-prose text-paper-dim">{copy.demo.lede}</p>
      </header>
      <StatsView prefix="/demo" authenticated={false} />
    </div>
  )
}
