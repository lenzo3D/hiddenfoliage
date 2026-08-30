// Prefix for public/ assets referenced outside the optimizer (raw <video>,
// posters, unoptimized <Image>). Empty everywhere except a static Pages build,
// where the site lives under /hiddenfoliage/.
export const asset = (p: string) => (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + p;
