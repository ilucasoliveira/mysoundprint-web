import { Link } from 'react-router-dom'

import { DecadeChart } from '../components/DecadeChart'
import { useApi } from '../hooks/useApi'
import { useCopy } from '../i18n/context'
import { loginUrl } from '../lib/api'
import type { DecadeDistribution } from '../types'

/** The hero shows the product working, using the public demo data, rather
 *  than describing it. */
export function Home() {
  const copy = useCopy()
  const decades = useApi<DecadeDistribution>('/demo/decades')

  return (
    <div className="space-y-16">
      <section className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end">
        <div>
          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-7xl">
            {copy.home.titleTop}
            <br />
            {copy.home.titleBottom}
          </h1>
          <p className="mt-6 max-w-prose text-lg text-paper-dim">{copy.home.lede}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={loginUrl}
              className="bg-flare px-5 py-3 font-semibold text-ink hover:bg-paper"
            >
              {copy.home.signIn}
            </a>
            <Link to="/demo" className="px-1 py-3 underline underline-offset-4 hover:text-flare">
              {copy.home.demoLink}
            </Link>
          </div>
          <p className="mt-4 max-w-prose text-sm text-paper-dim">{copy.home.devModeNote}</p>
        </div>

        <div className="rounded-sm border border-ink-line bg-ink-raised p-6">
          <p className="mb-5 text-sm text-paper-dim">{copy.home.chartCaption}</p>
          {decades.data ? (
            <DecadeChart decades={decades.data.decades} />
          ) : (
            <p className="text-sm text-paper-dim">
              {decades.error ? copy.home.waking : copy.home.loading}
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-ink-line pt-10">
        <h2 className="text-2xl font-bold tracking-tight">{copy.home.howItWorks}</h2>
        <div className="mt-6 grid gap-8 text-sm sm:grid-cols-3">
          <p>{copy.home.how1}</p>
          <p>{copy.home.how2}</p>
          <p>{copy.home.how3}</p>
        </div>
      </section>
    </div>
  )
}
