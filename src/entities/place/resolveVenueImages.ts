interface ImagePlace {
  thumbnailImage: string | null;
  largeImage: string | null;
}

interface ImageVenue {
  thumbnailImage: string | null;
  largeImage: string | null;
}

export interface ResolvedVenueImages {
  thumbnailImage: string | null;
  largeImage: string | null;
}

// Если у точки не заданы свои изображения — используются изображения места
export function resolveVenueImages(place: ImagePlace, venue: ImageVenue): ResolvedVenueImages {
  return {
    thumbnailImage: venue.thumbnailImage ?? place.thumbnailImage,
    largeImage: venue.largeImage ?? place.largeImage,
  };
}
