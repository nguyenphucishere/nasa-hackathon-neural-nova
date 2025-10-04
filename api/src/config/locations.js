/**
 * Locations metadata
 * This matches the 4 AOIs in config.yaml
 */

const locations = [
  {
    id: 1,
    name: "Hà Giang - Tam Giác Mạch",
    slug: "ha-giang-tam-giac-mach",
    aoi_name: "Ha_Giang_TamGiacMach", // Matches Python config
    flower: {
      species: "tam_giac_mach",
      common_name: "Buckwheat",
      scientific_name: "Fagopyrum esculentum",
      local_name: "Tam Giác Mạch",
      color: "pink-white"
    },
    location: {
      country: "Vietnam",
      region: "Northeast",
      province: "Ha Giang",
      latitude: 23.15,
      longitude: 105.2,
      elevation_min: 800,
      elevation_max: 1500
    },
    bloom_season: {
      start_month: 9,
      start_day: 25,
      end_month: 12,
      end_day: 20,
      peak_months: [10, 11],
      duration_days: 60
    },
    images: {
      hero: "/images/ha-giang-hero.jpg",
      gallery: []
    },
    description: "Famous buckwheat flower fields covering the mountainous Ha Giang plateau. The pink and white flowers create stunning landscapes.",
    tips: [
      "Book accommodation 2-3 months in advance during peak season",
      "Best time for photography: Early morning (6-8 AM)",
      "Bring warm clothes - mountain weather can be cold",
      "Motorbike loop tour is highly recommended"
    ]
  },
  {
    id: 2,
    name: "Mộc Châu - Hoa Mận",
    slug: "moc-chau-prunus",
    aoi_name: "Moc_Chau_Prunus",
    flower: {
      species: "prunus_mume",
      common_name: "Plum Blossom",
      scientific_name: "Prunus mume",
      local_name: "Hoa Mận",
      color: "white-pink"
    },
    location: {
      country: "Vietnam",
      region: "Northwest",
      province: "Son La",
      latitude: 20.86,
      longitude: 104.65,
      elevation_min: 1000,
      elevation_max: 1100
    },
    bloom_season: {
      start_month: 1,
      start_day: 20,
      end_month: 2,
      end_day: 28,
      peak_months: [2],
      duration_days: 21
    },
    images: {
      hero: "/images/moc-chau-hero.jpg",
      gallery: []
    },
    description: "White plum blossoms blanket the Moc Chau plateau during spring. Best visited during Tet holiday.",
    tips: [
      "Visit during Tet holiday (late January - early February)",
      "Cool weather around 15-20°C, bring jacket",
      "Try local specialties: fresh milk, strawberries",
      "Combine with dairy farm visits"
    ]
  },
  {
    id: 3,
    name: "Fansipan - Đỗ Quyên",
    slug: "hoang-lien-rhododendron",
    aoi_name: "Hoang_Lien_Rhododendron",
    flower: {
      species: "rhododendron_spp",
      common_name: "Rhododendron",
      scientific_name: "Rhododendron spp.",
      local_name: "Đỗ Quyên",
      color: "red-purple-pink"
    },
    location: {
      country: "Vietnam",
      region: "Northwest",
      province: "Lao Cai",
      latitude: 22.3,
      longitude: 103.8,
      elevation_min: 1500,
      elevation_max: 3200
    },
    bloom_season: {
      start_month: 2,
      start_day: 25,
      end_month: 5,
      end_day: 31,
      peak_months: [4],
      duration_days: 90
    },
    images: {
      hero: "/images/fansipan-hero.jpg",
      gallery: []
    },
    description: "Red and purple rhododendron flowers bloom on Vietnam's highest peak (3,143m). Spectacular mountain scenery.",
    tips: [
      "Take cable car from Sapa to Fansipan summit",
      "High altitude - prepare for thin air and cold weather",
      "Best views in April during peak bloom",
      "Combine with Sapa town visit"
    ]
  },
  {
    id: 4,
    name: "Lào Cai - Đỗ Quyên",
    slug: "lao-cai-rhododendron",
    aoi_name: "Lao_Cai_Rhododendron",
    flower: {
      species: "rhododendron_spp",
      common_name: "Rhododendron",
      scientific_name: "Rhododendron spp.",
      local_name: "Đỗ Quyên",
      color: "red-purple-pink"
    },
    location: {
      country: "Vietnam",
      region: "Northwest",
      province: "Lao Cai",
      latitude: 22.26,
      longitude: 103.93,
      elevation_min: 2000,
      elevation_max: 3400
    },
    bloom_season: {
      start_month: 3,
      start_day: 1,
      end_month: 6,
      end_day: 15,
      peak_months: [4],
      duration_days: 90
    },
    images: {
      hero: "/images/lao-cai-hero.jpg",
      gallery: []
    },
    description: "Ancient rhododendron forests in the high mountains of Lao Cai province. Remote and pristine.",
    tips: [
      "Trekking required - hire experienced local guide",
      "Multi-day trek recommended (2-3 days)",
      "Camping gear needed for overnight stays",
      "Very remote area - prepare thoroughly"
    ]
  }
];

/**
 * Get all locations
 */
function getAllLocations() {
  return locations;
}

/**
 * Get location by slug
 */
function getLocationBySlug(slug) {
  return locations.find(loc => loc.slug === slug);
}

/**
 * Get location by ID
 */
function getLocationById(id) {
  return locations.find(loc => loc.id === id);
}

/**
 * Get location by AOI name (for Python integration)
 */
function getLocationByAOI(aoiName) {
  return locations.find(loc => loc.aoi_name === aoiName);
}

/**
 * Get locations by flower species
 */
function getLocationsByFlower(flowerSpecies) {
  return locations.filter(loc => loc.flower.species === flowerSpecies);
}

/**
 * Get locations blooming in specific month
 */
function getLocationsByMonth(month) {
  return locations.filter(loc => {
    const { start_month, end_month } = loc.bloom_season;
    
    // Same year bloom
    if (start_month <= end_month) {
      return month >= start_month && month <= end_month;
    }
    
    // Cross-year bloom
    return month >= start_month || month <= end_month;
  });
}

module.exports = {
  locations,
  getAllLocations,
  getLocationBySlug,
  getLocationById,
  getLocationByAOI,
  getLocationsByFlower,
  getLocationsByMonth
};
