import {
  ShoppingCartIcon,
  ShoppingBagIcon,
  FilmIcon,
  MapPinIcon,
  TruckIcon,
  BriefcaseIcon,
  HomeIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  PaperAirplaneIcon,
  GlobeAmericasIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/vue/24/outline"

export const heroIcons = {
  "shopping-cart": ShoppingCartIcon,
  "shopping-bag": ShoppingBagIcon,
  "film": FilmIcon,
  "map-pin": MapPinIcon,
  "truck": TruckIcon,
  "briefcase": BriefcaseIcon,
  "home": HomeIcon,
  "building-office-2": BuildingOffice2Icon,
  "wrench-screwdriver": WrenchScrewdriverIcon,
  "paper-airplane": PaperAirplaneIcon,
  "globe-americas": GlobeAmericasIcon,
} as const

export const defaultIcon = QuestionMarkCircleIcon
export type HeroIconName = keyof typeof heroIcons
