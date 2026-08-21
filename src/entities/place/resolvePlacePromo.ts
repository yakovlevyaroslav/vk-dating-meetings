interface PromoPlace {
  hasBonus: boolean;
  description: string;
  promoDescription: string | null;
  promoCode: string | null;
}

interface PromoVenue {
  hasBonus: boolean;
  description: string | null;
  promoDescription: string | null;
  promoCode: string | null;
}

export interface ResolvedVenuePromo {
  description: string;
  hasBonus: boolean;
  promoDescription: string | null;
  promoCode: string | null;
}

// Промокод точки показываем, если «Есть бонус» стоит у точки ИЛИ у всей сети сразу —
// независимо от того, заполнены ли сами поля промокода (у точки или у места).
// Если у точки есть своё описание промо — код берём только у точки (не подставляем код места),
// т.к. описание точки может относиться к акции, которой у места в целом нет.
export function resolveVenuePromo(place: PromoPlace, venue: PromoVenue): ResolvedVenuePromo {
  const hasBonus = venue.hasBonus || place.hasBonus;
  const venuePromoDescription = venue.promoDescription ?? null;

  const promoDescription = hasBonus ? (venuePromoDescription ?? place.promoDescription ?? null) : null;
  const promoCode = hasBonus
    ? (venuePromoDescription
        ? (venue.promoCode ?? null)
        : (venue.promoCode ?? place.promoCode ?? null))
    : null;

  return {
    description: venue.description ?? place.description,
    hasBonus,
    promoDescription,
    promoCode,
  };
}
