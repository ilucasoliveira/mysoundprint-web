interface FigureProps {
  /** What the reader takes away, written as a sentence. */
  heading: string
  /** The question the numbers answer, in the reader's words. */
  caption?: string
  children: React.ReactNode
}

/** A titled block of one chart or list.
 *
 * Every statistic is framed as a finding rather than a label, because the
 * point of this project is the reading, not the raw numbers. */
export function Figure({ heading, caption, children }: FigureProps) {
  return (
    <section className="border-t border-ink-line pt-8">
      <h2 className="max-w-2xl text-2xl font-bold tracking-tight">{heading}</h2>
      {caption && <p className="mt-1 max-w-prose text-sm text-paper-dim">{caption}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}
