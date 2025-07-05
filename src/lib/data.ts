export interface Place {
  id: string;
  name: string;
  tagline: string;
  description: string;
  history: string;
  highlights: string[];
  location: { lat: number; lng: number };
  images: string[];
  thumbnail: string;
}

export interface Package {
  id: string;
  name: string;
  duration: string;
  price: string;
  tagline: string;
  description: string;
  inclusions: string[];
  itinerary: { day: number; title: string; description: string }[];
  images: string[];
  thumbnail: string;
}

const places: Place[] = [
  {
    id: "paris-france",
    name: "Paris, France",
    tagline: "The City of Light and Romance",
    description: "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond such landmarks as the Eiffel Tower and the 12th-century, Gothic Notre-Dame cathedral, the city is known for its cafe culture and designer boutiques along the Rue du Faubourg Saint-Honoré.",
    history: "Founded in the 3rd century BC by a Celtic people called the Parisii, the city was later conquered by the Romans and renamed Lutetia. It became a prosperous city with a forum, baths, temples, theatres, and an amphitheatre. By the end of the Western Roman Empire, the city was known as Parisius, a Latin name that would later become Paris in French.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre", "Sainte-Chapelle"],
    location: { lat: 48.8566, lng: 2.3522 },
    images: [
      "https://placehold.co/1200x800/ff851b/ffffff?text=Paris+1",
      "https://placehold.co/1200x800/008080/ffffff?text=Paris+2",
      "https://placehold.co/1200x800/f5f5dc/333333?text=Paris+3",
    ],
    thumbnail: "https://placehold.co/600x400/ff851b/ffffff?text=Paris"
  },
  {
    id: "kyoto-japan",
    name: "Kyoto, Japan",
    tagline: "The Heart of Traditional Japan",
    description: "Kyoto, once the capital of Japan, is a city on the island of Honshu. It's famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses. It’s also known for formal traditions such as kaiseki dining, consisting of multiple courses of precise dishes, and geisha, female entertainers often found in the Gion district.",
    history: "Though archaeological evidence suggests human settlement in Kyoto as early as the Paleolithic period, the city's history truly begins in 794, when Emperor Kanmu chose it as the new seat of the imperial court. The city, named Heian-kyō, remained the capital of Japan for over a thousand years, until the imperial restoration in 1868.",
    highlights: ["Kinkaku-ji (Golden Pavilion)", "Fushimi Inari-taisha Shrine", "Arashiyama Bamboo Grove", "Gion District", "Kiyomizu-dera Temple"],
    location: { lat: 35.0116, lng: 135.7681 },
    images: [
      "https://placehold.co/1200x800/ff851b/ffffff?text=Kyoto+1",
      "https://placehold.co/1200x800/008080/ffffff?text=Kyoto+2",
      "https://placehold.co/1200x800/f5f5dc/333333?text=Kyoto+3",
    ],
    thumbnail: "https://placehold.co/600x400/008080/ffffff?text=Kyoto"
  },
  {
    id: "santorini-greece",
    name: "Santorini, Greece",
    tagline: "Iconic Sunsets and Whitewashed Villages",
    description: "Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The whitewashed, cubiform houses of its 2 principal towns, Fira and Oia, cling to cliffs above an underwater caldera (crater). They overlook the sea, small islands to the west and beaches made up of black, red and white lava pebbles.",
    history: "The island is the site of one of the largest volcanic eruptions in recorded history: the Minoan eruption, which occurred some 3,600 years ago at the height of the Minoan civilization. The eruption left a large caldera surrounded by volcanic ash deposits hundreds of feet deep and may have led indirectly to the collapse of the Minoan civilization on the island of Crete.",
    highlights: ["Oia's Sunset Views", "Fira's Cliffside Beauty", "Red Beach", "Akrotiri Archaeological Site", "Wine Tasting Tours"],
    location: { lat: 36.3932, lng: 25.4615 },
    images: [
      "https://placehold.co/1200x800/ff851b/ffffff?text=Santorini+1",
      "https://placehold.co/1200x800/008080/ffffff?text=Santorini+2",
      "https://placehold.co/1200x800/f5f5dc/333333?text=Santorini+3",
    ],
    thumbnail: "https://placehold.co/600x400/f5f5dc/333333?text=Santorini"
  },
];

const packages: Package[] = [
  {
    id: "european-dream-tour",
    name: "European Dream Tour",
    duration: "10 Days, 9 Nights",
    price: "$2,500",
    tagline: "Experience the best of Europe's iconic cities.",
    description: "Embark on a whirlwind tour of Europe's most famous capitals. From the romance of Paris to the history of Rome and the canals of Venice, this package is a perfect introduction to the continent's diverse cultures and landmarks.",
    inclusions: ["Round-trip airfare", "4-star hotel accommodations", "Daily breakfast", "Guided city tours", "High-speed train between cities"],
    itinerary: [
      { day: 1, title: "Arrival in Paris", description: "Arrive at Charles de Gaulle Airport and transfer to your hotel. Enjoy a welcome dinner and Seine river cruise." },
      { day: 2, title: "Paris City Tour", description: "Visit the Eiffel Tower, Louvre Museum, and Notre-Dame. Afternoon free for exploring Montmartre." },
      { day: 3, title: "Travel to Rome", description: "Take a high-speed train to Rome. Check into your hotel and enjoy an evening walking tour." },
      { day: 4, title: "Ancient Rome", description: "Explore the Colosseum, Roman Forum, and Palatine Hill. Toss a coin in the Trevi Fountain." },
      { day: 5, title: "Vatican City", description: "Visit St. Peter's Basilica, the Vatican Museums, and the Sistine Chapel." },
      { day: 6, title: "Journey to Venice", description: "Travel to Venice by train. Experience a gondola ride through the canals." },
      { day: 7, title: "Venice Exploration", description: "Discover St. Mark's Square, the Doge's Palace, and the Rialto Bridge." },
      { day: 8, title: "Free Day", description: "Enjoy a free day to explore Venice at your own pace or take an optional trip to Murano and Burano." },
      { day: 9, title: "Farewell Dinner", description: "Enjoy a farewell dinner with traditional Italian cuisine and music." },
      { day: 10, title: "Departure", description: "Transfer to Venice Marco Polo Airport for your flight home." },
    ],
    images: [
      "https://placehold.co/1200x800/ff851b/ffffff?text=Europe+1",
      "https://placehold.co/1200x800/008080/ffffff?text=Europe+2",
      "https://placehold.co/1200x800/f5f5dc/333333?text=Europe+3",
    ],
    thumbnail: "https://placehold.co/600x400/ff851b/ffffff?text=Europe"
  },
  {
    id: "flavors-of-japan",
    name: "Flavors of Japan",
    duration: "12 Days, 11 Nights",
    price: "$3,200",
    tagline: "A culinary and cultural journey through Japan.",
    description: "Immerse yourself in the rich culture and exquisite cuisine of Japan. This tour takes you from the bustling metropolis of Tokyo to the serene temples of Kyoto, with a focus on authentic food experiences.",
    inclusions: ["Japan Rail Pass", "Boutique hotel and ryokan stays", "Daily breakfast and select dinners", "Cooking classes and market tours", "Guided cultural excursions"],
    itinerary: [
      { day: 1, title: "Arrival in Tokyo", description: "Welcome to Tokyo! Settle into your hotel in Shinjuku and explore the vibrant neighborhood." },
      { day: 2, title: "Tokyo's Modern Side", description: "Visit the Shibuya Crossing, Harajuku, and the Meiji Shrine. Enjoy a sushi-making class." },
      { day: 3, title: "Traditional Tokyo", description: "Explore Asakusa's Senso-ji Temple and the Ueno Park. Take a Sumida River cruise." },
      { day: 4, title: "Hakone & Mt. Fuji", description: "Travel to Hakone for stunning views of Mt. Fuji. Stay in a traditional ryokan with an onsen." },
      { day: 5, title: "Bullet Train to Kyoto", description: "Experience the Shinkansen (bullet train) to Kyoto. Check into your hotel near Gion." },
      { day: 6, title: "Kyoto's Temples", description: "Visit Kinkaku-ji, Ryoan-ji's rock garden, and the Arashiyama Bamboo Grove." },
      { day: 7, title: "Kyoto's Culture", description: "Explore the Fushimi Inari Shrine and participate in a traditional tea ceremony." },
      { day: 8, title: "Nara Day Trip", description: "Take a day trip to Nara to see the Great Buddha and feed the friendly local deer." },
      { day: 9, title: "Osaka's Food Scene", description: "Travel to Osaka. Dive into the Dotonbori district for a street food tour." },
      { day: 10, title: "Free Day in Osaka", description: "Explore Osaka Castle or enjoy shopping in Shinsaibashi." },
      { day: 11, title: "Return to Tokyo", description: "Take the bullet train back to Tokyo for a final farewell dinner." },
      { day: 12, title: "Departure", description: "Transfer to Narita or Haneda Airport for your flight home." },
    ],
    images: [
      "https://placehold.co/1200x800/ff851b/ffffff?text=Japan+1",
      "https://placehold.co/1200x800/008080/ffffff?text=Japan+2",
      "https://placehold.co/1200x800/f5f5dc/333333?text=Japan+3",
    ],
    thumbnail: "https://placehold.co/600x400/008080/ffffff?text=Japan"
  },
];

export function getPlaces(): Place[] {
  return places;
}

export function getPlaceById(id: string): Place | undefined {
  return places.find(p => p.id === id);
}

export function getPackages(): Package[] {
  return packages;
}

export function getPackageById(id: string): Package | undefined {
  return packages.find(p => p.id === id);
}
