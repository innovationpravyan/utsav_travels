import { getFirebaseDb } from './firebase';
import { setDoc, doc } from 'firebase/firestore';

const allPlaces = [
  {
    id: 'kashi-vishwanath',
    name: 'Kashi Vishwanath Temple - The Golden Temple of Lord Shiva',
    city: 'Varanasi',
    category: 'Temple',
    image: 'https://drive.google.com/file/d/1SXbOkSlad_FPv5uINGOqfvD2g8ayr-7t/view?usp=sharing',
    shortDescription: 'The most revered Jyotirlinga temple where Lord Shiva resides as the eternal light of consciousness',
    description: 'The magnificent Kashi Vishwanath Temple stands as the spiritual heart of Varanasi, housing one of the twelve sacred Jyotirlingas where Lord Shiva manifests as the eternal cosmic light. This architectural marvel, crowned with a gleaming golden spire, rises majestically on the western banks of the holy Ganges River. For millennia, this sacred shrine has been the ultimate destination for devotees seeking moksha (liberation), as it is believed that a single darshan here can wash away countless lifetimes of karma. The temple\'s divine presence permeates every corner of the ancient city, making Varanasi itself a living temple where every stone whispers prayers and every ghat echoes with devotional chants.',
    history: 'The sacred legacy of Kashi Vishwanath spans over 3,500 years, with its divine presence mentioned in ancient Puranas including the revered Kashi Khanda of Skanda Purana. The original temple complex, a masterpiece of ancient Indian architecture, fell victim to the destructive zeal of Mughal emperor Aurangzeb in 1669 CE, who built a mosque over its ruins. However, the indomitable spirit of devotion could not be crushed, and the present magnificent structure was lovingly reconstructed by the noble queen Ahilya Bai Holkar of Indore in 1780. The temple\'s crowning glory, its spectacular golden spire and dome, was a generous donation from the great Sikh ruler Maharaja Ranjit Singh in 1835, symbolizing the unity of all faiths in reverence to the divine.',
    highlights: [
      'One of the 12 most sacred Jyotirlingas - eternal pillars of divine light',
      'Sacred abode of Lord Shiva as Vishwanath - the Lord of the Universe',
      'Magnificent golden spire and dome donated by Maharaja Ranjit Singh',
      'Ultimate pilgrimage destination for attaining moksha (spiritual liberation)',
      'Exquisite temple architecture blending devotion with artistic grandeur',
      'Daily elaborate pujas and aartis creating an atmosphere of divine transcendence',
      'Sacred Ganga Jal abhishek ceremony performed with Himalayan precision',
      'Ancient traditions preserved through centuries of continuous worship'
    ],
    gallery: [
      'https://drive.google.com/file/d/1SXbOkSlad_FPv5uINGOqfvD2g8ayr-7t/view?usp=sharing',
      'https://drive.google.com/file/d/1eKx4PkEXNbteQ1mSKp3sQhNIBan0Eys6/view?usp=sharing',
      'https://drive.google.com/file/d/19qbq56wR_uu-vjkZpJoGzvTjzkwlexny/view?usp=sharing',
      'https://drive.google.com/file/d/11PX9fTBm1xSZaWVggwQDdSMV0YPRJEBq/view?usp=sharing'
    ],
    tags: ['temple', 'spiritual', 'varanasi', 'shiva', 'jyotirlinga', 'pilgrimage'],
    location: { lat: 25.3109, lng: 83.0104 },
  },
  {
    id: 'dashashwamedh-ghat',
    name: 'Dashashwamedh Ghat - The Crown Jewel of Sacred Ghats',
    city: 'Varanasi',
    category: 'Ghat',
    image: 'https://drive.google.com/file/d/1Qvraw-CZr3XS_RupSkq903xuHxwFYKX6/view?usp=sharing',
    shortDescription: 'The most magnificent and spiritually charged ghat where heaven meets earth in divine celebration',
    description: 'Dashashwamedh Ghat stands as the crown jewel among Varanasi\'s 84 sacred ghats, serving as the spiritual amphitheater where the cosmic drama of devotion unfolds daily. This magnificent stone stairway descending into the holy Ganges has witnessed thousands of years of prayers, rituals, and spiritual transformation. The ghat comes alive each evening with the world-renowned Ganga Aarti, a spectacular ceremony that transforms the riverfront into a celestial stage where fire, light, music, and devotion create an otherworldly experience. According to ancient Hindu cosmology, this is where Lord Brahma performed the Dasa-Ashwamedha yajna (sacrifice of ten horses) to welcome Lord Shiva, making it one of the most potent spiritual vortexes on Earth.',
    history: 'The ancient legacy of Dashashwamedh Ghat is woven into the very fabric of Hindu mythology and historical chronicles. According to the Puranas, this sacred spot was created by Lord Brahma himself as a grand welcome platform for Lord Shiva, giving it unparalleled spiritual significance. The ghat finds mention in texts dating back over 2,000 years, though the present magnificent stone structure was constructed by the Maratha Peshwa Balaji Baji Rao in 1748 CE. The evening Ganga Aarti tradition, now a world-famous spectacle, has been performed here for centuries, evolving from simple oil lamp offerings to the grand choreographed ceremony we witness today, attracting millions of pilgrims and spiritual seekers from across the globe.',
    highlights: [
      'Most spectacular and famous Ganga Aarti ceremony performed daily at sunset',
      'Sacred bathing ghat believed to grant instant purification from all sins',
      'Magnificent boat rides offering panoramic views of the spiritual cityscape',
      'Cultural performances showcasing classical Indian music and dance traditions',
      'Historical significance as the site of Brahma\'s cosmic yajna ceremony',
      'Architectural marvel with intricately carved stone steps and platforms',
      'Spiritual epicenter where thousands gather for prayers and meditation',
      'Photography paradise capturing the essence of eternal India'
    ],
    gallery: [
      'https://drive.google.com/file/d/1s299-TH3rSmaj5QvQOhHD778duqFfN91/view?usp=sharing',
      'https://drive.google.com/file/d/1Qvraw-CZr3XS_RupSkq903xuHxwFYKX6/view?usp=sharing',
      'https://drive.google.com/file/d/1brnI9rR0QpqPXyV0cwFHFrkp2sNtrMDp/view?usp=sharing',
    ],
    tags: ['ghat', 'ganga', 'aarti', 'varanasi', 'spiritual', 'cultural', 'evening'],
    location: { lat: 25.3073, lng: 83.0103 },
  },
  {
    id: 'sarnath',
    name: 'Sarnath - The Sacred Birthplace of Buddhist Dharma',
    city: 'Varanasi',
    category: 'Buddhist Site',
    image: 'https://drive.google.com/file/d/1eWQqu8BjVoHbgf60EswcMqNAVUg0K5cV/view?usp=sharing',
    shortDescription: 'The hallowed ground where Buddha delivered his first sermon and set the Wheel of Dharma in motion',
    description: 'Sarnath stands as one of the most sacred sites in Buddhism, the hallowed ground where Prince Siddhartha, having attained enlightenment as Buddha, delivered his first sermon to five ascetic disciples under a magnificent Bodhi tree. Located just 10 kilometers from Varanasi, this tranquil sanctuary marks the birth of the Buddhist Sangha (monastic community) and the moment when the Wheel of Dharma was set in motion for the first time. The site resonates with profound spiritual energy, where ancient stupas, meditation halls, and archaeological treasures tell the story of one of humanity\'s greatest spiritual awakening. Here, the Four Noble Truths and the Eightfold Path were first articulated, creating ripples of wisdom that would eventually encompass the globe.',
    history: 'The illustrious history of Sarnath begins around 528 BCE when Gautama Buddha, fresh from his enlightenment at Bodh Gaya, walked to this sacred grove to share his revolutionary insights with five ascetic seekers. His first discourse, known as the Dhammacakkappavattana Sutta (Setting in Motion the Wheel of Dharma), marked the foundation of Buddhism as a world religion. Emperor Ashoka, deeply moved by Buddhist philosophy, established magnificent monasteries here in the 3rd century BCE and erected the famous Ashoka Pillar with its iconic lion capital, now India\'s national emblem. For over 1,500 years, Sarnath flourished as a major center of Buddhist learning, attracting scholars and pilgrims from across Asia, until it was unfortunately destroyed during medieval invasions and lay forgotten until its rediscovery by British archaeologists in the 19th century.',
    highlights: [
      'Sacred site of Buddha\'s first sermon - the birth of Buddhist philosophy',
      'Magnificent Ashoka Pillar with the iconic four-lion capital',
      'Ancient Dhamekh Stupa marking the exact spot of the first discourse',
      'World-class archaeological museum housing priceless Buddhist artifacts',
      'Ruins of ancient monasteries where thousands of monks once studied',
      'Peaceful meditation gardens perfect for contemplation and inner reflection',
      'International Buddhist temples representing different Buddhist traditions',
      'Historical significance as one of the four holiest Buddhist pilgrimage sites'
    ],
    gallery: [
      'https://drive.google.com/file/d/1eWQqu8BjVoHbgf60EswcMqNAVUg0K5cV/view?usp=sharing',
    ],
    tags: ['buddhist', 'sarnath', 'varanasi', 'buddha', 'stupa', 'pilgrimage'],
    location: { lat: 25.3811, lng: 83.0285 },
  },
  {
    id: 'sankat-mochan-temple',
    name: 'Sankat Mochan Hanuman Temple - The Divine Reliever of Troubles',
    city: 'Varanasi',
    category: 'Temple',
    image: 'https://drive.google.com/file/d/1O9ReMpk9-iQCCtaCmC60U04hPOAX9cQ_/view?usp=sharing',
    shortDescription: 'The blessed temple of Lord Hanuman built by saint Tulsidas, renowned for its miraculous powers of removing difficulties',
    description: 'The Sankat Mochan Hanuman Temple stands as a beacon of divine protection and spiritual solace, built by the legendary saint-poet Goswami Tulsidas in the 16th century. This sacred shrine, dedicated to Lord Hanuman as the remover of troubles (Sankat Mochan), attracts millions of devotees who come seeking relief from life\'s challenges and obstacles. Nestled on the serene banks of River Assi, the temple exudes an atmosphere of profound peace and spiritual power. The divine presence of Hanuman here is believed to be exceptionally potent, as the temple was established by Tulsidas himself after receiving direct darshan of the deity. The temple\'s spiritual significance extends beyond individual prayers, as it hosts the internationally acclaimed Sankat Mochan Sangeet Samaroh, transforming it into a celebration of classical Indian music and devotion.',
    history: 'The sacred foundation of Sankat Mochan Temple traces back to the divine vision of Goswami Tulsidas, the immortal author of Ramcharitmanas, in the 16th century. According to tradition, Tulsidas had a direct darshan of Lord Hanuman at this very spot, who appeared to him in his divine form and blessed the location as his eternal abode. The saint immediately established the temple here, making it one of the most spiritually charged Hanuman temples in India. The temple gained immense popularity over the centuries, particularly after several miraculous incidents were reported by devotees. In modern times, the temple has become synonymous with the annual music festival established in 1960, which attracts world-renowned classical musicians and creates a unique synthesis of devotional and artistic excellence that reflects Tulsidas\'s own legacy as both a spiritual master and literary genius.',
    highlights: [
      'Sacred creation of the great saint-poet Tulsidas in the 16th century',
      'Miraculous powers for relieving devotees from troubles and sorrows',
      'World-famous Sankat Mochan Sangeet Samaroh music festival (April 16-21, 2025)',
      'Serene location on the banks of sacred River Assi',
      'Continuous chanting of Hanuman Chalisa creating divine vibrations',
      'Beautiful temple architecture reflecting traditional North Indian style',
      'Blessed prasadam known for its spiritual potency and healing properties',
      'Peaceful ashram atmosphere perfect for meditation and prayer'
    ],
    gallery: [
      'https://drive.google.com/file/d/1O9ReMpk9-iQCCtaCmC60U04hPOAX9cQ_/view?usp=sharing',
    ],
    tags: ['temple', 'hanuman', 'varanasi', 'tulsidas', 'music', 'festival'],
    location: { lat: 25.2820, lng: 83.0047 },
  },
  {
    id: 'durga-temple-varanasi',
    name: 'Durga Temple (Monkey Temple) - The Crimson Fortress of Divine Shakti',
    city: 'Varanasi',
    category: 'Temple',
    image: 'https://drive.google.com/file/d/1quGoGw27sez9hJ_-gZnIbsiNMWt3kNrz/view?usp=sharing',
    shortDescription: 'A stunning red sandstone temple showcasing exquisite Nagara architecture and divine feminine power',
    description: 'The magnificent Durga Temple, affectionately known as the Monkey Temple, stands as one of Varanasi\'s most striking architectural marvels, its distinctive red sandstone structure gleaming like a crimson jewel against the ancient cityscape. Built in the 18th century, this extraordinary temple showcases the finest examples of Nagara architectural style, with its soaring spires, intricate carvings, and multi-tiered structure creating a visual symphony of devotional art. Dedicated to Goddess Durga, the fierce yet benevolent mother divine, the temple radiates powerful spiritual energy that devotees believe can vanquish all forms of negativity and evil. The temple complex includes the sacred Durgakund, a pristine pond that adds to the serene spirituality of the site, while the resident monkeys (giving the temple its popular name) are considered blessed creatures under the goddess\'s protection.',
    highlights: [
      'Stunning red sandstone architecture creating a visually magnificent temple',
      'Finest example of traditional Nagara architectural style in Varanasi',
      'Sacred dedication to Goddess Durga, the supreme divine feminine power',
      'Beautiful adjacent Durgakund pond for ritual bathing and purification',
      'Impressive multi-tiered spire structure showcasing ancient building techniques',
      'Intricate stone carvings depicting various forms of the divine mother',
      'Peaceful temple complex perfect for meditation and spiritual reflection',
      'Famous resident monkeys considered blessed by the goddess'
    ],
    gallery: [
      'https://drive.google.com/file/d/10fr7BrsRzcBmkpedxHl-3PhJCXu6vWzt/view?usp=sharing',
      'https://drive.google.com/file/d/1quGoGw27sez9hJ_-gZnIbsiNMWt3kNrz/view?usp=sharing',
    ],
    tags: ['temple', 'durga', 'varanasi', 'architecture', 'red', 'pond'],
    location: { lat: 25.2851, lng: 83.0059 },
  },
  {
    id: 'kedarnath-temple',
    name: 'Kedarnath Temple - The Majestic Himalayan Abode of Lord Shiva',
    city: 'Kedarnath',
    category: 'Temple',
    image: 'https://drive.google.com/file/d/1e0-6gj8StIYmFLa1kap9s6SDazAJUlWj/view?usp=sharing',
    shortDescription: 'The highest of all Jyotirlingas, standing majestically at 3,583 meters amidst snow-capped Himalayan peaks',
    description: 'Kedarnath Temple stands as the ultimate testament to human devotion and divine grace, majestically positioned at 3,583 meters in the heart of the sacred Himalayas. This ancient stone marvel, believed to be built by the Pandavas themselves over 1,000 years ago, represents one of the twelve sacred Jyotirlingas and forms part of the revered Char Dham pilgrimage circuit. The temple\'s extraordinary location amidst towering snow-capped peaks creates an otherworldly atmosphere where the earthly and divine realms seem to merge. Reaching this sacred shrine requires a challenging yet spiritually rewarding 16-17 kilometer trek from Gaurikund, making every step a prayer and every breath an offering to the divine. The temple\'s seasonal opening (May 2, 2025) and closing (October 23, 2025) adds to its mystique, as devotees eagerly await each year to reconnect with Lord Shiva in his most pristine Himalayan form.',
    history: 'The legendary history of Kedarnath Temple is intricately woven with the epic Mahabharata and the spiritual quest of the Pandava brothers. According to ancient scriptures, after the great war of Kurukshetra, the Pandavas sought Lord Shiva\'s blessings to absolve themselves of the sin of killing their own kinsmen. Lord Shiva, initially reluctant to forgive them, disguised himself as a bull and hid in the Kedarnath valley. When Bhima recognized and tried to catch the divine bull, it disappeared, leaving behind its hump, which became the sacred Jyotirlinga worshipped today. The temple\'s stone structure, with its massive granite blocks fitted without mortar, demonstrates the incredible engineering skills of ancient India. Adi Shankaracharya renovated and revitalized the temple in the 8th century CE, establishing the spiritual traditions that continue today. The temple has withstood centuries of harsh Himalayan weather, natural disasters, and the test of time, standing as an eternal symbol of unwavering faith.',
    highlights: [
      'One of the 12 most sacred Jyotirlingas - divine manifestations of Lord Shiva',
      'Integral part of the prestigious Char Dham pilgrimage circuit',
      'Spectacular location at 3,583 meters amidst pristine Himalayan peaks',
      'Challenging 16-17 km sacred trek from Gaurikund adding spiritual merit',
      'Ancient stone architecture with massive granite blocks and mysterious construction',
      'Seasonal temple opening (May 2, 2025) creating anticipation and devotion',
      'Sacred Pali inscriptions and mythological carvings telling ancient stories',
      'Breathtaking natural beauty combining spiritual significance with Himalayan grandeur'
    ],
    gallery: [
      'https://drive.google.com/file/d/1iSfOTdo5Yjh-75JseiELp-FHwbx07TpR/view?usp=sharing',
      'https://drive.google.com/file/d/1zsDpxrrUko2oxutzUm2oDqcthNbl9ZnB/view?usp=sharing',
      'https://drive.google.com/file/d/1e0-6gj8StIYmFLa1kap9s6SDazAJUlWj/view?usp=sharing',
      'https://drive.google.com/file/d/13PrLwALnlrKLBlb0aoGmvaSNk33L9BVk/view?usp=sharing'
    ],
    tags: ['temple', 'jyotirlinga', 'kedarnath', 'char-dham', 'shiva', 'pilgrimage'],
    location: { lat: 30.7346, lng: 79.0669 },
  },
  {
    id: 'vasuki-tal',
    name: 'Vasuki Tal - The Sacred Himalayan Mirror of Divine Serpent',
    city: 'Kedarnath',
    category: 'Lake',
    image: 'https://drive.google.com/file/d/1PeGTs5ngLC4f8UdFn_shwITRZ1R_WXmP/view?usp=sharing',
    shortDescription: 'A pristine high-altitude glacial lake at 4,135 meters, reflecting the divine beauty of Himalayan peaks',
    description: 'Vasuki Tal emerges as a crystalline jewel of the Himalayas, a sacred high-altitude lake positioned at an breathtaking elevation of 4,135 meters, where the boundary between earth and heaven seems to dissolve. This pristine glacial lake, with its mirror-like surface reflecting the magnificent snow-capped peaks, creates one of nature\'s most spectacular temples. Named after Vasuki, the divine serpent that adorns Lord Shiva\'s neck, this sacred water body holds profound spiritual significance in Hindu mythology. The challenging 4-kilometer trek from Kedarnath Temple to reach this celestial lake becomes a journey of self-discovery, where each step through the rugged Himalayan terrain purifies the soul and prepares the pilgrim for a divine encounter. The lake\'s crystal-clear waters, fed by glacial streams and blessed by ancient Himalayan peaks, are believed to possess healing properties that can cleanse both physical ailments and spiritual impurities.',
    history: 'The mythological significance of Vasuki Tal is deeply rooted in ancient Hindu scriptures and the cosmic stories surrounding Lord Shiva\'s divine attributes. According to Puranic literature, the lake derives its sacred name from Vasuki, the king of serpents who serves as Lord Shiva\'s ornament and represents the kundalini energy that lies dormant at the base of human consciousness. Ancient texts describe how this high-altitude lake was formed during the cosmic dance of Lord Shiva, when droplets from the serpent Vasuki crystallized into this eternal water body. For centuries, accomplished yogis and spiritual seekers have undertaken the arduous journey to this remote lake for deep meditation and spiritual realization. The lake has remained largely unchanged for millennia, preserving its pristine natural state and serving as a powerful meditation spot where the thin mountain air and serene environment facilitate profound spiritual experiences.',
    highlights: [
      'Spectacular high-altitude location at 4,135 meters above sea level',
      'Crystal-clear glacial waters reflecting magnificent Himalayan peaks',
      'Sacred 4-kilometer trek from Kedarnath Temple through pristine mountains',
      'Named after Vasuki, the divine serpent adorning Lord Shiva',
      'Breathtaking panoramic views of snow-capped Himalayan summits',
      'Perfect natural amphitheater for meditation and spiritual contemplation',
      'Pristine ecosystem showcasing rare high-altitude flora and fauna',
      'Photography paradise offering stunning reflections and mountain vistas'
    ],
    gallery: [
      'https://drive.google.com/file/d/1cRSPV2WKujbiIZKmxpDZNA4oheDPdq8t/view?usp=sharing',
      'https://drive.google.com/file/d/1JwsjI5FBZLHUjQxcVxG4Y2Jm9_Go9cP9/view?usp=sharing',
      'https://drive.google.com/file/d/1PeGTs5ngLC4f8UdFn_shwITRZ1R_WXmP/view?usp=sharing',
      'https://drive.google.com/file/d/13KEsADJhL9O4iEEWilM_dsZQAkiMI834/view?usp=sharing'
    ],
    tags: ['lake', 'kedarnath', 'trekking', 'himalaya', 'vasuki', 'high-altitude'],
    location: { lat: 30.7580, lng: 79.0900 },
  },
  {
    id: 'gaurikund',
    name: 'Gaurikund - The Sacred Gateway to Himalayan Divinity',
    city: 'Kedarnath',
    category: 'Sacred Site',
    image: 'https://drive.google.com/file/d/10sT9i8d46ZZkrT1eGQNLHpr3avHaE-ZM/view?usp=sharing',
    shortDescription: 'The holy base camp blessed with natural hot springs where the sacred Kedarnath pilgrimage begins',
    description: 'Gaurikund stands as the sacred threshold between the material and spiritual worlds, serving as the divine gateway where the epic Kedarnath pilgrimage officially begins. Positioned at 6,500 feet amidst the stunning Himalayan foothills, this holy site is blessed with natural hot springs that have been providing therapeutic healing to pilgrims for countless centuries. Named after Goddess Gauri (Parvati), Lord Shiva\'s divine consort, this sacred location holds immense spiritual significance as the place where the goddess performed intense penance to win Shiva\'s love. The natural hot springs, emerging from deep within the earth, are considered divine blessings that prepare pilgrims both physically and spiritually for the challenging journey ahead. As the end point of motorable roads, Gaurikund represents the moment when modern comfort gives way to ancient spiritual discipline, marking the beginning of a transformative journey that has been undertaken by millions of devotees over the centuries.',
    history: 'The sacred history of Gaurikund is intimately connected with the divine love story of Lord Shiva and Goddess Parvati, as narrated in ancient Puranic texts. According to legend, this is the exact location where Goddess Parvati (Gauri) performed severe tapasya (spiritual austerities) to win Lord Shiva as her eternal consort. The natural hot springs are believed to have emerged as a result of the intense spiritual energy generated during her meditation, making these waters permanently blessed with healing properties. Historical records indicate that this site has been a important halt for Kedarnath pilgrims for over 1,200 years, with references found in various Sanskrit texts and travel accounts of ancient pilgrims. The traditional rest houses and temples built around the hot springs have been serving pilgrims for centuries, creating a spiritual ecosystem that supports the arduous journey to Kedarnath. Modern infrastructure has been carefully integrated with the ancient spiritual traditions, maintaining the site\'s sacred character while providing necessary facilities for contemporary pilgrims.',
    highlights: [
      'Sacred starting point of the challenging 16-17 km Kedarnath trek',
      'Natural hot springs with therapeutic and spiritual healing properties',
      'Perfect elevation at 6,500 feet for acclimatization before high-altitude trek',
      'End of motorable roads marking the transition to spiritual walking meditation',
      'Sacred to Goddess Gauri (Parvati) with ancient temples and shrines',
      'Traditional pilgrimage infrastructure with rest houses and facilities',
      'Stunning mountain views providing inspiration for the journey ahead',
      'Spiritual preparation area with meditation spaces and prayer halls'
    ],
    gallery: [
      'https://drive.google.com/file/d/1PKE8t5dfdTg2iBcOsDctY42zsbNGZ11X/view?usp=sharing',
      'https://drive.google.com/file/d/1E-xk4SR_r5ePUTuG2Xu-tYZMW_87rej6/view?usp=sharing',
      'https://drive.google.com/file/d/10sT9i8d46ZZkrT1eGQNLHpr3avHaE-ZM/view?usp=sharing',
      'https://drive.google.com/file/d/1pyj_avcehKGI3Jh_gXnjMxauuRPI5PNx/view?usp=sharing'
    ],
    tags: ['pilgrimage', 'kedarnath', 'trek', 'hot-springs', 'gauri', 'base-camp'],
    location: { lat: 30.6390, lng: 79.0082 },
  },
  {
    id: 'sonprayag',
    name: 'Sonprayag - The Golden Confluence of Sacred Himalayan Rivers',
    city: 'Kedarnath',
    category: 'Sacred Site',
    image: 'https://drive.google.com/file/d/1qJg4JkjU3y7KFEaW3_7p5MEbuW6-2Ytk/view?usp=sharing',
    shortDescription: 'The mystical confluence where sacred Vasuki and Mandakini rivers unite in eternal divine harmony',
    description: 'Sonprayag emerges as one of nature\'s most sacred masterpieces, where the pristine waters of the Vasuki and Mandakini rivers converge in a spectacular display of divine harmony at 1,829 meters elevation. This mystical confluence, literally meaning "golden confluence," creates a powerful spiritual vortex where the combined energies of two sacred Himalayan rivers amplify the spiritual vibrations of the entire region. The meeting point of these crystal-clear mountain streams, fed by ancient glaciers and blessed by countless peaks, represents the union of divine masculine and feminine energies in Hindu cosmology. Pilgrims have revered this sacred confluence for millennia, believing that a ritualistic bath at this holy spot can instantly cleanse accumulated sins and karma from multiple lifetimes. The dramatic backdrop of snow-capped Himalayan peaks reflected in the swirling waters creates a natural temple where the boundaries between the physical and spiritual worlds completely dissolve.',
    history: 'The spiritual significance of Sonprayag has been celebrated in ancient Hindu scriptures and pilgrimage traditions for over 2,000 years, with references found in various Puranas that describe this confluence as a powerful tirtha (sacred crossing point) where devotees can achieve instant spiritual purification. According to traditional accounts, great sages and realized masters have performed intense spiritual practices at this sacred site, adding to its accumulated spiritual energy over the centuries. The confluence has been an essential stop on the Kedarnath pilgrimage route since time immemorial, with ancient stone platforms and ghats built to facilitate ritualistic bathing and prayers. Historical texts describe how pilgrims would spend days at this confluence, performing prescribed rituals and preparing themselves spiritually for the challenging journey ahead to Kedarnath. The site has maintained its pristine natural beauty despite centuries of pilgrim visitations, testament to the deep reverence with which this sacred space has been protected by countless generations of devotees.',
    highlights: [
      'Sacred confluence of Vasuki and Mandakini rivers creating powerful spiritual energy',
      'Ritual bathing for instant purification and cleansing of sins',
      'Breathtaking panoramic views of snow-capped Himalayan peaks',
      'Strategic pilgrimage stop providing spiritual preparation for Kedarnath journey',
      'Perfect elevation at 1,829 meters for mountain acclimatization',
      'Ancient stone platforms and ghats facilitating traditional river worship',
      'Pristine natural beauty preserved through centuries of sacred protection',
      'Photography paradise with dramatic river confluence and mountain backdrop'
    ],
    gallery: [
      'https://drive.google.com/file/d/1g3Aj5FTu-LQNaY7Fx7IURzQLvZcqZKb1/view?usp=sharing',
      'https://drive.google.com/file/d/1pBj46i3QhWq5bIgIu18VAoFmLKOxsSAf/view?usp=sharing',
      'https://drive.google.com/file/d/1qJg4JkjU3y7KFEaW3_7p5MEbuW6-2Ytk/view?usp=sharing',
      'https://drive.google.com/file/d/1mdjnXhFwO847kGSjxswjn51XYafKQwje/view?usp=sharing'
    ],
    tags: ['confluence', 'kedarnath', 'rivers', 'pilgrimage', 'bathing', 'sacred'],
    location: { lat: 30.6584, lng: 79.0317 },
  }
];

const allPackages = [
  {
    id: 'varanasi-spiritual-deluxe',
    name: 'Varanasi Spiritual Deluxe Experience',
    description: 'Immerse yourself in the eternal spiritual essence of Varanasi, the world\'s oldest living city. This comprehensive journey takes you through sacred temples, ancient ghats, and mystical Buddhist sites, culminating in the mesmerizing Ganga Aarti ceremony that has been performed for thousands of years.',
    duration: '4 Days / 3 Nights',
    cities: ['Varanasi'],
    image: 'https://drive.google.com/file/d/1SXbOkSlad_FPv5uINGOqfvD2g8ayr-7t/view?usp=sharing',
    highlights: [
      'Private darshan at Kashi Vishwanath Temple - one of 12 sacred Jyotirlingas',
      'Exclusive front-row seating for Dashashwamedh Ghat evening Aarti',
      'Sunrise boat ride witnessing ancient spiritual rituals',
      'Guided exploration of Sarnath - where Buddha delivered his first sermon',
      'Visit to Sankat Mochan Temple with traditional music festival (seasonal)',
      'Architectural marvel of Durga Temple (Monkey Temple)',
      'Traditional silk weaving demonstration',
      'Cultural evening with classical music and dance performances'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Sacred Arrival and Evening Mysticism',
        activities: [
          'Warm welcome arrival in Varanasi with traditional tilaka ceremony',
          'Check-in to heritage accommodation overlooking the Ganges',
          'Evening visit to Dashashwamedh Ghat for spectacular Ganga Aarti',
          'Private boat ride on sacred Ganges with evening prayers',
          'Traditional dinner with local delicacies'
        ],
      },
      {
        day: 2,
        title: 'Temple Circuit and Buddhist Heritage',
        activities: [
          'Early morning prayers at Kashi Vishwanath Temple with VIP access',
          'Guided tour of the temple complex and its golden spire history',
          'Journey to Sarnath - the birthplace of Buddhism',
          'Explore Dhamekh Stupa and archaeological museum',
          'Visit to Sankat Mochan Hanuman Temple built by Tulsidas',
          'Evening meditation session by the riverside'
        ],
      },
      {
        day: 3,
        title: 'Cultural Immersion and Architectural Wonders',
        activities: [
          'Sunrise boat ride capturing the spiritual awakening of the city',
          'Visit to the magnificent Durga Temple with its unique red architecture',
          'Exploration of narrow lanes and traditional markets',
          'Silk weaving workshop in famous Varanasi textile center',
          'Interaction with local priests and spiritual scholars',
          'Cultural performances featuring classical Indian music and dance'
        ],
      },
      {
        day: 4,
        title: 'Final Blessings and Departure',
        activities: [
          'Morning meditation and yoga session by the Ganges',
          'Final temple visits for personal prayers and blessings',
          'Shopping for authentic Varanasi silk sarees and spiritual artifacts',
          'Traditional blessing ceremony before departure',
          'Transfer to airport/railway station with sacred memories'
        ],
      },
    ],
    inclusions: [
      'Luxury heritage accommodation for 3 nights with Ganges view',
      'All temple visits with VIP access and guide services',
      'Private boat rides and exclusive Aarti seating',
      'Air-conditioned transportation throughout',
      'Expert English-speaking spiritual guide',
      'Cultural performances and workshops',
      'Traditional meals and spiritual dining experiences',
      'Airport/railway station transfers'
    ],
    gallery: [
      'https://drive.google.com/file/d/1SXbOkSlad_FPv5uINGOqfvD2g8ayr-7t/view?usp=sharing',
      'https://drive.google.com/file/d/1Qvraw-CZr3XS_RupSkq903xuHxwFYKX6/view?usp=sharing',
      'https://drive.google.com/file/d/1eWQqu8BjVoHbgf60EswcMqNAVUg0K5cV/view?usp=sharing',
      'https://drive.google.com/file/d/1O9ReMpk9-iQCCtaCmC60U04hPOAX9cQ_/view?usp=sharing'
    ],
    tags: ['spiritual', 'varanasi', 'temples', 'ganga', 'aarti', 'pilgrimage', 'luxury'],
  },
  {
    id: 'kedarnath-ultimate-pilgrimage',
    name: 'Kedarnath Ultimate Himalayan Pilgrimage',
    description: 'Embark on a transformative spiritual journey to one of India\'s most sacred destinations. This pilgrimage takes you to the majestic Kedarnath Temple, nestled at 3,583 meters in the Himalayas, where Lord Shiva resides as one of the 12 Jyotirlingas. Experience the divine energy of the mountains while trekking through pristine valleys and sacred confluences.',
    duration: '6 Days / 5 Nights',
    cities: ['Kedarnath'],
    image: 'https://drive.google.com/file/d/1e0-6gj8StIYmFLa1kap9s6SDazAJUlWj/view?usp=sharing',
    highlights: [
      'Darshan at sacred Kedarnath Temple - one of 12 Jyotirlingas and Char Dham',
      'Trek through the pristine Himalayan landscape (16-17 km)',
      'Visit to crystal-clear Vasuki Tal at 4,135 meters elevation',
      'Sacred bath at Gaurikund hot springs',
      'Witness the confluence of Vasuki and Mandakini rivers at Sonprayag',
      'Experience Himalayan sunrise and sunset views',
      'Spiritual discourse and meditation sessions',
      'Traditional mountain cuisine and local culture'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Journey Begins - Arrival and Sacred Confluence',
        activities: [
          'Arrival at base location and acclimatization',
          'Drive to Sonprayag - confluence of Vasuki and Mandakini rivers',
          'Sacred bath and prayers at the holy confluence',
          'Check-in to accommodation and briefing about the trek',
          'Evening meditation and preparation for pilgrimage'
        ],
      },
      {
        day: 2,
        title: 'Gaurikund - Gateway to Divine',
        activities: [
          'Early morning drive to Gaurikund (6,500 feet)',
          'Therapeutic bath in natural hot springs',
          'Visit to local temple dedicated to Goddess Gauri',
          'Final preparations for Kedarnath trek',
          'Rest and spiritual preparation for the main pilgrimage'
        ],
      },
      {
        day: 3,
        title: 'The Sacred Trek to Kedarnath',
        activities: [
          'Early morning start for 16-17 km trek to Kedarnath',
          'Guided trek through beautiful Himalayan terrain',
          'Rest stops at scenic viewpoints and tea stalls',
          'Arrival at Kedarnath and check-in to pilgrim accommodation',
          'Evening prayers at the sacred temple complex'
        ],
      },
      {
        day: 4,
        title: 'Divine Darshan and Vasuki Tal Expedition',
        activities: [
          'Early morning special prayers and darshan at Kedarnath Temple',
          'Trek to magnificent Vasuki Tal (4 km from temple)',
          'Experience the crystal-clear lake reflecting Himalayan peaks',
          'Picnic lunch with panoramic mountain views',
          'Return to Kedarnath for evening prayers and rest'
        ],
      },
      {
        day: 5,
        title: 'Final Blessings and Descent',
        activities: [
          'Final morning prayers and personal meditation time',
          'Last darshan at Kedarnath Temple',
          'Begin descent trek to Gaurikund',
          'Celebration dinner and sharing of pilgrimage experiences',
          'Rest at Gaurikund accommodation'
        ],
      },
      {
        day: 6,
        title: 'Sacred Memories and Departure',
        activities: [
          'Morning prayers and final temple visit at Gaurikund',
          'Drive back via Sonprayag with photo stops',
          'Purchase of sacred souvenirs and prasadam',
          'Departure with blessed memories and spiritual transformation'
        ],
      },
    ],
    inclusions: [
      'Accommodation for 5 nights (mountain lodges and pilgrim houses)',
      'All meals during the pilgrimage',
      'Expert trekking guide and porters',
      'Transportation from base to Gaurikund and return',
      'Temple entry fees and special prayers arrangement',
      'Trekking permits and safety equipment',
      'Medical support and emergency assistance',
      'Spiritual guide for religious ceremonies'
    ],
    gallery: [
      'https://drive.google.com/file/d/1e0-6gj8StIYmFLa1kap9s6SDazAJUlWj/view?usp=sharing',
      'https://drive.google.com/file/d/1PeGTs5ngLC4f8UdFn_shwITRZ1R_WXmP/view?usp=sharing',
      'https://drive.google.com/file/d/10sT9i8d46ZZkrT1eGQNLHpr3avHaE-ZM/view?usp=sharing',
      'https://drive.google.com/file/d/1qJg4JkjU3y7KFEaW3_7p5MEbuW6-2Ytk/view?usp=sharing'
    ],
    tags: ['pilgrimage', 'kedarnath', 'trekking', 'himalaya', 'jyotirlinga', 'char-dham', 'spiritual'],
  },
  {
    id: 'varanasi-temple-circuit',
    name: 'Varanasi Sacred Temple Circuit',
    description: 'A focused spiritual journey dedicated to exploring the magnificent temples of Varanasi. This intensive tour covers the most significant Hindu temples, each with unique architectural styles and spiritual significance, offering deep insights into ancient Indian religious traditions and devotional practices.',
    duration: '3 Days / 2 Nights',
    cities: ['Varanasi'],
    image: 'https://drive.google.com/file/d/1quGoGw27sez9hJ_-gZnIbsiNMWt3kNrz/view?usp=sharing',
    highlights: [
      'Comprehensive exploration of Kashi Vishwanath Temple complex',
      'Architectural study of Durga Temple\'s unique Nagara style',
      'Spiritual discourse at Sankat Mochan Hanuman Temple',
      'Early morning temple rituals and aarti ceremonies',
      'Meeting with temple priests and spiritual scholars',
      'Traditional temple prasadam and blessed food',
      'Photography of ancient temple architecture',
      'Temple-to-temple walking meditation'
    ],
    itinerary: [
      {
        day: 1,
        title: 'The Great Jyotirlinga Experience',
        activities: [
          'Arrival and traditional welcome with temple blessings',
          'Visit to Kashi Vishwanath Temple with detailed historical briefing',
          'Guided tour of temple complex and golden spire',
          'Participation in evening prayers and rituals',
          'Meeting with head priest for spiritual discourse'
        ],
      },
      {
        day: 2,
        title: 'Divine Protection and Architectural Marvels',
        activities: [
          'Early morning visit to Sankat Mochan Hanuman Temple',
          'Participation in Hanuman Chalisa recitation',
          'Exploration of Durga Temple and its unique red architecture',
          'Study of Nagara architectural elements and symbolism',
          'Temple art and sculpture appreciation session'
        ],
      },
      {
        day: 3,
        title: 'Final Blessings and Spiritual Reflection',
        activities: [
          'Sunrise prayers at chosen temple for personal meditation',
          'Final visits to preferred temples for individual prayers',
          'Collection of blessed items and temple prasadam',
          'Spiritual reflection session with experienced guide',
          'Departure with temple blessings and sacred memories'
        ],
      },
    ],
    inclusions: [
      'Accommodation for 2 nights near temple area',
      'All temple entry fees and special access arrangements',
      'Expert guide specializing in temple history and architecture',
      'Transportation between temples',
      'Traditional vegetarian meals',
      'Temple prasadam and blessed items',
      'Religious ceremony participation fees'
    ],
    gallery: [
      'https://drive.google.com/file/d/1SXbOkSlad_FPv5uINGOqfvD2g8ayr-7t/view?usp=sharing',
      'https://drive.google.com/file/d/1quGoGw27sez9hJ_-gZnIbsiNMWt3kNrz/view?usp=sharing',
      'https://drive.google.com/file/d/1O9ReMpk9-iQCCtaCmC60U04hPOAX9cQ_/view?usp=sharing'
    ],
    tags: ['temples', 'varanasi', 'architecture', 'spiritual', 'religious', 'heritage'],
  },
  {
    id: 'kedarnath-adventure-trek',
    name: 'Kedarnath Himalayan Adventure & Spiritual Trek',
    description: 'Perfect blend of adventure trekking and spiritual awakening in the majestic Himalayas. This expedition-style journey combines the thrill of high-altitude trekking with profound spiritual experiences, taking you through pristine mountain landscapes to sacred sites that have inspired pilgrims for millennia.',
    duration: '7 Days / 6 Nights',
    cities: ['Kedarnath'],
    image: 'https://drive.google.com/file/d/1PeGTs5ngLC4f8UdFn_shwITRZ1R_WXmP/view?usp=sharing',
    highlights: [
      'Extended trekking experience to Kedarnath Temple and beyond',
      'High-altitude adventure to Vasuki Tal (4,135m)',
      'Multiple river crossings and mountain stream encounters',
      'Photography expedition in pristine Himalayan landscape',
      'Camping under starlit Himalayan skies',
      'Wildlife spotting and botanical exploration',
      'Advanced meditation techniques in mountain setting',
      'Cultural interaction with local mountain communities'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Adventure Begins - Base Preparation',
        activities: [
          'Arrival and adventure gear check',
          'Acclimatization trek around Sonprayag area',
          'River confluence exploration and photography',
          'Adventure briefing and safety protocols',
          'Equipment distribution and team formation'
        ],
      },
      {
        day: 2,
        title: 'Gaurikund Base Camp Setup',
        activities: [
          'Trek to Gaurikund with scenic photo stops',
          'Hot springs therapy and relaxation',
          'Base camp setup and adventure preparations',
          'Local culture interaction and mountain cooking',
          'Star-gazing session and mountain stories'
        ],
      },
      {
        day: 3,
        title: 'The Great Kedarnath Ascent',
        activities: [
          'Early morning start for challenging 17km trek',
          'Multiple rest points with panoramic photography',
          'High-altitude acclimatization techniques',
          'Arrival at Kedarnath and spiritual welcome',
          'Evening prayers and mountain meditation'
        ],
      },
      {
        day: 4,
        title: 'Sacred Darshan and Mountain Exploration',
        activities: [
          'Sacred darshan at Kedarnath Temple',
          'Exploration of surrounding mountain trails',
          'Photography workshop with Himalayan backdrop',
          'Spiritual discourse with mountain sages',
          'Preparation for Vasuki Tal expedition'
        ],
      },
      {
        day: 5,
        title: 'Vasuki Tal High-Altitude Adventure',
        activities: [
          'Challenging trek to Vasuki Tal (4,135m)',
          'High-altitude lake photography and meditation',
          'Mountain picnic with panoramic views',
          'Wildlife and botanical documentation',
          'Return to Kedarnath for celebration dinner'
        ],
      },
      {
        day: 6,
        title: 'Descent and Reflection Journey',
        activities: [
          'Final morning prayers at Kedarnath Temple',
          'Descent trek with reflection stops',
          'Adventure photography review session',
          'Return to Gaurikund base camp',
          'Achievement celebration and experience sharing'
        ],
      },
      {
        day: 7,
        title: 'Final Adventure and Departure',
        activities: [
          'Final mountain exploration around Sonprayag',
          'Adventure gear packing and souvenir shopping',
          'Final group photos and memory creation',
          'Departure with adventure certificates and memories'
        ],
      },
    ],
    inclusions: [
      'Professional trekking guide and support team',
      'All camping and adventure equipment',
      'High-altitude safety gear and medical kit',
      'Accommodation for 6 nights (mix of lodges and camps)',
      'All meals during the expedition',
      'Photography guidance and equipment support',
      'Transportation for the entire journey',
      'Adventure completion certificates'
    ],
    gallery: [
      'https://drive.google.com/file/d/1PeGTs5ngLC4f8UdFn_shwITRZ1R_WXmP/view?usp=sharing',
      'https://drive.google.com/file/d/10sT9i8d46ZZkrT1eGQNLHpr3avHaE-ZM/view?usp=sharing',
      'https://drive.google.com/file/d/1qJg4JkjU3y7KFEaW3_7p5MEbuW6-2Ytk/view?usp=sharing',
      'https://drive.google.com/file/d/1cRSPV2WKujbiIZKmxpDZNA4oheDPdq8t/view?usp=sharing'
    ],
    tags: ['adventure', 'trekking', 'kedarnath', 'himalaya', 'camping', 'photography', 'high-altitude'],
  },
  {
    id: 'spiritual-india-grand-tour',
    name: 'Spiritual India Grand Tour - Varanasi to Kedarnath',
    description: 'The ultimate spiritual odyssey combining the ancient wisdom of Varanasi with the Himalayan mysticism of Kedarnath. This grand tour offers a complete spiritual transformation journey, from the banks of sacred Ganges to the snow-capped peaks of the Himalayas, covering two of India\'s most important pilgrimage destinations.',
    duration: '10 Days / 9 Nights',
    cities: ['Varanasi', 'Kedarnath'],
    image: 'https://drive.google.com/file/d/1SXbOkSlad_FPv5uINGOqfvD2g8ayr-7t/view?usp=sharing',
    highlights: [
      'Complete spiritual circuit of two sacred regions',
      'All major temples and spiritual sites in both destinations',
      'Ganga Aarti ceremony and Himalayan sunrise experiences',
      'Buddhist heritage exploration at Sarnath',
      'High-altitude spiritual trek to Kedarnath and Vasuki Tal',
      'Cultural immersion in two distinct spiritual traditions',
      'Expert spiritual guides for both regions',
      'Photography expedition covering diverse landscapes'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Eternal Varanasi',
        activities: [
          'Grand welcome in the spiritual capital of India',
          'Check-in to luxury heritage accommodation',
          'Evening Ganga Aarti at Dashashwamedh Ghat',
          'Introduction to Varanasi\'s spiritual significance',
          'Traditional dinner with cultural performances'
        ],
      },
      {
        day: 2,
        title: 'Varanasi Temple Circuit',
        activities: [
          'Sacred darshan at Kashi Vishwanath Temple',
          'Exploration of Durga Temple architecture',
          'Visit to Sankat Mochan Hanuman Temple',
          'Boat ride on sacred Ganges',
          'Meeting with spiritual scholars and priests'
        ],
      },
      {
        day: 3,
        title: 'Buddhist Heritage and Culture',
        activities: [
          'Full day exploration of Sarnath Buddhist site',
          'Archaeological museum and Dhamekh Stupa',
          'Meditation session at Buddha\'s first sermon location',
          'Silk weaving workshop and cultural activities',
          'Preparation for Himalayan journey'
        ],
      },
      {
        day: 4,
        title: 'Journey to the Himalayas',
        activities: [
          'Departure from Varanasi to Himalayan region',
          'Travel day with scenic mountain views',
          'Arrival at Sonprayag - sacred river confluence',
          'Acclimatization and mountain preparation',
          'Evening prayers at mountain temples'
        ],
      },
      {
        day: 5,
        title: 'Gaurikund Sacred Springs',
        activities: [
          'Journey to Gaurikund base camp',
          'Therapeutic hot springs experience',
          'Local mountain culture interaction',
          'Trek preparation and gear check',
          'Mountain meditation and spiritual preparation'
        ],
      },
      {
        day: 6,
        title: 'The Sacred Kedarnath Trek',
        activities: [
          'Epic 17km trek to Kedarnath Temple',
          'Guided mountain trekking with spiritual stops',
          'Arrival at sacred Kedarnath Temple',
          'Evening prayers at one of 12 Jyotirlingas',
          'Mountain accommodation and rest'
        ],
      },
      {
        day: 7,
        title: 'Kedarnath Darshan and Vasuki Tal',
        activities: [
          'Early morning special prayers at Kedarnath Temple',
          'Trek to pristine Vasuki Tal high-altitude lake',
          'Himalayan photography and meditation',
          'Return to Kedarnath for evening contemplation',
          'Spiritual discourse with mountain sages'
        ],
      },
      {
        day: 8,
        title: 'Descent and Reflection',
        activities: [
          'Final morning prayers at Kedarnath Temple',
          'Descent trek with reflection and gratitude',
          'Return to Gaurikund for celebration',
          'Experience sharing and journey reflection',
          'Cultural evening with mountain communities'
        ],
      },
      {
        day: 9,
        title: 'Sacred Waters and Confluence',
        activities: [
          'Final visit to Sonprayag river confluence',
          'Sacred bathing and cleansing rituals',
          'Journey back to main travel hub',
          'Shopping for spiritual artifacts and souvenirs',
          'Farewell dinner with group reflections'
        ],
      },
      {
        day: 10,
        title: 'Departure with Transformation',
        activities: [
          'Final morning meditation and prayers',
          'Certificate ceremony for spiritual journey completion',
          'Final purchases of blessed items',
          'Group photos and memory preservation',
          'Departure with life-changing spiritual experiences'
        ],
      },
    ],
    inclusions: [
      'Luxury accommodation throughout the journey',
      'All transportation including Varanasi to Kedarnath',
      'Expert spiritual guides for both regions',
      'All temple visits and special access arrangements',
      'Complete trekking support and safety equipment',
      'All meals including regional specialties',
      'Cultural performances and workshops',
      'Photography support and guidance',
      'Spiritual completion certificates',
      'Emergency medical support throughout'
    ],
    gallery: [
      'https://drive.google.com/file/d/1SXbOkSlad_FPv5uINGOqfvD2g8ayr-7t/view?usp=sharing',
      'https://drive.google.com/file/d/1Qvraw-CZr3XS_RupSkq903xuHxwFYKX6/view?usp=sharing',
      'https://drive.google.com/file/d/1e0-6gj8StIYmFLa1kap9s6SDazAJUlWj/view?usp=sharing',
      'https://drive.google.com/file/d/1PeGTs5ngLC4f8UdFn_shwITRZ1R_WXmP/view?usp=sharing',
      'https://drive.google.com/file/d/1eWQqu8BjVoHbgf60EswcMqNAVUg0K5cV/view?usp=sharing'
    ],
    tags: ['spiritual', 'pilgrimage', 'varanasi', 'kedarnath', 'himalaya', 'temples', 'grand-tour', 'transformation'],
  },
  {
    id: 'varanasi-buddhist-heritage',
    name: 'Varanasi Buddhist Heritage Trail',
    description: 'Explore the profound Buddhist heritage of Varanasi region, focusing on Sarnath where Buddha delivered his first sermon and established the foundations of Buddhism. This specialized tour combines Buddhist philosophy, meditation practices, and archaeological wonders with the spiritual atmosphere of ancient Varanasi.',
    duration: '3 Days / 2 Nights',
    cities: ['Varanasi'],
    image: 'https://drive.google.com/file/d/1eWQqu8BjVoHbgf60EswcMqNAVUg0K5cV/view?usp=sharing',
    highlights: [
      'In-depth exploration of Sarnath Buddhist archaeological site',
      'Meditation sessions at Buddha\'s first sermon location',
      'Study of Buddhist philosophy with expert monks',
      'Archaeological museum with precious Buddhist artifacts',
      'Sunrise meditation at ancient stupas',
      'Buddhist chanting and prayer sessions',
      'Interaction with modern Buddhist communities',
      'Integration with Varanasi\'s multi-religious heritage'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Introduction to Buddhist Heritage',
        activities: [
          'Arrival and introduction to Buddhist philosophy',
          'Visit to Sarnath archaeological site and museum',
          'Guided tour of Dhamekh Stupa and Ashoka Pillar',
          'Evening meditation session at Sarnath',
          'Buddhist vegetarian dinner and philosophical discussion'
        ],
      },
      {
        day: 2,
        title: 'Deep Buddhist Immersion',
        activities: [
          'Sunrise meditation at ancient Buddhist ruins',
          'In-depth study of Buddha\'s first sermon (Dhammacakkappavattana)',
          'Meeting with Buddhist scholars and monks',
          'Exploration of modern Buddhist temples in Sarnath',
          'Buddhist art and sculpture appreciation',
          'Evening chanting session and group meditation'
        ],
      },
      {
        day: 3,
        title: 'Integration and Reflection',
        activities: [
          'Final meditation session at chosen sacred spot',
          'Reflection on Buddhist teachings and personal insights',
          'Visit to Varanasi\'s multicultural spiritual sites',
          'Purchase of Buddhist texts and artifacts',
          'Closing ceremony with Buddhist blessings'
        ],
      },
    ],
    inclusions: [
      'Accommodation for 2 nights near Sarnath',
      'Expert Buddhist philosophy guide',
      'All site entry fees and museum visits',
      'Meditation instruction and materials',
      'Buddhist vegetarian meals',
      'Transportation between sites',
      'Buddhist texts and meditation guides',
      'Interaction sessions with Buddhist community'
    ],
    gallery: [
      'https://drive.google.com/file/d/1eWQqu8BjVoHbgf60EswcMqNAVUg0K5cV/view?usp=sharing'
    ],
    tags: ['buddhist', 'sarnath', 'meditation', 'philosophy', 'archaeology', 'heritage', 'spiritual'],
  }
];

async function seedDatabase() {
  console.log('Starting to seed database...');

  try {
    const db = await getFirebaseDb();

    // Seed Places
    console.log('Seeding places...');
    for (const place of allPlaces) {
      try {
        await setDoc(doc(db, "places", place.id), place);
        console.log(`  ✅ Seeded place: ${place.name}`);
      } catch (error) {
        console.error(`  ❌ Error seeding place ${place.name}:`, error);
      }
    }
    console.log('✅ Finished seeding places.');

    // Seed Packages
    console.log('Seeding packages...');
    for (const pkg of allPackages) {
      try {
        await setDoc(doc(db, "packages", pkg.id), pkg);
        console.log(`  ✅ Seeded package: ${pkg.name}`);
      } catch (error) {
        console.error(`  ❌ Error seeding package ${pkg.name}:`, error);
      }
    }
    console.log('✅ Finished seeding packages.');

    console.log('🚀 Database seeding completed successfully!');
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw error;
  }
}

// Export for use
export { seedDatabase };

// Auto-run when executed directly (for npm run db:seed)
if (require.main === module) {
  console.log('🌱 Starting database seeding...\n');

  seedDatabase()
      .then(() => {
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('✅ Your Firebase database is now populated with places and packages.');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n❌ Database seeding failed:');
        console.error(error);
        console.log('\n💡 Please check:');
        console.log('   - Your Firebase configuration in .env.local');
        console.log('   - Your internet connection');
        console.log('   - Firebase project permissions');
        process.exit(1);
      });
}