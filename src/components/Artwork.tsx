/** Album or artist artwork, shown exactly as Spotify provides it.
 *
 * Spotify's design guidelines require artwork to be used in its original
 * form: no cropping, distortion, blur, or anything laid over it. Corners
 * are rounded to the 4px the guidelines allow. */
export function Artwork({ src, alt }: { src: string | null | undefined; alt: string }) {
  if (!src) {
    return <span aria-hidden className="block size-12 rounded-[4px] bg-ink-line" />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={48}
      height={48}
      className="block size-12 rounded-[4px] object-cover"
    />
  )
}
