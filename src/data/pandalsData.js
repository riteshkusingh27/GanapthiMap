// Dataset of authentic & iconic Bengaluru Ganesh Pandals
export const initialPandals = [
  {
    id: "pandal-1",
    name: "Bengaluru Ganesha Utsava (APS College Grounds)",
    slug: "aps-college-grounds-basavanagudi",
    locality: "Basavanagudi",
    address: "APS College Grounds, NR Colony, Basavanagudi, Bengaluru - 560004",
    latitude: 12.9432,
    longitude: 77.5736,
    establishmentYear: 1962,
    edition: "62nd Year",
    theme: "Heritage Temple Architecture & Grand Cultural Stage",
    idolType: "Clay Eco-Friendly Idol",
    isEcoFriendly: true,
    isFeatured: true,
    isTrending: true,
    status: "verified",
    darshanTimings: "06:00 AM - 11:00 PM",
    aartiTimings: "07:30 AM & 08:30 PM",
    annadanam: {
      available: true,
      timings: "12:30 PM - 03:30 PM (Maha Prasad Seva)",
      description: "Traditional South Indian Sadya served to thousands of devotees daily."
    },
    facilities: {
      parking: true,
      toilets: true,
      drinkingWater: true,
      accessibility: true,
      firstAid: true
    },
    crowdLevel: "Heavy",
    coverImage: "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The grandest and most historic Ganesha festival in South Bengaluru, famous for daily classical musical performances by top Indian artistes, grand decorations, and massive community feasts.",
    events: [
      { time: "07:30 AM", title: "Maha Ganapathi Homam" },
      { time: "06:30 PM", title: "Carnatic Vocal Concert by Mysore Brothers" },
      { time: "08:30 PM", title: "Grand Evening Aarti & Deepotsava" }
    ],
    organizer: {
      claimed: true,
      name: "Shree Vinayaka Cultural Trust",
      contact: "+91 98450 12345"
    },
    likesCount: 1420,
    checkinsCount: 890
  },
  {
    id: "pandal-2",
    name: "Malleshwaram Canara Union Eco Ganesha",
    slug: "malleshwaram-canara-union-ganesha",
    locality: "Malleshwaram",
    address: "8th Main Road, Near 15th Cross, Malleshwaram, Bengaluru - 560003",
    latitude: 13.0035,
    longitude: 77.5712,
    establishmentYear: 1978,
    edition: "46th Year",
    theme: "Traditional Floral Mandap & Herbal Clay Ganesha",
    idolType: "100% Organic Seed Ganesha",
    isEcoFriendly: true,
    isFeatured: true,
    isTrending: false,
    status: "verified",
    darshanTimings: "07:00 AM - 10:00 PM",
    aartiTimings: "08:00 AM & 07:30 PM",
    annadanam: {
      available: true,
      timings: "01:00 PM - 03:00 PM",
      description: "Pure sattvic prasad Distribution."
    },
    facilities: {
      parking: true,
      toilets: true,
      drinkingWater: true,
      accessibility: true,
      firstAid: false
    },
    crowdLevel: "Moderate",
    coverImage: "https://images.unsplash.com/photo-1599818828945-8167f40192e2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1599818828945-8167f40192e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Pioneer in zero-plastic, eco-friendly celebrations in Malleshwaram. Features an idol embedded with plant seeds that sprout during visarjan.",
    events: [
      { time: "08:00 AM", title: "Morning Vedic Chanting" },
      { time: "05:30 PM", title: "Eco-Friendly Workshop for Kids" },
      { time: "07:30 PM", title: "Sahasranama Archana" }
    ],
    organizer: {
      claimed: true,
      name: "Malleshwaram Residents Forum",
      contact: "+91 98800 67890"
    },
    likesCount: 980,
    checkinsCount: 610
  },
  {
    id: "pandal-3",
    name: "Whitefield Sri Vinayaka Samithi (Inner Circle)",
    slug: "whitefield-inner-circle-vinayaka",
    locality: "Whitefield",
    address: "Inner Circle Park Grounds, Whitefield, Bengaluru - 560066",
    latitude: 12.9698,
    longitude: 77.7499,
    establishmentYear: 2004,
    edition: "20th Year",
    theme: "Ayodhya Ram Mandir Replica Mandap",
    idolType: "Handcrafted Eco Clay Idol",
    isEcoFriendly: true,
    isFeatured: true,
    isTrending: true,
    status: "verified",
    darshanTimings: "06:30 AM - 10:30 PM",
    aartiTimings: "07:00 AM & 08:00 PM",
    annadanam: {
      available: true,
      timings: "12:00 PM - 03:00 PM & 08:00 PM - 09:30 PM",
      description: "Community Prasad Distribution for 5,000+ devotees daily."
    },
    facilities: {
      parking: true,
      toilets: true,
      drinkingWater: true,
      accessibility: true,
      firstAid: true
    },
    crowdLevel: "Heavy",
    coverImage: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "The largest tech-corridor Ganesh celebration blending traditional rituals with modern light shows, food stalls, and community cultural performances.",
    events: [
      { time: "07:00 AM", title: "Abhishekam & Alankaram" },
      { time: "07:00 PM", title: "Dandiya & Cultural Folk Dance" },
      { time: "08:00 PM", title: "Maha Mangala Aarti" }
    ],
    organizer: {
      claimed: true,
      name: "Whitefield Cultural & Welfare Association",
      contact: "+91 99160 43210"
    },
    likesCount: 1150,
    checkinsCount: 730
  },
  {
    id: "pandal-4",
    name: "Jayanagar 4th Block Sarvajanika Ganesha",
    slug: "jayanagar-4th-block-ganesha",
    locality: "Jayanagar",
    address: "Near Jayanagar Shopping Complex Plaza, 4th Block, Bengaluru - 560011",
    latitude: 12.9298,
    longitude: 77.5826,
    establishmentYear: 1970,
    edition: "54th Year",
    theme: "Royal Mysuru Palace Illumination Theme",
    idolType: "Traditional Clay Ganesha",
    isEcoFriendly: false,
    isFeatured: true,
    isTrending: false,
    status: "verified",
    darshanTimings: "06:00 AM - 11:30 PM",
    aartiTimings: "07:30 AM & 08:30 PM",
    annadanam: {
      available: true,
      timings: "01:00 PM - 04:00 PM",
      description: "Puliogare & Mysuru Pak Mahaprasadam."
    },
    facilities: {
      parking: true,
      toilets: true,
      drinkingWater: true,
      accessibility: true,
      firstAid: true
    },
    crowdLevel: "Moderate",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Famous for its dazzling 100,000 LED lights decor, royal backdrop, and special Modak offerings (108 kg Modak).",
    events: [
      { time: "11:00 AM", title: "108 Modak Naivedyam" },
      { time: "08:30 PM", title: "Grand Laser & Light Show" }
    ],
    organizer: {
      claimed: true,
      name: "Jayanagar Merchants Seva Samithi",
      contact: "+91 94480 88990"
    },
    likesCount: 840,
    checkinsCount: 510
  },
  {
    id: "pandal-5",
    name: "Rajajinagar 1st Block Ganesha Seva Samithi",
    slug: "rajajinagar-1st-block-ganesha",
    locality: "Rajajinagar",
    address: "Opposite Rajajinagar Metro Station Grounds, 1st N Block, Bengaluru - 560010",
    latitude: 12.9984,
    longitude: 77.5549,
    establishmentYear: 1985,
    edition: "39th Year",
    theme: "Kedarnath Temple Miniature Replica",
    idolType: "Eco Clay Idol",
    isEcoFriendly: true,
    isFeatured: false,
    isTrending: true,
    status: "verified",
    darshanTimings: "07:00 AM - 10:00 PM",
    aartiTimings: "08:00 AM & 08:00 PM",
    annadanam: {
      available: true,
      timings: "12:30 PM - 03:00 PM",
      description: "Free lunch prasad for all visiting devotees."
    },
    facilities: {
      parking: false,
      toilets: true,
      drinkingWater: true,
      accessibility: true,
      firstAid: false
    },
    crowdLevel: "Low",
    coverImage: "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Located right next to the Metro station, famous for its Himalayan mountain fog effects and serene Kedarnath temple set up.",
    events: [
      { time: "08:00 PM", title: "Special Fog & Aarti Experience" }
    ],
    organizer: {
      claimed: false,
      name: "Rajajinagar Youth Club",
      contact: ""
    },
    likesCount: 620,
    checkinsCount: 340
  },
  {
    id: "pandal-6",
    name: "Ulsoor Someshwara Temple Ganesha Pandal",
    slug: "ulsoor-someshwara-temple-ganesha",
    locality: "Ulsoor",
    address: "Someshwara Temple Street, Ulsoor, Bengaluru - 560008",
    latitude: 12.9818,
    longitude: 77.6256,
    establishmentYear: 1955,
    edition: "71st Year",
    theme: "Chola Dynasty Stone Carving Theme",
    idolType: "Traditional Stone-Finish Clay",
    isEcoFriendly: true,
    isFeatured: true,
    isTrending: false,
    status: "verified",
    darshanTimings: "06:00 AM - 09:30 PM",
    aartiTimings: "07:00 AM & 07:00 PM",
    annadanam: {
      available: false,
      timings: "",
      description: "Dry prasad (Laddoo & Sundal) provided after Aarti."
    },
    facilities: {
      parking: false,
      toilets: true,
      drinkingWater: true,
      accessibility: false,
      firstAid: false
    },
    crowdLevel: "Low",
    coverImage: "https://images.unsplash.com/photo-1599818828945-8167f40192e2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1599818828945-8167f40192e2?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Historic pandal setup next to the ancient Chola-era Someshwara temple. Known for serene Vedic chantings and traditional flower alankara.",
    events: [
      { time: "07:00 AM", title: "Rudra Abhishekam" },
      { time: "07:00 PM", title: "Nadaswaram Classical Recital" }
    ],
    organizer: {
      claimed: true,
      name: "Ulsoor Heritage Trust",
      contact: "+91 97400 11223"
    },
    likesCount: 510,
    checkinsCount: 290
  },
  {
    id: "pandal-7",
    name: "Indiranagar 100ft Road Eco Ganesha",
    slug: "indiranagar-100ft-road-eco-ganesha",
    locality: "Indiranagar",
    address: "Near 12th Main Junction, 100ft Road, Indiranagar, Bengaluru - 560038",
    latitude: 12.9784,
    longitude: 77.6408,
    establishmentYear: 2012,
    edition: "14th Year",
    theme: "Jute & Bamboo Zero-Waste Pavilion",
    idolType: "Zero-Chemical Bamboo & Clay Ganesha",
    isEcoFriendly: true,
    isFeatured: false,
    isTrending: true,
    status: "verified",
    darshanTimings: "08:00 AM - 10:00 PM",
    aartiTimings: "08:30 AM & 08:00 PM",
    annadanam: {
      available: true,
      timings: "01:00 PM - 03:00 PM",
      description: "Served on banana leaves with biodegradable cutlery."
    },
    facilities: {
      parking: true,
      toilets: true,
      drinkingWater: true,
      accessibility: true,
      firstAid: true
    },
    crowdLevel: "Moderate",
    coverImage: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Designed by local eco-architects, using zero single-use plastics, solar lighting, and organic flower waste composting.",
    events: [
      { time: "06:00 PM", title: "Eco-Awareness Acoustic Music Session" }
    ],
    organizer: {
      claimed: true,
      name: "Indiranagar Eco Collective",
      contact: "+91 98440 55667"
    },
    likesCount: 780,
    checkinsCount: 430
  },
  {
    id: "pandal-8",
    name: "Koramangala 80ft Road Ganesha Utsav",
    slug: "koramangala-80ft-road-ganesha",
    locality: "Koramangala",
    address: "6th Block Grounds, 80ft Road, Koramangala, Bengaluru - 560095",
    latitude: 12.9345,
    longitude: 77.6242,
    establishmentYear: 1998,
    edition: "26th Year",
    theme: "Contemporary Art & Golden Idol",
    idolType: "Clay with Natural Watercolors",
    isEcoFriendly: true,
    isFeatured: false,
    isTrending: false,
    status: "verified",
    darshanTimings: "07:00 AM - 11:00 PM",
    aartiTimings: "07:30 AM & 08:30 PM",
    annadanam: {
      available: true,
      timings: "12:30 PM - 03:00 PM",
      description: "Special Bisi Bele Bath & Payasam Seva."
    },
    facilities: {
      parking: true,
      toilets: true,
      drinkingWater: true,
      accessibility: true,
      firstAid: true
    },
    crowdLevel: "Moderate",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Vibrant startup-hub celebration featuring tech innovations, digital donation QR displays, and live stream darshan.",
    events: [
      { time: "08:30 PM", title: "Live Fusion Bhajan Session" }
    ],
    organizer: {
      claimed: true,
      name: "Koramangala Youth Federation",
      contact: "+91 99000 33445"
    },
    likesCount: 690,
    checkinsCount: 410
  },
  {
    id: "pandal-9",
    name: "Kasturi Nagar Eco Vinayaka",
    slug: "kasturi-nagar-eco-vinayaka",
    locality: "Kasturi Nagar",
    address: "Nursery Park Grounds, Kasturi Nagar, Bengaluru - 560043",
    latitude: 13.0078,
    longitude: 77.6625,
    establishmentYear: 2016,
    edition: "10th Year",
    theme: "Organic Sugarcane & Clay Idol",
    idolType: "100% Clay Ganesha",
    isEcoFriendly: true,
    isFeatured: false,
    isTrending: false,
    status: "pending",
    darshanTimings: "08:00 AM - 09:00 PM",
    aartiTimings: "08:00 AM & 07:00 PM",
    annadanam: {
      available: false,
      timings: "",
      description: ""
    },
    facilities: {
      parking: true,
      toilets: false,
      drinkingWater: true,
      accessibility: true,
      firstAid: false
    },
    crowdLevel: "Low",
    coverImage: "https://images.unsplash.com/photo-1599818828945-8167f40192e2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1599818828945-8167f40192e2?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Neighborhood eco-friendly initiative by Kasturi Nagar Residents Welfare Association.",
    events: [],
    organizer: {
      claimed: false,
      name: "Kasturi Nagar RWA",
      contact: ""
    },
    likesCount: 120,
    checkinsCount: 45
  }
];

export const BENGALURU_CENTER = [12.9716, 77.5946];

export const LOCALITIES = [
  "All",
  "Basavanagudi",
  "Malleshwaram",
  "Whitefield",
  "Jayanagar",
  "Rajajinagar",
  "Ulsoor",
  "Indiranagar",
  "Koramangala",
  "Kasturi Nagar"
];

export const LOCALITY_COORDINATES = {
  Basavanagudi: { lat: 12.9432, lng: 77.5736 },
  Malleshwaram: { lat: 13.0035, lng: 77.5712 },
  Whitefield: { lat: 12.9698, lng: 77.7499 },
  Jayanagar: { lat: 12.9298, lng: 77.5826 },
  Rajajinagar: { lat: 12.9984, lng: 77.5549 },
  Ulsoor: { lat: 12.9818, lng: 77.6256 },
  Indiranagar: { lat: 12.9784, lng: 77.6408 },
  Koramangala: { lat: 12.9345, lng: 77.6242 },
  "Kasturi Nagar": { lat: 13.0078, lng: 77.6625 }
};
