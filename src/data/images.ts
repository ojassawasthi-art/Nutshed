import heroBrassBowls from '../assets/images/hero_brass_bowls_1794587819625.jpg';
import californiaAlmonds from '../assets/images/california_almonds_1794587820245.jpg';
import mamraAlmonds from '../assets/images/mamra_almonds_1794587820582.jpg';
import wholeCashews from '../assets/images/whole_cashews_1794587821631.jpg';
import roastedPistachios from '../assets/images/roasted_pistachios_1794587820860.jpg';
import walnutHalves from '../assets/images/walnut_halves_1794587821488.jpg';
import medjoolDates from '../assets/images/medjool_dates_1794587822392.jpg';
import driedFigs from '../assets/images/dried_figs_1794587822422.jpg';
import driedApricots from '../assets/images/dried_apricots_1794587823001.jpg';
import blackRaisins from '../assets/images/black_raisins_1794587822935.jpg';
import everydayTrailMix from '../assets/images/everyday_trail_mix_1794587823068.jpg';
import seedsAndBerries from '../assets/images/seeds_and_berries_1794587823847.jpg';
import festiveGiftHamper from '../assets/images/festive_gift_hamper_1794587824655.jpg';
import jaipurFamilyHamper from '../assets/images/jaipur_family_hamper_1794587825055.jpg';
import needKidsTiffin from '../assets/images/need_kids_tiffin_1794587825315.jpg';
import needFitnessProtein from '../assets/images/need_fitness_protein_1794587825604.jpg';
import needSeniorsCare from '../assets/images/need_seniors_care_1794587826508.jpg';
import needDailySnacking from '../assets/images/need_daily_snacking_1794587827248.jpg';
import needFestiveGifting from '../assets/images/need_festive_gifting_1794587826686.jpg';
import jaipurPackingTable from '../assets/images/jaipur_packing_table_1794587827285.jpg';
import lifestyleDeepGreen from '../assets/images/lifestyle_deep_green_1794587828545.jpg';
import lifestyleRooftopShare from '../assets/images/lifestyle_rooftop_share_1794587828687.jpg';
import lifestyleDeskFlatlay from '../assets/images/lifestyle_desk_flatlay_1794587828594.jpg';
import boxBuilderOpen from '../assets/images/box_builder_open_1794587829095.jpg';
import packagingPouchMockup from '../assets/images/packaging_pouch_mockup_1794587829387.jpg';
import productCloseupAlmonds from '../assets/images/product_closeup_almonds_1794587830565.jpg';

export const IMAGES = {
  heroBrassBowls,
  californiaAlmonds,
  mamraAlmonds,
  wholeCashews,
  roastedPistachios,
  walnutHalves,
  medjoolDates,
  driedFigs,
  driedApricots,
  blackRaisins,
  everydayTrailMix,
  seedsAndBerries,
  festiveGiftHamper,
  jaipurFamilyHamper,
  needKidsTiffin,
  needFitnessProtein,
  needSeniorsCare,
  needDailySnacking,
  needFestiveGifting,
  jaipurPackingTable,
  lifestyleDeepGreen,
  lifestyleRooftopShare,
  lifestyleDeskFlatlay,
  boxBuilderOpen,
  packagingPouchMockup,
  productCloseupAlmonds,
} as const;

export type ImageKey = keyof typeof IMAGES;
