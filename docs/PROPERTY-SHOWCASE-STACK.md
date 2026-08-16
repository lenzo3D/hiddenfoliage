# Property Showcase Stack — Claude Code Reference

This document defines the animation and 3D stack for property showcase websites. Claude Code must read this before writing any animation or 3D code in this project.

---

## Stack

- **GSAP 3.12+** (via CDN: `gsap.min.js` + `ScrollTrigger.min.js`)
- **Three.js r160+** (via CDN or npm, with addons: GLTFLoader, OrbitControls)
- **No frameworks required** — vanilla HTML/CSS/JS unless the project specifies React/Next
- **No jQuery, no Animate.css, no AOS** — GSAP handles everything

CDN links (always use these versions or newer):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

Always call `gsap.registerPlugin(ScrollTrigger)` before any ScrollTrigger code.

---

## GSAP Core API

### Tween types

```js
gsap.to(target, { vars })     // animate TO these values
gsap.from(target, { vars })   // animate FROM these values (ends at CSS natural state)
gsap.fromTo(target, { from }, { to })  // explicit start and end
gsap.set(target, { vars })    // instant set, no animation
```

### Common properties

Transform shorthand (GSAP provides these — they map to CSS transforms but are faster):
- `x`, `y` — translateX/Y in pixels (or use `xPercent`, `yPercent` for %)
- `scale`, `scaleX`, `scaleY`
- `rotation` — degrees (not radians)
- `skewX`, `skewY`

Other animatable:
- `opacity`
- `width`, `height`, `borderRadius` — any CSS property in camelCase
- Custom object properties (for counters, progress bars, etc.)

### Easing

Always specify an ease. Default (`power1.out`) is bland.

Common eases for property sites:
- `power3.out` — smooth deceleration, best for entrance animations
- `power2.inOut` — smooth both directions, best for scrub animations
- `none` or `linear` — for scroll-scrubbed animations where GSAP shouldn't add its own curve
- `expo.out` — dramatic deceleration, use sparingly (hero entrances)
- `back.out(1.4)` — slight overshoot, playful but not appropriate for luxury

### Stagger

```js
gsap.from(".items", {
  y: 40, opacity: 0,
  stagger: 0.1,       // simple: 0.1s between each
  stagger: {           // advanced:
    each: 0.1,
    from: "center",    // "start", "end", "center", "edges", "random"
  }
});
```

### Timelines

```js
const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power3.out" } });

tl.from(".el-1", { y: 40, opacity: 0 })
  .from(".el-2", { y: 40, opacity: 0 }, "-=0.3")   // overlap 0.3s
  .from(".el-3", { y: 40, opacity: 0 }, "<")         // same start as previous
  .from(".el-4", { y: 40, opacity: 0 }, "+=0.2");    // 0.2s gap after previous
```

Position parameter shortcuts:
- `"-=0.3"` — start 0.3s before previous ends (overlap)
- `"+=0.2"` — start 0.2s after previous ends (gap)
- `"<"` — same start time as previous tween
- `"<0.1"` — 0.1s after previous tween starts

---

## ScrollTrigger Patterns

### Pattern 1: Trigger-and-play (one-shot)

Element enters viewport → animation plays once.

```js
gsap.from(".section-title", {
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".section-title",   // element that triggers
    start: "top 80%",            // when TOP of trigger hits 80% down viewport
    toggleActions: "play none none none"
  }
});
```

`toggleActions` = 4 states: `onEnter onLeave onEnterBack onLeaveBack`
Values: `play`, `pause`, `resume`, `reset`, `restart`, `complete`, `reverse`, `none`

Common combos:
- `"play none none none"` — play once, never reverse (most common)
- `"play none none reverse"` — play on enter, reverse on scroll back up
- `"play pause resume pause"` — pause when leaving viewport, resume when re-entering

### Pattern 2: Scrub (scroll-linked)

Animation progress is tied to scroll position. User controls speed.

```js
gsap.to(".element", {
  x: -500,
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: "bottom top",
    scrub: true,       // boolean: direct link (can feel jerky)
    scrub: 1,          // number: smoothing in seconds (1 = 1s lag, feels smooth)
    scrub: 0.5,        // 0.5s lag — good default for most scrub animations
  }
});
```

**IMPORTANT**: When using `scrub`, the tween's `duration` is IGNORED — scroll distance determines speed. The `ease` still applies (use `"none"` for linear scrub).

### Pattern 3: Pin

Element stays fixed in viewport while scroll continues.

```js
ScrollTrigger.create({
  trigger: ".section",
  start: "top top",
  end: "+=1000",       // stay pinned for 1000px of scroll
  pin: true,
  pinSpacing: true,    // default: adds space after pinned section so content below isn't overlapped
});
```

**CRITICAL PIN GOTCHAS** (Claude Code often gets these wrong):

1. **Pin target must be a direct child or the trigger itself.** Pinning a deeply nested element causes layout chaos. If the pin target differs from the trigger, use `pin: ".pin-target"` inside the ScrollTrigger config.

2. **pinSpacing** — when `true` (default), GSAP adds padding after the pinned element equal to the pin duration. Set `pinSpacing: false` only when the pinned section overlaps with the next section intentionally (e.g., layered sections).

3. **Nested pins break.** Never pin an element inside another pinned element. Restructure the HTML instead.

4. **Pin + Flexbox/Grid parents** — pinning an element inside a flex or grid container can cause layout shifts. Wrap the pin target in a plain div if needed.

5. **Refresh after dynamic content.** If content loads after page load (images, fonts, dynamic content), call `ScrollTrigger.refresh()` after everything is ready. Incorrect measurements = broken pins.

6. **anticipatePin: 1** — add this to prevent the visual "jump" when a pin starts. Always include it.

### Pattern 4: Horizontal scroll

Vertical scroll drives horizontal movement of a wide container.

```js
const track = document.querySelector(".track");
const scrollDistance = track.scrollWidth - window.innerWidth;

gsap.to(track, {
  x: -scrollDistance,
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-section",   // the outer container
    start: "top top",
    end: () => `+=${track.scrollWidth}`,
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,  // recalculate on resize
  }
});
```

**GOTCHAS**:
- The track must have `display: flex` and `width: max-content` (or explicit width wider than viewport)
- `invalidateOnRefresh: true` is essential — without it, resize breaks the scroll distance
- End value must be a function (`() => ...`) so it recalculates on refresh
- The outer section needs NO fixed height — the pin handles it

### Pattern 5: Parallax layers

Different elements scroll at different speeds to create depth.

```js
// Rule: further back = slower = smaller y value
gsap.to(".bg-layer",  { y: -50,  scrollTrigger: { trigger: ".section", start: "top bottom", end: "bottom top", scrub: true }});
gsap.to(".mid-layer", { y: -120, scrollTrigger: { trigger: ".section", start: "top bottom", end: "bottom top", scrub: true }});
gsap.to(".fg-layer",  { y: -200, scrollTrigger: { trigger: ".section", start: "top bottom", end: "bottom top", scrub: true }});
```

### Pattern 6: Masked text reveal

Text lines slide up from behind `overflow: hidden` containers.

HTML structure (MUST follow this pattern):
```html
<div class="reveal-line" style="overflow: hidden;">
  <span class="reveal-line-inner" style="display: block;">Text content here</span>
</div>
```

```js
gsap.from(".reveal-line-inner", {
  y: "100%",          // percentage = relative to element height
  duration: 0.8,
  stagger: 0.12,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".text-section",
    start: "top 70%",
    toggleActions: "play none none none"
  }
});
```

### Pattern 7: Counter / number animation

```js
const obj = { val: 0 };
gsap.to(obj, {
  val: 5800,
  duration: 2,
  ease: "power2.out",
  scrollTrigger: { trigger: ".stat", start: "top 80%" },
  onUpdate: () => {
    document.querySelector(".stat-number").textContent = 
      Math.round(obj.val).toLocaleString();
  }
});
```

### Pattern 8: Image sequence (video-like scroll)

Load N frames as images, swap `src` based on scroll progress. Used for "building assembles as you scroll" effects.

```js
const frameCount = 120;
const images = [];
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = `/frames/frame-${String(i).padStart(4, '0')}.webp`;
  images.push(img);
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const tracker = { frame: 0 };

gsap.to(tracker, {
  frame: frameCount - 1,
  snap: "frame",         // snap to whole numbers
  ease: "none",
  scrollTrigger: {
    trigger: ".sequence-section",
    start: "top top",
    end: "+=3000",
    scrub: 0.5,
    pin: true,
  },
  onUpdate: () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[Math.round(tracker.frame)], 0, 0);
  }
});
```

**NOTE**: This requires pre-rendered frames (exported from Blender, After Effects, or video). Each frame should be WebP, ~100–200KB. 120 frames × 150KB = ~18MB — lazy load or use a loading screen.

---

## Three.js Core

### Scene setup boilerplate

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f0eb);  // match page bg

// Camera
const camera = new THREE.PerspectiveCamera(
  45,                                           // FOV — 45 for architectural (less distortion)
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(8, 5, 12);   // position to see a house-scale model
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true,        // transparent background (lets CSS bg show through)
  powerPreference: "high-performance"
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));  // cap at 2x for performance
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// Lighting (architectural: soft ambient + directional sun)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(10, 15, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
scene.add(sunLight);

// Optional: hemisphere light for natural outdoor feel
const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x362907, 0.3);
scene.add(hemiLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;   // prevent going below ground
controls.minDistance = 5;
controls.maxDistance = 30;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
```

### Loading a 3D model (.glb/.gltf)

```js
const loader = new GLTFLoader();

loader.load(
  'house-model.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);          // adjust to fit scene
    model.position.set(0, 0, 0);
    
    // Enable shadows on all meshes in the model
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    scene.add(model);
  },
  (progress) => {
    // Loading progress
    const pct = (progress.loaded / progress.total * 100).toFixed(0);
    console.log(`Loading: ${pct}%`);
  },
  (error) => console.error('Model load error:', error)
);
```

Model file formats:
- **.glb** — binary GLTF, smaller file size, preferred
- **.gltf** — JSON + separate bin/texture files
- Source: exported from Blender, SketchUp (via plugin), Rhino, Revit
- Keep models under 10MB for web. Use Blender's Draco compression or gltf-transform CLI to optimise.

### GSAP + Three.js integration (scroll-driven camera)

This is the key technique for property walkthroughs:

```js
// Define camera waypoints
const waypoints = [
  { pos: [15, 8, 15],  look: [0, 2, 0]  },   // wide exterior
  { pos: [5, 3, 8],    look: [0, 1, 0]  },    // approach entrance
  { pos: [1, 2, 1],    look: [3, 1.5, 3] },   // inside living room
  { pos: [-2, 2, -1],  look: [-4, 1, -3] },   // kitchen
  { pos: [0, 6, -8],   look: [0, 0, 0]  },    // aerial pullback
];

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".walkthrough-section",
    start: "top top",
    end: "+=4000",           // 4000px of scroll for the full walkthrough
    scrub: 1,
    pin: true,
    anticipatePin: 1,
  }
});

waypoints.forEach((wp, i) => {
  if (i === 0) return;   // skip first (that's starting position)
  
  tl.to(camera.position, {
    x: wp.pos[0], y: wp.pos[1], z: wp.pos[2],
    duration: 1,
    ease: "power2.inOut",
    onUpdate: () => {
      camera.lookAt(new THREE.Vector3(...wp.look));
    }
  });
});
```

### Environment and realism

For property sites, the 3D viewer needs to look good, not game-engine good. Key settings:

```js
// Environment map (reflections on glass, metal)
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
new RGBELoader().load('environment.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;   // applies to all PBR materials
});

// Ground plane with shadow
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
```

### Alternative to Three.js: Spline

For simpler 3D needs (rotating model viewer, ambient 3D background), Spline (spline.design) is much faster to produce. It exports a single embed script:

```html
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.0/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/xxx/scene.splinecode"></spline-viewer>
```

Pro: no Three.js code needed, drag-and-drop 3D editor, easy materials and lighting.
Con: less control, heavier bundle, limited model import.

Use Spline for decorative 3D elements. Use Three.js for interactive architectural models.

---

## Property showcase site conventions

### Page structure (standard sections, in order)

1. **Hero** — full-viewport, single image or video, project name + tagline, CTA
2. **Key stats strip** — 3–5 numbers (units, sq ft, floors, completion year, price from)
3. **Concept / vision statement** — 1–3 sentences, large serif type, scroll-revealed
4. **Gallery** — horizontal scroll or pinned image sequence, 5–8 images
5. **Floor plans** — interactive (click to switch levels) or static with labels
6. **Features / specifications** — grid or accordion, materials + finishes
7. **Location / neighbourhood** — map embed + proximity stats (MRT, schools, parks)
8. **Developer profile** — credibility block, past projects
9. **CTA** — "Book a private viewing" / "Register interest", form or WhatsApp

### Animation pacing

- **Hero entrance**: 600–1000ms total, stagger 100–150ms between elements
- **Section reveals**: 500–800ms, trigger at `start: "top 75%"`
- **Scrub animations**: `scrub: 0.5` to `scrub: 1` (never `scrub: true` — too jerky)
- **Pin durations**: 800–2000px of scroll per pinned section. Less = too fast. More = tedious.
- **Total page scroll**: aim for 6000–10000px. Property sites are long and slow.

### Performance targets

- **Lighthouse mobile ≥ 85** (animation-heavy pages rarely hit 95)
- **First Contentful Paint < 1.5s** — defer all GSAP/Three.js until after critical content
- **Largest Contentful Paint < 2.5s** — hero image must be `<img>` with `fetchpriority="high"`, not a canvas
- **Total page weight < 5MB** — images are the main cost; use WebP/AVIF, lazy load below fold
- **Three.js scenes**: load the model asynchronously, show a placeholder until ready

### Responsive rules

- Horizontal scroll galleries → stack vertically on mobile (< 768px) or reduce to swipeable carousel
- Three.js model viewers → show a static render on mobile (save battery and bandwidth)
- Pin durations → reduce by 30–40% on mobile (less scroll patience)
- Parallax → disable or reduce range on mobile (performance + motion sensitivity)
- Always respect `prefers-reduced-motion`:
  ```js
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    gsap.globalTimeline.timeScale(100);  // skip all animations instantly
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
  ```

### Image handling

- Hero: 1920×1080 WebP, quality 80, < 200KB
- Gallery: 1200×800 WebP, quality 75, < 120KB each
- Lazy load everything below fold: `loading="lazy"` or Intersection Observer
- Provide `srcset` for mobile: 600w, 900w, 1200w, 1920w

---

## Common Claude Code mistakes to avoid

1. **Using AOS or Animate.css alongside GSAP.** Never. GSAP handles everything and mixing libraries causes conflicts.

2. **Putting ScrollTrigger config outside the tween.** ScrollTrigger goes INSIDE the tween's vars object, not as a separate call (unless using `ScrollTrigger.create()` for pin-only).

3. **Using `scrub: true` for smooth animations.** `scrub: true` is jerky. Use `scrub: 0.5` or `scrub: 1` for smooth.

4. **Forgetting `anticipatePin: 1`.** Every pin needs this to prevent visual jump.

5. **Calculating horizontal scroll distance once at load.** Must be a function or use `invalidateOnRefresh: true` to handle resize.

6. **Setting Three.js canvas to `position: fixed` for scroll integration.** Don't. Use the GSAP + Three.js camera pattern instead — canvas stays in flow, camera moves.

7. **Not capping `devicePixelRatio`.** Always `Math.min(window.devicePixelRatio, 2)`. 3x displays will kill frame rate.

8. **Using `MeshBasicMaterial` for architectural models.** Use `MeshStandardMaterial` or `MeshPhysicalMaterial` — they respond to lighting and look realistic.

9. **Forgetting to call `controls.update()` in the animation loop** when using OrbitControls with damping.

10. **Not killing ScrollTriggers on component unmount** (React/Next.js). Call `ScrollTrigger.getAll().forEach(st => st.kill())` in cleanup.
