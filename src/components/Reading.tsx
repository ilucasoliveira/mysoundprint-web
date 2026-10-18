import type { Reading as ReadingData } from '../lib/readings'

type Tone = 'flare' | 'amber' | 'paper'

const TONES: Record<Tone, string> = {
  flare: 'text-flare',
  amber: 'text-amber',
  paper: 'text-paper',
}

const VALUE =
  'shrink-0 min-w-[4.5rem] text-4xl font-extrabold tabular-nums tracking-[-0.04em] lg:min-w-0 lg:text-display'

/** Number beside sentence until the row splits into three columns, then number
 *  above sentence.
 *
 *  Stacked is the right shape at three columns, where each reading owns a
 *  column and has the width to spare. It is the wrong shape on a phone: three
 *  stacked readings run close to a full screen before the first chart, and the
 *  page reads as three competing headlines rather than a short list of
 *  findings. Side by side, each one is a line. The fixed minimum on the number
 *  keeps the sentences left aligned with each other even though 40% and 18.4%
 *  are different widths, and the shared baseline sets the first line of the
 *  sentence against the foot of the number. */
function ReadingLayout({ value, children }: { value: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 lg:block">
      {value}
      <div className="min-w-0 lg:mt-3">{children}</div>
    </div>
  )
}

interface ReadingProps extends ReadingData {
  tone?: Tone
}

/** One statistic, set the way Wrapped sets them: the number big enough to read
 *  from across the room, the sentence that explains it right beside it. */
export function Reading({ value, sentence, note, tone = 'paper' }: ReadingProps) {
  return (
    <ReadingLayout value={<p className={`${VALUE} ${TONES[tone]}`}>{value}</p>}>
      <p className="max-w-[26ch] leading-snug lg:text-lg">{sentence}</p>
      {note && <p className="mt-1.5 max-w-[34ch] text-sm text-paper-dim lg:mt-2">{note}</p>}
    </ReadingLayout>
  )
}

/** Holds the slot while the request is in flight, or when there is nothing to
 *  read yet. The greyed digits keep the row from jumping once the real number
 *  arrives, and they are hidden from screen readers because they are furniture,
 *  not data. */
export function ReadingPending({ label }: { label: string }) {
  return (
    <ReadingLayout
      value={
        <p className={`${VALUE} text-ink-line`} aria-hidden="true">
          00%
        </p>
      }
    >
      <p className="max-w-[26ch] leading-snug text-paper-dim lg:text-lg" role="status">
        {label}
      </p>
    </ReadingLayout>
  )
}
