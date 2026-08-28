import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Plays a YouTube video inside the page rather than sending people to youtube.com.
 *
 * The iframe is only mounted once someone presses play — until then the poster is
 * just an image, so YouTube sets no cookies and loads no scripts on first paint.
 * `playsinline` matters on iOS, where the default is to hijack the video into the
 * system fullscreen player and pull the viewer off the site.
 */
export function YouTubeEmbed({
  id,
  title,
  className = "",
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  // maxres isn't generated for every upload; fall back to the always-present hq copy.
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white`;

  return (
    <div className={`relative aspect-video overflow-hidden rounded-2xl bg-maroon-deep shadow-[var(--shadow-warm)] ${className}`}>
      {playing ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 w-full h-full cursor-pointer"
          aria-label={`Play video: ${title}`}
        >
          <img
            src={poster}
            alt=""
            loading="lazy"
            onError={() => setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
            className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-[color:var(--maroon-deep)]/80 via-[color:var(--maroon-deep)]/10 to-transparent" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid place-items-center size-20 rounded-full bg-gold text-maroon-deep shadow-lg transition duration-300 group-hover:scale-110">
              <Play className="size-9 fill-current translate-x-0.5" strokeWidth={1.5} />
            </span>
          </span>
          <span className="absolute bottom-5 left-5 right-5 text-left text-cream">
            <span className="block font-display text-lg md:text-xl leading-snug drop-shadow">{title}</span>
            <span className="block text-xs text-cream/75 mt-1">Press play — the film runs here on this page.</span>
          </span>
        </button>
      )}
    </div>
  );
}
