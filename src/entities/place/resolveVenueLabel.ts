interface LabelPlace {
  name: string;
}

interface LabelVenue {
  name: string | null;
}

// Если у точки нет своего названия — показываем просто название места,
// без пустого " — " (актуально, когда у места всего одна точка)
export function resolveVenueLabel(place: LabelPlace, venue: LabelVenue): string {
  return venue.name ? `${place.name} — ${venue.name}` : place.name;
}
