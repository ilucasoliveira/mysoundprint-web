import { useCopy } from '../i18n/context'

interface MessageProps {
  title: string
  body?: string
  action?: React.ReactNode
}

export function Panel({ title, body, action }: MessageProps) {
  return (
    <div className="rounded-sm border border-ink-line bg-ink-raised px-6 py-8">
      <p className="text-lg font-semibold">{title}</p>
      {body && <p className="mt-2 max-w-prose text-paper-dim">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Loading({ label }: { label: string }) {
  return (
    <div
      className="rounded-sm border border-ink-line bg-ink-raised px-6 py-8 text-paper-dim"
      role="status"
      aria-live="polite"
    >
      {label}
    </div>
  )
}

export function Waking() {
  const copy = useCopy()
  return <Panel title={copy.states.wakingTitle} body={copy.states.wakingBody} />
}
