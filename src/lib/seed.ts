import { db } from './firebase';
import { setDoc, doc } from 'firebase/firestore';

const allPlaces = [
  {
      id: 'kashi-vishwanath',
      name: 'Kashi Vishwanath Temple',
      city: 'Varanasi',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      shortDescription: 'One of the most sacred Hindu temples',
      description: 'The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh, India. The temple stands on the western bank of the holy river Ganga, and is one of the twelve Jyotirlingas, the holiest of Shiva temples.',
      history: 'The temple has been mentioned in the Puranas including the Kashi Khanda of Skanda Purana. The original temple was destroyed by the Mughal emperor Aurangzeb in 1669 CE, and the current structure was built by Ahilya Bai Holkar of Indore in 1780.',
      highlights: [
        'One of the 12 Jyotirlingas',
        'Sacred to Lord Shiva',
        'Golden spire donated by Maharaja Ranjit Singh',
        'Spiritual significance for Hindus',
        'Ancient architecture'
      ],
      gallery: [
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      ],
      tags: ['temple', 'spiritual', 'varanasi', 'shiva', 'jyotirlinga', 'pilgrimage'],
      location: { lat: 25.3109, lng: 83.0104 },
    },
    {
      id: 'dashashwamedh-ghat',
      name: 'Dashashwamedh Ghat',
      city: 'Varanasi',
      category: 'Ghat',
      image: 'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
      shortDescription: 'Most spectacular ghat of Varanasi',
      description: 'Dashashwamedh Ghat is the main ghat in Varanasi on the Ganges River. It is located close to Vishwanath Temple and is probably the most spectacular ghat. Two Hindu legends are associated with it: according to one, Brahma created it to welcome Shiva, and according to another, Brahma sacrificed ten horses during Dasa-Ashwamedha yajna performed here.',
      history: 'The ghat is very old and finds mention in ancient texts. The present ghat was built by Peshwa Balaji Baji Rao in 1748. The ghat is known for its spectacular Ganga Aarti ceremony held every evening.',
      highlights: [
        'Famous Ganga Aarti ceremony',
        'Sacred bathing ghat',
        'Boat rides available',
        'Cultural performances',
        'Historical significance'
      ],
      gallery: [
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
        'https://images.pexels.com/photos/13064865/pexels-photo-13064865.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      ],
      tags: ['ghat', 'ganga', 'aarti', 'varanasi', 'spiritual', 'cultural', 'evening'],
      location: { lat: 25.3073, lng: 83.0103 },
    },
    {
      id: 'ram-janmabhoomi',
      name: 'Ram Janmabhoomi',
      city: 'Ayodhya',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      shortDescription: 'Birthplace of Lord Rama',
      description: 'Ram Janmabhoomi is the birthplace of Rama, the seventh avatar of the Hindu deity Vishnu. The Ram Janmabhoomi temple is being constructed at the site. The temple is expected to be completed by 2024 and will be one of the largest temples in India.',
      history: 'According to Hindu belief, Ayodhya is the birthplace of Rama. The site has been a matter of dispute for centuries, but recent developments have led to the construction of a grand temple at the site.',
      highlights: [
        'Birthplace of Lord Rama',
        'Newly constructed grand temple',
        'Pilgrimage destination',
        'Architectural marvel',
        'Religious significance'
      ],
      gallery: [
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      ],
      tags: ['temple', 'rama', 'ayodhya', 'pilgrimage', 'birthplace', 'spiritual'],
      location: { lat: 26.7956, lng: 82.1943 },
    },
    {
      id: 'triveni-sangam',
      name: 'Triveni Sangam',
      city: 'Prayagraj',
      category: 'Sacred Site',
      image: 'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
      shortDescription: 'Confluence of three sacred rivers',
      description: 'Triveni Sangam is the confluence of three rivers - Ganges, Yamuna, and the mythical Saraswati at Prayagraj. It is one of the most sacred places in Hinduism and is the site of the famous Kumbh Mela.',
      history: 'The confluence has been mentioned in ancient texts and has been a pilgrimage site for thousands of years. The Kumbh Mela, held every 12 years, attracts millions of devotees from around the world.',
      highlights: [
        'Confluence of three rivers',
        'Kumbh Mela site',
        'Sacred bathing spot',
        'Boat rides available',
        'Spiritual significance'
      ],
      gallery: [
        'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
        'https://images.pexels.com/photos/13064865/pexels-photo-13064865.jpeg',
      ],
      tags: ['sangam', 'confluence', 'prayagraj', 'rivers', 'kumbh', 'pilgrimage'],
      location: { lat: 25.4267, lng: 81.8873 },
    },
    {
      id: 'anand-bhavan',
      name: 'Anand Bhavan',
      city: 'Prayagraj',
      category: 'Historical',
      image: 'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      shortDescription: 'Historic home of the Nehru family',
      description: 'Anand Bhavan is a historic house museum in Prayagraj, India. It was the residence of the Nehru family and is now a museum showcasing the life and times of the Indian independence movement.',
      history: 'The house was built in the 1930s and was the residence of Motilal Nehru and his family, including Jawaharlal Nehru and Indira Gandhi. It has been converted into a museum showcasing the Indian freedom struggle.',
      highlights: [
        'Nehru family residence',
        'Freedom struggle museum',
        'Historical artifacts',
        'Independence movement history',
        'Cultural heritage'
      ],
      gallery: [
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      ],
      tags: ['museum', 'nehru', 'prayagraj', 'history', 'independence', 'heritage'],
      location: { lat: 25.4484, lng: 81.8428 },
    },
    {
      id: 'bhu-temple',
      name: 'BHU New Vishwanath Temple',
      city: 'Varanasi',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      shortDescription: 'Modern temple in Banaras Hindu University',
      description: 'The New Vishwanath Temple, popularly known as BHU Temple, is located inside the Banaras Hindu University campus. Built by the Birla family, it is a modern temple dedicated to Lord Shiva.',
      history: 'The temple was built in 1966 by the Birla family and is designed to accommodate a larger number of devotees than the original Kashi Vishwanath Temple.',
      highlights: [
        'Modern architecture',
        'Spacious temple complex',
        'Located in BHU campus',
        'Dedicated to Lord Shiva',
        'Peaceful environment'
      ],
      gallery: [
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      ],
      tags: ['temple', 'bhu', 'varanasi', 'shiva', 'modern', 'university'],
      location: { lat: 25.2677, lng: 82.9913 },
    },
    {
      id: 'sarnath',
      name: 'Sarnath',
      city: 'Varanasi',
      category: 'Buddhist Site',
      image: 'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      shortDescription: 'Where Buddha delivered his first sermon',
      description: 'Sarnath is a place located 10 kilometres north-east of Varanasi where Gautama Buddha first taught the Dharma, and where the Buddhist Sangha came into existence through the enlightenment of Kondanna.',
      history: 'After attaining enlightenment at Bodh Gaya, Buddha came to Sarnath to deliver his first sermon. This event is known as the Dhammacakkappavattana Sutta.',
      highlights: [
        'Buddhist pilgrimage site',
        'Ashoka Pillar',
        'Dhamekh Stupa',
        'Archaeological museum',
        'Historical significance'
      ],
      gallery: [
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      ],
      tags: ['buddhist', 'sarnath', 'varanasi', 'buddha', 'stupa', 'pilgrimage'],
      location: { lat: 25.3811, lng: 83.0285 },
    },
    {
      id: 'hanuman-garhi',
      name: 'Hanuman Garhi',
      city: 'Ayodhya',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      shortDescription: 'Fortress-like temple of Hanuman',
      description: 'Hanuman Garhi is a fortress-like temple of Hanuman in Ayodhya. It is one of the most important temples in Ayodhya and is situated on a hilltop.',
      history: 'The temple was built in the 10th century and is believed to be the place where Hanuman lived and guarded Ayodhya.',
      highlights: [
        'Fortress-like structure',
        'Dedicated to Hanuman',
        'Hilltop location',
        'Ancient temple',
        'Spiritual significance'
      ],
      gallery: [
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      ],
      tags: ['temple', 'hanuman', 'ayodhya', 'fortress', 'hilltop', 'ancient'],
      location: { lat: 26.7959, lng: 82.1947 },
    },
    {
      id: 'allahabad-fort',
      name: 'Allahabad Fort',
      city: 'Prayagraj',
      category: 'Fort',
      image: 'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      shortDescription: 'Mughal fort built by Akbar',
      description: 'Allahabad Fort is a fort built by the Mughal emperor Akbar at Prayagraj in 1583. The fort stands on the banks of the Yamuna, near its confluence with the Ganges.',
      history: 'The fort was built by Akbar in 1583 and is considered one of the finest examples of Mughal architecture. It houses the Patalpuri Temple and the Akshayavat tree.',
      highlights: [
        'Mughal architecture',
        'Built by Akbar',
        'Patalpuri Temple',
        'Akshayavat tree',
        'Historical fort'
      ],
      gallery: [
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      ],
      tags: ['fort', 'mughal', 'akbar', 'prayagraj', 'architecture', 'historical'],
      location: { lat: 25.4467, lng: 81.8424 },
    },
];

const allPackages = [
  {
      id: 'varanasi-spiritual',
      name: 'Varanasi Spiritual Tour',
      description: 'Explore the spiritual heart of India with visits to ancient temples, ghats, and experience the evening Ganga Aarti.',
      duration: '3 Days / 2 Nights',
      cities: ['Varanasi'],
      image: 'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
      highlights: [
        'Kashi Vishwanath Temple visit',
        'Dashashwamedh Ghat Aarti',
        'Boat ride on Ganges',
        'Sarnath Buddhist site',
        'BHU New Vishwanath Temple',
        'Morning temple prayers',
        'Cultural performances'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival and Ganga Aarti',
          activities: [
            'Arrival in Varanasi',
            'Check-in to accommodation',
            'Evening Ganga Aarti at Dashashwamedh Ghat',
            'Boat ride on Ganges',
          ],
        },
        {
          day: 2,
          title: 'Temple Trail and Sarnath',
          activities: [
            'Morning prayers at Kashi Vishwanath Temple',
            'Visit to BHU New Vishwanath Temple',
            'Explore Sarnath Buddhist site',
            'Visit to Dhamekh Stupa',
            'Sarnath Archaeological Museum',
          ],
        },
        {
          day: 3,
          title: 'Cultural Exploration',
          activities: [
            'Morning boat ride and sunrise viewing',
            'Visit to local markets',
            'Silk weaving workshop',
            'Cultural performances',
            'Departure',
          ],
        },
      ],
      inclusions: [
        'Accommodation for 2 nights',
        'All temple visits',
        'Boat rides',
        'Local transportation',
        'English-speaking guide',
        'Cultural performances',
      ],
      gallery: [
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      ],
      tags: ['spiritual', 'varanasi', 'temples', 'ganga', 'aarti', 'pilgrimage'],
    },
    {
      id: 'ayodhya-pilgrimage',
      name: 'Ayodhya Pilgrimage',
      description: 'Journey to the birthplace of Lord Rama and explore the sacred sites of Ayodhya.',
      duration: '2 Days / 1 Night',
      cities: ['Ayodhya'],
      image: 'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      highlights: [
        'Ram Janmabhoomi Temple',
        'Hanuman Garhi',
        'Kanak Bhavan',
        'Nageshwarnath Temple',
        'Treta Ke Thakur',
        'Ramkot area exploration',
        'Spiritual ceremonies'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Sacred Sites Visit',
          activities: [
            'Arrival in Ayodhya',
            'Ram Janmabhoomi Temple visit',
            'Hanuman Garhi temple',
            'Kanak Bhavan temple',
            'Evening prayers',
          ],
        },
        {
          day: 2,
          title: 'Temple Circuit',
          activities: [
            'Morning prayers at Ram Janmabhoomi',
            'Nageshwarnath Temple',
            'Treta Ke Thakur',
            'Ramkot exploration',
            'Departure',
          ],
        },
      ],
      inclusions: [
        'Accommodation for 1 night',
        'All temple visits',
        'Local transportation',
        'English-speaking guide',
        'Temple ceremonies participation',
      ],
      gallery: [
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      ],
      tags: ['pilgrimage', 'ayodhya', 'rama', 'temples', 'spiritual', 'heritage'],
    },
    {
      id: 'prayagraj-heritage',
      name: 'Prayagraj Heritage Walk',
      description: 'Discover the historical and cultural heritage of Prayagraj with visits to forts, museums, and the sacred Sangam.',
      duration: '2 Days / 1 Night',
      cities: ['Prayagraj'],
      image: 'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
      highlights: [
        'Triveni Sangam boat ride',
        'Allahabad Fort exploration',
        'Anand Bhavan museum',
        'Khusro Bagh',
        'All Saints Cathedral',
        'Sangam bathing experience',
        'Historical sites tour'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Sacred Sangam and Fort',
          activities: [
            'Arrival in Prayagraj',
            'Triveni Sangam boat ride',
            'Sacred bathing at Sangam',
            'Allahabad Fort visit',
            'Patalpuri Temple',
          ],
        },
        {
          day: 2,
          title: 'Heritage and Culture',
          activities: [
            'Anand Bhavan museum visit',
            'Khusro Bagh exploration',
            'All Saints Cathedral',
            'Local markets and crafts',
            'Departure',
          ],
        },
      ],
      inclusions: [
        'Accommodation for 1 night',
        'Boat rides at Sangam',
        'All site visits',
        'Local transportation',
        'English-speaking guide',
        'Museum entries',
      ],
      gallery: [
        'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
      ],
      tags: ['heritage', 'prayagraj', 'sangam', 'fort', 'museum', 'cultural'],
    },
    {
      id: 'three-city-combo',
      name: 'Three-City Heritage Combo',
      description: 'Complete spiritual and cultural journey covering Varanasi, Ayodhya, and Prayagraj in one comprehensive package.',
      duration: '6 Days / 5 Nights',
      cities: ['Varanasi', 'Ayodhya', 'Prayagraj'],
      image: 'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      highlights: [
        'All three sacred cities',
        'Complete temple circuit',
        'Ganga Aarti experiences',
        'Historical site visits',
        'Cultural immersion',
        'Spiritual ceremonies',
        'Heritage exploration'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Varanasi Arrival',
          activities: [
            'Arrival in Varanasi',
            'Check-in to accommodation',
            'Evening Ganga Aarti',
            'Boat ride on Ganges',
          ],
        },
        {
          day: 2,
          title: 'Varanasi Temples',
          activities: [
            'Kashi Vishwanath Temple',
            'BHU New Vishwanath Temple',
            'Sarnath Buddhist site',
            'Cultural performances',
          ],
        },
        {
          day: 3,
          title: 'Travel to Ayodhya',
          activities: [
            'Morning prayers in Varanasi',
            'Travel to Ayodhya',
            'Ram Janmabhoomi Temple',
            'Hanuman Garhi',
          ],
        },
        {
          day: 4,
          title: 'Ayodhya Exploration',
          activities: [
            'Complete temple circuit',
            'Kanak Bhavan',
            'Nageshwarnath Temple',
            'Ramkot area',
          ],
        },
        {
          day: 5,
          title: 'Prayagraj Journey',
          activities: [
            'Travel to Prayagraj',
            'Triveni Sangam',
            'Allahabad Fort',
            'Anand Bhavan',
          ],
        },
        {
          day: 6,
          title: 'Departure',
          activities: [
            'Final prayers at Sangam',
            'Local shopping',
            'Departure',
          ],
        },
      ],
      inclusions: [
        'Accommodation for 5 nights',
        'All city transfers',
        'All temple and site visits',
        'Boat rides',
        'Local transportation',
        'English-speaking guide',
        'Cultural experiences',
      ],
      gallery: [
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
      ],
      tags: ['combo', 'three-cities', 'heritage', 'spiritual', 'cultural', 'complete'],
    },
];

async function seedDatabase() {
  console.log('Starting to seed database...');

  // Seed Places
  console.log('Seeding places...');
  for (const place of allPlaces) {
    try {
      await setDoc(doc(db, "places", place.id), place);
      console.log(`  - Seeded place: ${place.name}`);
    } catch (error) {
      console.error(`  - Error seeding place ${place.name}:`, error);
    }
  }
  console.log('Finished seeding places.');

  // Seed Packages
  console.log('Seeding packages...');
  for (const pkg of allPackages) {
    try {
      await setDoc(doc(db, "packages", pkg.id), pkg);
      console.log(`  - Seeded package: ${pkg.name}`);
    } catch (error) {
      console.error(`  - Error seeding package ${pkg.name}:`, error);
    }
  }
  console.log('Finished seeding packages.');

  console.log('Database seeding complete!');
}

seedDatabase().catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
});
