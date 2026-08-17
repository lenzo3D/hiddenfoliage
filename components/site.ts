// Small site-wide constants that more than one component needs.

// Where "Open in Google Maps" points: the house, 23 Berrima Road (per Richard).
// NEXT_PUBLIC_MAPS_QUERY can override it (e.g. to add the postal code). These
// are Google's documented cross-platform URLs: they open the Maps app on
// phones and the website on desktops.
export const MAPS_QUERY = process.env.NEXT_PUBLIC_MAPS_QUERY || "23 Berrima Road, Singapore";
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_QUERY)}`;
