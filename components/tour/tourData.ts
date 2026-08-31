// The virtual tour's map: which rooms have panoramas, where they sit on the
// floor plans (drawing coordinates from floorPlans.ts), how they link to each
// other inside the viewer, and which style variants exist per room.
//
// Panoramas are 3548×1774 equirectangular JPEGs (the client's 360 renders
// through the same Real-ESRGAN pass as the films). Yaw convention: the image
// centre is 0°, left edge −180°, right edge +180°. `yaw0` is the opening view;
// each link's yaw points at the doorway or opening that leads to the target.
//
// Adding a style later = one line in `styles`. Adding a room = one entry here
// (marker coordinates from the level's drawing in floorPlans.ts).

const X2 = (x: number) => (x - 875) * 1.146 + 990;
const Y2 = (y: number) => (y - 170) * 1.12 + 592;

export type TourStyle = { id: string; label: string; src: string };
export type TourLink = { to: string; yaw: number; pitch?: number; label: string };
export type TourRoom = {
  id: string;
  name: string;
  level: "first" | "second";
  /** Marker position in the plan drawing's coordinate space. */
  marker: { x: number; y: number };
  yaw0: number;
  styles: TourStyle[];
  links: TourLink[];
};

export const TOUR_ROOMS: TourRoom[] = [
  {
    id: "porch",
    name: "Car porch",
    level: "first",
    marker: { x: 400, y: 660 },
    yaw0: -8,
    styles: [{ id: "day", label: "Daytime", src: "/images/360/porch.jpg" }],
    links: [{ to: "living", yaw: -8, pitch: -2, label: "Living area" }],
  },
  {
    id: "living",
    name: "Living area",
    level: "first",
    marker: { x: 770, y: 730 },
    yaw0: 0,
    styles: [
      { id: "day", label: "Daytime", src: "/images/360/living-day.jpg" },
      { id: "evening", label: "Evening", src: "/images/360/living.jpg" },
    ],
    links: [{ to: "porch", yaw: -29, pitch: -2, label: "Car porch" }],
  },
  {
    id: "bedroom",
    name: "Master bedroom",
    level: "second",
    marker: { x: X2(676), y: Y2(330) },
    yaw0: 10,
    styles: [{ id: "day", label: "Daytime", src: "/images/360/bedroom.jpg" }],
    links: [{ to: "bathroom", yaw: -173, pitch: -2, label: "Master bathroom" }],
  },
  {
    id: "bathroom",
    name: "Master bathroom",
    level: "second",
    marker: { x: X2(651), y: Y2(200) },
    yaw0: 25,
    styles: [{ id: "day", label: "Evening", src: "/images/360/bathroom.jpg" }],
    links: [{ to: "bedroom", yaw: -169, pitch: -2, label: "Master bedroom" }],
  },
];

export const roomById = (id: string) => TOUR_ROOMS.find((r) => r.id === id);
