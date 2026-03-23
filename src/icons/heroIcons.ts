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

export const defaultIcon = QuestionMarkCircleIcon
export type HeroIconName = keyof typeof heroIcons
import * as icons from "@heroicons/vue/24/solid";

export const heroIcons = Object.fromEntries(
  Object.entries(icons).map(([key, component]) => [
    key.replace("Icon", "").toLowerCase(),
    component,
  ])
);