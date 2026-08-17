// Small site-wide constants that more than one component needs.

// Where "Open in Google Maps" points. We only have the road, not the house
// number, so the search is for Berrima Road; set NEXT_PUBLIC_MAPS_QUERY to the
// full address (e.g. "12 Berrima Road, Singapore 299xxx") once known — see
// docs/CONTENT-NEEDED.md. These are Google's documented cross-platform URLs:
// they open the Maps app on phones and the website on desktops.
export const MAPS_QUERY = process.env.NEXT_PUBLIC_MAPS_QUERY || "Berrima Road, Singapore";
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_QUERY)}`;
