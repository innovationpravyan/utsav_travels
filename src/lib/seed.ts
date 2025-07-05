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
      id: 'sankat-mochan-temple',
      name: 'Sankat Mochan Hanuman Temple',
      city: 'Varanasi',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      shortDescription: 'Famous Hanuman temple built by Tulsidas',
      description: 'Built in the 16th century by saint-poet Tulsidas, this temple is dedicated to Lord Hanuman. Located on the banks of River Assi, it is famous for relieving devotees from troubles and sorrows. The temple hosts the annual Sankat Mochan Sangeet Samaroh music festival.',
      history: 'The temple was constructed by Goswami Tulsidas in the 16th century and is considered one of the most important Hanuman temples in India.',
      highlights: [
        'Built by Tulsidas',
        'Relieves troubles and sorrows',
        'Annual music festival (April 16-21, 2025)',
        'Located on River Assi',
        'Famous for Hanuman Chalisa chanting'
      ],
      gallery: [
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      ],
      tags: ['temple', 'hanuman', 'varanasi', 'tulsidas', 'music', 'festival'],
      location: { lat: 25.2820, lng: 83.0047 },
    },
    {
      id: 'durga-temple-varanasi',
      name: 'Durga Temple (Monkey Temple)',
      city: 'Varanasi',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      shortDescription: 'Red temple with Nagara architecture',
      description: 'Built in the 18th century, the Durga Temple is famous for its red color and Nagara architectural style. It is dedicated to Goddess Durga and features a sacred pond called Durgakund adjacent to it.',
      history: 'The temple was built in the 18th century and is one of the finest examples of Nagara architecture in Varanasi.',
      highlights: [
        'Red-colored temple',
        'Nagara architecture',
        'Dedicated to Goddess Durga',
        'Adjacent Durgakund pond',
        'Multi-tier structure'
      ],
      gallery: [
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      ],
      tags: ['temple', 'durga', 'varanasi', 'architecture', 'red', 'pond'],
      location: { lat: 25.2851, lng: 83.0059 },
    },
    {
      id: 'ram-janmabhoomi',
      name: 'Ram Janmabhoomi',
      city: 'Ayodhya',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      shortDescription: 'Birthplace of Lord Rama',
      description: 'Ram Janmabhoomi is the birthplace of Rama, the seventh avatar of the Hindu deity Vishnu. The Ram Janmabhoomi temple was inaugurated on January 22, 2024, and is expected to be completed by July 2025. Built with 600,000 cubic feet of Rajasthani sandstone, it can accommodate 25,000 pilgrims.',
      history: 'According to Hindu belief, Ayodhya is the birthplace of Rama. After decades of legal dispute, the temple construction began in 2020 and was inaugurated in 2024.',
      highlights: [
        'Birthplace of Lord Rama',
        'Inaugurated January 22, 2024',
        '100,000-150,000 daily visitors',
        'Three-story temple complex',
        'Traditional Indian dress code mandatory'
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
      id: 'hanuman-garhi',
      name: 'Hanuman Garhi',
      city: 'Ayodhya',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      shortDescription: 'Fortress-like temple of Hanuman',
      description: 'Hanuman Garhi is a 10th-century fortress-like temple dedicated to Hanuman in Ayodhya. It is customary to visit this temple before visiting the Ram Mandir. The temple features 76 stairs and a golden statue of Hanuman.',
      history: 'The temple was built in the 10th century and is believed to be the place where Hanuman lived and guarded Ayodhya.',
      highlights: [
        'Fortress-like structure',
        '76 stairs to climb',
        'Golden Hanuman statue',
        'Must visit before Ram Mandir',
        'Guardian of Ayodhya'
      ],
      gallery: [
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      ],
      tags: ['temple', 'hanuman', 'ayodhya', 'fortress', 'guardian', 'ancient'],
      location: { lat: 26.7959, lng: 82.1947 },
    },
    {
      id: 'kanak-bhavan',
      name: 'Kanak Bhavan',
      city: 'Ayodhya',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      shortDescription: 'Golden temple dedicated to Rama and Sita',
      description: 'Built in 1891 by Queen Vrishabhanu Kunwari, Kanak Bhavan is also known as the Golden Temple or Sone-ka-Ghar. It houses idols of Lord Rama and Sita along with his three brothers.',
      history: 'The temple was constructed in 1891 and is famous for its exquisite decoration and golden appearance.',
      highlights: [
        'Built in 1891',
        'Also called Golden Temple',
        'Idols of Rama, Sita and brothers',
        'Exquisitely decorated',
        'Located in Tulsi Nagar'
      ],
      gallery: [
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      ],
      tags: ['temple', 'rama', 'sita', 'ayodhya', 'golden', 'palace'],
      location: { lat: 26.7962, lng: 82.1950 },
    },
    {
      id: 'nageshwarnath-temple',
      name: 'Nageshwarnath Temple',
      city: 'Ayodhya',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      shortDescription: 'Ancient Shiva temple built by Kush',
      description: 'The Nageshwarnath Temple is dedicated to Lord Nageshwarnath, the presiding deity of Ayodhya. It is believed to have been built by Kush, son of Lord Rama. The current structure was rebuilt in 1750 AD.',
      history: 'Originally built by Kush (Lord Rama\'s son), the temple was reconstructed in 1750 AD and houses an ancient Shivalinga.',
      highlights: [
        'Built by Kush (Rama\'s son)',
        'Presiding deity of Ayodhya',
        'Ancient Shivalinga',
        'Rebuilt in 1750 AD',
        'Near Theri Bazaar'
      ],
      gallery: [
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      ],
      tags: ['temple', 'shiva', 'ayodhya', 'ancient', 'kush', 'deity'],
      location: { lat: 26.7954, lng: 82.1941 },
    },
    {
      id: 'neelkanth-mahadev',
      name: 'Neelkanth Mahadev Temple',
      city: 'Rishikesh',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      shortDescription: 'Where Lord Shiva drank poison',
      description: 'Neelkanth Mahadev Temple is located 30 km from Rishikesh in the dense forests of Pauri Garhwal at 1,330 meters elevation. It is believed to be the place where Lord Shiva drank the poison that emerged during Samudra Manthan (ocean churning).',
      history: 'The temple is mentioned in ancient scriptures and is believed to be the site where Lord Shiva got his blue throat (Neelkanth) after drinking poison.',
      highlights: [
        'Where Shiva drank poison',
        'Located in dense forest',
        'Scenic trek through jungle',
        'Waterfalls nearby',
        'Blue-throated Shiva form'
      ],
      gallery: [
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      ],
      tags: ['temple', 'shiva', 'rishikesh', 'neelkanth', 'forest', 'trek'],
      location: { lat: 30.1629, lng: 78.4382 },
    },
    {
      id: 'triveni-ghat-rishikesh',
      name: 'Triveni Ghat',
      city: 'Rishikesh',
      category: 'Ghat',
      image: 'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
      shortDescription: 'Sacred confluence of three rivers',
      description: 'Triveni Ghat is the confluence of Ganga, Yamuna, and Saraswati rivers in Rishikesh. It is famous for the daily Maha Aarti performed at sunrise and sunset, where priests perform elaborate rituals with fire lamps and chants.',
      history: 'This sacred ghat has been a center of spiritual activities for centuries and is considered highly auspicious for ritual bathing.',
      highlights: [
        'Confluence of three rivers',
        'Daily Maha Aarti ceremony',
        'Sacred bathing spot',
        'Sunrise and sunset prayers',
        'Cultural programs'
      ],
      gallery: [
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
        'https://images.pexels.com/photos/13064865/pexels-photo-13064865.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      ],
      tags: ['ghat', 'confluence', 'rishikesh', 'aarti', 'spiritual', 'ganga'],
      location: { lat: 30.1033, lng: 78.2932 },
    },
    {
      id: 'lakshman-jhula',
      name: 'Lakshman Jhula',
      city: 'Rishikesh',
      category: 'Bridge',
      image: 'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
      shortDescription: 'Iconic suspension bridge',
      description: 'Lakshman Jhula is a 450-foot iron suspension bridge built in 1929, spanning the Ganges River. According to legend, this is where Lakshman crossed the river using jute ropes. The bridge connects temples, markets, and ashrams on both sides.',
      history: 'Built in 1929 to commemorate the spot where Lord Lakshman crossed the Ganges on jute ropes during the epic Ramayana.',
      highlights: [
        '450-foot suspension bridge',
        'Built in 1929',
        'Connects temples and ashrams',
        '70 feet above river',
        'Legendary crossing point'
      ],
      gallery: [
        'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      ],
      tags: ['bridge', 'lakshman', 'rishikesh', 'ganges', 'iconic', 'suspension'],
      location: { lat: 30.1093, lng: 78.2977 },
    },
    {
      id: 'beatles-ashram',
      name: 'Beatles Ashram (Chaurasi Kutia)',
      city: 'Rishikesh',
      category: 'Ashram',
      image: 'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      shortDescription: 'Where Beatles studied meditation',
      description: 'The Beatles Ashram, also known as Chaurasi Kutia, is where the famous British band The Beatles studied transcendental meditation with Maharishi Mahesh Yogi in 1968. The ashram features graffiti art and meditation halls.',
      history: 'In 1968, The Beatles spent time here studying meditation, making it one of the most famous ashrams in the world among young travelers.',
      highlights: [
        'Beatles\' meditation retreat (1968)',
        'Graffiti art by musicians',
        'Meditation courses available',
        'Historical exploration',
        'Popular with young travelers'
      ],
      gallery: [
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      ],
      tags: ['ashram', 'beatles', 'rishikesh', 'meditation', 'music', 'history'],
      location: { lat: 30.1186, lng: 78.3022 },
    },
    {
      id: 'kunjapuri-temple',
      name: 'Kunjapuri Devi Temple',
      city: 'Rishikesh',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      shortDescription: 'Shakti Peetha with Himalayan views',
      description: 'Kunjapuri Devi Temple is located at 1,645 meters elevation and is one of the 51 Shakti Peethas where Goddess Sati\'s chest fell. The temple offers panoramic views of the Himalayas and is famous for its stunning sunrise views.',
      history: 'This ancient temple is part of the Shakti Peetha circuit and holds immense religious significance for devotees of the Divine Mother.',
      highlights: [
        'One of 51 Shakti Peethas',
        'Panoramic Himalayan views',
        'Stunning sunrise viewpoint',
        '1,645 meters elevation',
        'Sacred feminine energy site'
      ],
      gallery: [
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      ],
      tags: ['temple', 'shakti', 'rishikesh', 'himalaya', 'sunrise', 'trekking'],
      location: { lat: 30.1667, lng: 78.4333 },
    },
    {
      id: 'kedarnath-temple',
      name: 'Kedarnath Temple',
      city: 'Kedarnath',
      category: 'Temple',
      image: 'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      shortDescription: 'One of 12 Jyotirlingas and Char Dham',
      description: 'Kedarnath Temple is located at 3,583 meters and is one of the 12 Jyotirlingas and part of Char Dham. Built by the Pandavas and renovated by Adi Shankaracharya, it opens on May 2, 2025, and closes on October 23, 2025. The temple requires a 16-17 km trek from Gaurikund.',
      history: 'Built by the Pandavas to please Lord Shiva, the temple was renovated by Adi Shankaracharya 1,200 years ago. It has Pali inscriptions and mythological carvings.',
      highlights: [
        'One of 12 Jyotirlingas',
        'Part of Char Dham circuit',
        'Located at 3,583 meters',
        '16-17 km trek required',
        'Opens May 2, 2025'
      ],
      gallery: [
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      ],
      tags: ['temple', 'jyotirlinga', 'kedarnath', 'char-dham', 'shiva', 'pilgrimage'],
      location: { lat: 30.7346, lng: 79.0669 },
    },
    {
      id: 'vasuki-tal',
      name: 'Vasuki Tal',
      city: 'Kedarnath',
      category: 'Lake',
      image: 'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
      shortDescription: 'Sacred high-altitude lake',
      description: 'Vasuki Tal is located at 4,135 meters elevation and is a crystal-clear lake reflecting the Himalayan peaks. Named after the serpent Vasuki around Lord Shiva\'s neck, it requires a 4 km trek from Kedarnath Temple.',
      history: 'The lake gets its name from Vasuki, the serpent deity associated with Lord Shiva, and is considered sacred by pilgrims.',
      highlights: [
        'Located at 4,135 meters',
        'Crystal clear mountain lake',
        '4 km trek from Kedarnath',
        'Named after Vasuki serpent',
        'Himalayan peak reflections'
      ],
      gallery: [
        'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      ],
      tags: ['lake', 'kedarnath', 'trekking', 'himalaya', 'vasuki', 'high-altitude'],
      location: { lat: 30.7580, lng: 79.0900 },
    },
    {
      id: 'gaurikund',
      name: 'Gaurikund',
      city: 'Kedarnath',
      category: 'Sacred Site',
      image: 'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      shortDescription: 'Starting point of Kedarnath trek',
      description: 'Gaurikund is located at 6,500 feet elevation and serves as the starting point for the 16-17 km trek to Kedarnath Temple. It has natural hot springs and is where the road ends for Kedarnath pilgrimage.',
      history: 'Named after Goddess Gauri (Parvati), this sacred site has been the traditional starting point for Kedarnath pilgrimage for centuries.',
      highlights: [
        'Starting point of Kedarnath trek',
        'Natural hot springs',
        'Located at 6,500 feet',
        'End of motorable road',
        'Sacred to Goddess Gauri'
      ],
      gallery: [
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      ],
      tags: ['pilgrimage', 'kedarnath', 'trek', 'hot-springs', 'gauri', 'base-camp'],
      location: { lat: 30.6390, lng: 79.0082 },
    },
    {
      id: 'sonprayag',
      name: 'Sonprayag',
      city: 'Kedarnath',
      category: 'Sacred Site',
      image: 'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
      shortDescription: 'Confluence of Vasuki and Mandakini rivers',
      description: 'Sonprayag is located at 1,829 meters and is the confluence of the sacred Vasuki and Mandakini rivers. It serves as an important stop on the route to Kedarnath with beautiful views of snow-capped peaks.',
      history: 'This ancient confluence point has been revered by pilgrims for centuries as a sacred bathing spot for sin cleansing.',
      highlights: [
        'Confluence of two sacred rivers',
        'Sacred bathing for sin cleansing',
        'Snow-capped peak views',
        'Important pilgrimage stop',
        'Located at 1,829 meters'
      ],
      gallery: [
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
        'https://images.pexels.com/photos/13064865/pexels-photo-13064865.jpeg',
        'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
      ],
      tags: ['confluence', 'kedarnath', 'rivers', 'pilgrimage', 'bathing', 'sacred'],
      location: { lat: 30.6584, lng: 79.0317 },
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
        'Sankat Mochan Hanuman Temple',
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
            'Visit Sankat Mochan Hanuman Temple',
            'Durga Temple and local markets',
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
      description: 'Journey to the birthplace of Lord Rama and explore the sacred sites of Ayodhya including the newly inaugurated Ram Mandir.',
      duration: '2 Days / 1 Night',
      cities: ['Ayodhya'],
      image: 'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      highlights: [
        'Ram Janmabhoomi Temple (newly inaugurated)',
        'Hanuman Garhi',
        'Kanak Bhavan',
        'Nageshwarnath Temple',
        'Ram Ki Paidi bathing ghat',
        'Sita Ki Rasoi',
        'Traditional dress code experience'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Sacred Sites Visit',
          activities: [
            'Arrival in Ayodhya',
            'Ram Janmabhoomi Temple visit (dress code required)',
            'Hanuman Garhi temple',
            'Kanak Bhavan temple',
            'Evening prayers at Ram Ki Paidi',
          ],
        },
        {
          day: 2,
          title: 'Temple Circuit',
          activities: [
            'Morning prayers at Ram Janmabhoomi',
            'Nageshwarnath Temple',
            'Sita Ki Rasoi visit',
            'Guptar Ghat exploration',
            'Departure',
          ],
        },
      ],
      inclusions: [
        'Accommodation for 1 night',
        'All temple visits',
        'Local transportation',
        'English-speaking guide',
        'Temple ceremony participation',
        'Traditional dress arrangement',
      ],
      gallery: [
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      ],
      tags: ['pilgrimage', 'ayodhya', 'rama', 'temples', 'spiritual', 'heritage'],
    },
    {
      id: 'rishikesh-yoga-adventure',
      name: 'Rishikesh Yoga & Adventure',
      description: 'Experience the yoga capital of the world with spiritual temples, adventure activities, and Himalayan beauty.',
      duration: '4 Days / 3 Nights',
      cities: ['Rishikesh'],
      image: 'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
      highlights: [
        'Neelkanth Mahadev Temple trek',
        'Triveni Ghat Maha Aarti',
        'Lakshman Jhula and Ram Jhula',
        'Beatles Ashram exploration',
        'Kunjapuri sunrise trek',
        'White water rafting',
        'Yoga and meditation sessions'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival and Ganga Aarti',
          activities: [
            'Arrival in Rishikesh',
            'Check-in to accommodation',
            'Triveni Ghat Maha Aarti',
            'Evening yoga session',
          ],
        },
        {
          day: 2,
          title: 'Temple Trek and Adventure',
          activities: [
            'Early morning Neelkanth Mahadev Temple trek',
            'Jungle walk and waterfalls',
            'Afternoon white water rafting',
            'Lakshman Jhula exploration',
          ],
        },
        {
          day: 3,
          title: 'Sunrise Trek and Culture',
          activities: [
            'Early morning Kunjapuri sunrise trek',
            'Beatles Ashram visit',
            'Ram Jhula market exploration',
            'Evening meditation session',
          ],
        },
        {
          day: 4,
          title: 'Adventure and Departure',
          activities: [
            'Morning yoga class',
            'Bungee jumping or Flying Fox',
            'Parmarth Niketan Ashram visit',
            'Departure',
          ],
        },
      ],
      inclusions: [
        'Accommodation for 3 nights',
        'All temple and ashram visits',
        'Adventure activities',
        'Yoga and meditation sessions',
        'Local transportation',
        'English-speaking guide',
        'Trekking support',
      ],
      gallery: [
        'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
        'https://images.pexels.com/photos/6411397/pexels-photo-6411397.jpeg',
      ],
      tags: ['yoga', 'rishikesh', 'adventure', 'temples', 'trekking', 'rafting'],
    },
    {
      id: 'kedarnath-yatra',
      name: 'Kedarnath Yatra',
      description: 'Sacred pilgrimage to one of the 12 Jyotirlingas located in the Himalayas with helicopter and trekking options.',
      duration: '5 Days / 4 Nights',
      cities: ['Kedarnath'],
      image: 'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      highlights: [
        'Kedarnath Temple darshan',
        'Helicopter service option (₹6,500)',
        '16-17 km Himalayan trek',
        'Vasuki Tal sacred lake',
        'Gaurikund hot springs',
        'Sonprayag river confluence',
        'High-altitude spiritual experience'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Journey to Guptkashi',
          activities: [
            'Departure from Delhi/Haridwar',
            'Drive to Guptkashi via scenic mountain roads',
            'Vishwanath Temple visit',
            'Overnight in Guptkashi',
          ],
        },
        {
          day: 2,
          title: 'Trek to Kedarnath',
          activities: [
            'Early morning drive to Gaurikund',
            'Begin 16-17 km trek to Kedarnath (or helicopter option)',
            'Check-in at Kedarnath accommodation',
            'Evening temple darshan',
          ],
        },
        {
          day: 3,
          title: 'Kedarnath Exploration',
          activities: [
            'Early morning temple prayers',
            'Trek to Vasuki Tal (optional)',
            'Meditation and spiritual activities',
            'Evening temple aarti',
          ],
        },
        {
          day: 4,
          title: 'Return Journey',
          activities: [
            'Final darshan at Kedarnath Temple',
            'Trek back to Gaurikund',
            'Drive to Rudraprayag',
            'Overnight stay',
          ],
        },
        {
          day: 5,
          title: 'Return to Origin',
          activities: [
            'Drive via Devprayag (Ganga-Alaknanda confluence)',
            'Stop at Rishikesh',
            'Return to Delhi/Haridwar',
          ],
        },
      ],
      inclusions: [
        'Accommodation for 4 nights',
        'All transportation (helicopter optional)',
        'Kedarnath temple darshan',
        'Trek support and guides',
        'Meals during trek',
        'Emergency medical support',
        'Char Dham registration',
      ],
      gallery: [
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
        'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
      ],
      tags: ['kedarnath', 'jyotirlinga', 'char-dham', 'trek', 'helicopter', 'pilgrimage'],
    },
    {
      id: 'four-destination-spiritual',
      name: 'Four-Destination Spiritual Circuit',
      description: 'Complete spiritual journey covering Varanasi, Ayodhya, Rishikesh, Kedarnath - the ultimate pilgrimage experience.',
      duration: '10 Days / 9 Nights',
      cities: ['Varanasi', 'Ayodhya', 'Rishikesh', 'Kedarnath'],
      image: 'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
      highlights: [
        'All four sacred destinations',
        'Complete temple circuit',
        'Ganga Aarti experiences',
        'Himalayan pilgrimage',
        'Yoga and meditation',
        'Adventure activities',
        'Cultural immersion'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Varanasi Arrival',
          activities: [
            'Arrival in Varanasi',
            'Check-in to accommodation',
            'Evening Ganga Aarti at Dashashwamedh Ghat',
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
            'Sankat Mochan Temple',
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
            'Ram Ki Paidi bathing',
          ],
        },
        {
          day: 5,
          title: 'Journey to Rishikesh',
          activities: [
            'Travel to Rishikesh',
            'Triveni Ghat Aarti',
            'Lakshman Jhula exploration',
            'Evening yoga session',
          ],
        },
        {
          day: 6,
          title: 'Rishikesh Adventure',
          activities: [
            'Neelkanth Mahadev Temple trek',
            'White water rafting',
            'Beatles Ashram visit',
            'Adventure activities',
          ],
        },
        {
          day: 7,
          title: 'Kedarnath Journey Begins',
          activities: [
            'Travel to Guptkashi',
            'Mountain scenic drive',
            'Preparation for Kedarnath',
            'Overnight in Guptkashi',
          ],
        },
        {
          day: 8,
          title: 'Kedarnath Darshan',
          activities: [
            'Early morning trek/helicopter to Kedarnath',
            'Temple darshan',
            'High-altitude spiritual experience',
            'Overnight at Kedarnath',
          ],
        },
        {
          day: 9,
          title: 'Kedarnath to Rishikesh',
          activities: [
            'Final prayers at Kedarnath',
            'Return to Rishikesh',
            'Relaxation and reflection',
            'Farewell Ganga Aarti',
          ],
        },
        {
          day: 10,
          title: 'Departure',
          activities: [
            'Final prayers and meditation',
            'Local shopping',
            'Departure to Delhi/origin city',
          ],
        },
      ],
      inclusions: [
        'Accommodation for 9 nights',
        'All city transfers and transportation',
        'All temple and site visits',
        'Boat rides and adventure activities',
        'Kedarnath trek support',
        'English-speaking guides',
        'Cultural experiences and yoga sessions',
        'Helicopter option for Kedarnath',
      ],
      gallery: [
        'https://images.pexels.com/photos/3401403/pexels-photo-3401403.jpeg',
        'https://images.pexels.com/photos/11894221/pexels-photo-11894221.jpeg',
        'https://images.pexels.com/photos/15031346/pexels-photo-15031346.jpeg',
        'https://images.pexels.com/photos/9630464/pexels-photo-9630464.jpeg',
        'https://images.pexels.com/photos/8078529/pexels-photo-8078529.jpeg',
      ],
      tags: ['complete-circuit', 'four-cities', 'spiritual', 'pilgrimage', 'cultural', 'adventure'],
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