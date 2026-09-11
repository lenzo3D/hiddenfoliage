// The virtual tour's map: which rooms have panoramas, where they sit on the
// floor plans (drawing coordinates from floorPlans.ts), how they link to each
// other inside the viewer, and which style variants exist per room.
//
// Each panorama is a Pannellum multires tile set in `public/images/360/<room>-v4/`
// (`-v5` for the living room, whose drawings were also straightened; `src` is that directory): six cube faces of 4512 px cut into 512 px JPEG
// tiles over five levels, from a 14192×4536 equirectangular strip covering
// ±57.5° of latitude. The client's 360 drawings are CYLINDRICAL panoramas
// (vertical = R·tan(latitude), R = W/2π), not equirectangular — rendered on a
// sphere every straight line bowed. Each one is seam-inpainted across its wrap
// join (LaMa), upscaled 4x (4xNomos8kDAT) and 2x again on the GPU, re-projected
// to a true equirectangular strip (cyl2equi), then cut into cube tiles
// (equi2tiles); recipe in docs/HANDOFF.md. The living room's two drawings first go
// through scripts/tour/straighten/ (trace + warp): their two ends disagreed by up to
// 79 px below eye level, and the seam between them sat on the pool wall, so the pool
// read as a bowl. The warp makes each pool line one continuous line across the seam. Yaw convention: the image centre is
// 0°, left edge −180°, right edge +180°. `yaw0` is the opening view; each
// link's yaw points at the doorway or opening that leads to the target, checked
// against the floor plan by re-projecting each room (see the "Tour:" commits).
//
// Adding a style later = one line in `styles`. Adding a room = one entry here
// (marker coordinates from the level's drawing in floorPlans.ts).

const X2 = (x: number) => (x - 875) * 1.146 + 990;
const Y2 = (y: number) => (y - 170) * 1.12 + 592;

// A style may carry its own opening view and links when its drawing lays the room out
// differently from the room's other style (the generated daytime living room does).
export type TourStyle = { id: string; label: string; src: string; yaw0?: number; yawBounds?: [number, number]; links?: TourLink[] };
/** `walk`: the two drawings show the same open-plan space, so the move plays as a step forward (floor arrow). */
export type TourLink = { to: string; yaw: number; pitch?: number; label: string; walk?: boolean };
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
    // Opens facing the drive and the gate; the front door is behind the camera.
    yaw0: 0,
    styles: [{ id: "day", label: "Daytime", src: "/images/360/porch-v5" }],
    links: [{ to: "living", yaw: 180, pitch: -2, label: "Living area", walk: true }],
  },
  {
    id: "living",
    name: "Living area",
    level: "first",
    marker: { x: 770, y: 730 },
    yaw0: 0,
    styles: [
      {
        id: "day",
        label: "Daytime",
        yawBounds: [-120, 150], // View edges: shelving on the left, pool glazing on the right.
        src: "/images/360/living-day-v8", // generated 2026-09-11 from the developer's render: shelving wall, sofas, pool to the right
        yaw0: -22, // the shelving wall and sofas, with the dining arrow in view at the right edge
        links: [
          { to: "porch", label: "Car porch", yaw: -160, pitch: -4, walk: true }, // the door at the far left
          { to: "dining", label: "Dining area", yaw: 8, pitch: -3, walk: true }, // the table at the far end
        ],
      },
      { id: "evening", label: "Evening", src: "/images/360/living-v6" },
    ],
    links: [
      // The porch is on the plan's road side, left of the shelving wall; the
      // opening between the timber wall and the pillar (yaw −80) leads that way.
      { to: "porch", yaw: -80, pitch: -2, label: "Car porch", walk: true },
      { to: "dining", yaw: 100, pitch: -3, label: "Dining area", walk: true },
    ],
  },
  {
    id: "dining",
    name: "Dining area",
    level: "first",
    marker: { x: 1180, y: 720 },
    yaw0: 0,
    styles: [
      {
        id: "day",
        label: "Daytime",
        yawBounds: [-150, 140], // Limit view edges before the inconsistent rear wrap and timber door.
        src: "/images/360/dining-v6", // generated 2026-09-10 from the developer's render (drawn-panorama class; seamless, verticals bow ~11 px)
        yaw0: 0, // the table, glazing and pool to the left, kitchen and timber wall to the right
        links: [{ to: "living", yaw: -2, pitch: -3, label: "Living area", walk: true }], // the sofas at the far end of the room
      },
    ],
    links: [{ to: "living", yaw: -145, pitch: -3, label: "Living area", walk: true }],
  },
  {
    id: "bedroom",
    name: "Master bedroom",
    level: "second",
    marker: { x: X2(676), y: Y2(330) },
    yaw0: 10,
    styles: [{ id: "day", label: "Daytime", src: "/images/360/bedroom-v5" }],
    links: [{ to: "bathroom", yaw: -173, pitch: -2, label: "Master bathroom" }],
  },
  {
    id: "bathroom",
    name: "Master bathroom",
    level: "second",
    marker: { x: X2(651), y: Y2(200) },
    yaw0: 25,
    styles: [{ id: "evening", label: "Evening", src: "/images/360/bathroom-v5" }],
    links: [{ to: "bedroom", yaw: -169, pitch: -2, label: "Master bedroom" }],
  },
];

export const roomById = (id: string) => TOUR_ROOMS.find((r) => r.id === id);
