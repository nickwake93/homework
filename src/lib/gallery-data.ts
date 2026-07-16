export type GalleryCategory = "Golf" | "Landscapes" | "Safari" | "Skiing";

export interface GalleryImage {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "image-001",
    title: "2018 Ryder Cup",
    category: "Golf",
    imageUrl: "/images/IMG_0706.JPG",
  },
  {
    id: "image-002",
    title: "Snowy Firs",
    category: "Skiing",
    imageUrl: "/images/IMG_3248.jpg",
  },
  {
    id: "image-003",
    title: "Rippling Dunes",
    category: "Landscapes",
    imageUrl: "/images/IMG_3664.jpg",
  },
  {
    id: "image-004",
    title: "Snowy Peaks",
    category: "Skiing",
    imageUrl: "/images/IMG_4646.jpg",
  },
  {
    id: "image-005",
    title: "A Long Walk",
    category: "Landscapes",
    imageUrl: "/images/IMG_5693.jpg",
  },
  {
    id: "image-006",
    title: "Breezy Brollies",
    category: "Landscapes",
    imageUrl: "/images/IMG_5699.jpg",
  },
  {
    id: "image-007",
    title: "Grazing Zebras",
    category: "Safari",
    imageUrl: "/images/IMG_6554.jpg",
  },
  {
    id: "image-008",
    title: "Rolling Links",
    category: "Golf",
    imageUrl: "/images/IMG_9064.jpg",
  },
  {
    id: "image-009",
    title: "Safe Hands",
    category: "Landscapes",
    imageUrl: "/images/IMG_1332.JPEG",
  },
  {
    id: "image-010",
    title: "Calming Canoes",
    category: "Landscapes",
    imageUrl: "/images/IMG_1183.JPEG",
  },
  {
    id: "image-011",
    title: "Mighty Manhattan",
    category: "Landscapes",
    imageUrl: "/images/IMG_2684.JPEG",
  },
];

export const galleryCategories: ("All" | GalleryCategory)[] = [
  "All",
  "Landscapes",
  "Golf",
  "Safari",
  "Skiing",
];

// Hero carousel slides (configurable; swap with local /images/hero/*.jpg later)
export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: "Frames of the World",
    subtitle: "Calming the noise of busyness",
    imageUrl: "/images/IMG_1183.JPEG",
  },
  {
    id: "hero-2",
    title: "Light Rippling Across Landscapes",
    subtitle: "Coasts in their last hour",
    imageUrl: "/images/IMG_3672.jpg",
  },
  {
    id: "hero-3",
    title: "Where All Terrains Breathe",
    subtitle: "Wildlife, on its own terms",
    imageUrl: "/images/IMG_6554.jpg",
  },
  {
    id: "hero-4",
    title: "Quiet Encounters",
    subtitle: "Stillness, in every layer",
    imageUrl: "/images/IMG_5693.jpg",
  },
];
