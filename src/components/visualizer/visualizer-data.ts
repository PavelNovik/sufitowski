export const roomScene = {
  id: "empty-concrete-room-01",
  image: "/images/visualizer/room-concrete.webp",
  imageWidth: 1672,
  imageHeight: 941,
  ceilingMask: "/images/visualizer/ceiling-mask.svg",
  /** Polygon traced once against the fixed 1672 × 941 base image. */
  ceilingPath: "M 0 0 H 1672 V 37 L 1250 322 H 430 L 0 37 Z",
  ceilingEdgePath: "M 0 37 L 430 322 H 1250 L 1672 37",
} as const;

export const ceilingColorOptions = [
  { id: "white", color: "#f5f4ef", key: "colors.white" },
  { id: "warm-white", color: "#eee7d8", key: "colors.warmWhite" },
  { id: "light-gray", color: "#cfd1ce", key: "colors.lightGray" },
  { id: "graphite", color: "#55595a", key: "colors.graphite" },
] as const;

export type CeilingColorId = (typeof ceilingColorOptions)[number]["id"];

export const spotPositions = [
  [365, 56], [1300, 56], [542, 213], [1115, 213],
  [735, 76], [948, 76], [650, 255], [1020, 255],
  [275, 134], [1390, 134], [820, 170], [470, 190],
] as const;

export type LightingSelection = { id: string; quantity: number };

export function getCeilingColor(id: string | undefined): string {
  return ceilingColorOptions.find((option) => option.id === id)?.color ?? ceilingColorOptions[0].color;
}
