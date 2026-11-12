const GENRE_ICONS = {
  28: '💥',
  12: '🧭',
  16: '🎨',
  35: '😂',
  80: '🕵️',
  99: '🎥',
  18: '🎭',
  10751: '👨‍👩‍👧',
  14: '🧚',
  36: '🏛️',
  27: '👻',
  10402: '🎵',
  9648: '🔍',
  10749: '💕',
  878: '🚀',
  10770: '📺',
  53: '😱',
  10752: '🎖️',
  37: '🤠',
}

const DEFAULT_GENRE_ICON = '🎬'

export const getGenreIcon = (tmdbId) => GENRE_ICONS[tmdbId] ?? DEFAULT_GENRE_ICON

export const allowedGenres = (genres) => genres.filter((genre) => genre.allowed)
