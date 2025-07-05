import { db } from './firebase';
import { collection, getDocs, getDoc, doc, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';

export interface Place {
  id: string;
  name: string;
  city: string;
  category: string;
  thumbnail: string;
  description: string;
  history: string;
  highlights: string[];
  images: string[];
  tags: string[];
  location: { lat: number; lng: number };
  tagline: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  tagline: string;
  cities: string[];
  thumbnail: string;
  images: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  tags: string[];
}


const placeConverter = (doc: QueryDocumentSnapshot | DocumentData): Place => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || '',
    city: data.city || '',
    category: data.category || '',
    thumbnail: data.image || 'https://placehold.co/600x400/ff851b/ffffff?text=Image',
    description: data.description || '',
    history: data.history || '',
    highlights: data.highlights || [],
    images: data.gallery || [],
    tags: data.tags || [],
    location: data.location || { lat: 0, lng: 0 },
    tagline: data.shortDescription || data.description?.substring(0, 50) + '...' || '',
  };
};

const packageConverter = (doc: QueryDocumentSnapshot | DocumentData): Package => {
    const data = doc.data();
    const itinerary = (data.itinerary || []).map((item: any) => ({
        day: item.day,
        title: item.title,
        description: Array.isArray(item.activities) ? item.activities.join('. ') : '',
    }));

    return {
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        duration: data.duration || '',
        price: data.price || "Contact for price",
        tagline: data.tagline || data.description?.substring(0, 60) + '...' || '',
        cities: data.cities || [],
        thumbnail: data.image || 'https://placehold.co/600x400/008080/ffffff?text=Package',
        images: data.gallery || [],
        highlights: data.highlights || [],
        itinerary: itinerary,
        inclusions: data.inclusions || [],
        tags: data.tags || [],
    };
};

export async function getPlaces(): Promise<Place[]> {
  try {
    const placesCol = collection(db, 'places');
    const placesSnapshot = await getDocs(placesCol);
    return placesSnapshot.docs.map(doc => placeConverter(doc));
  } catch (e) {
    console.error("Error fetching places:", e);
    return [];
  }
}

export async function getPlaceById(id: string): Promise<Place | undefined> {
  try {
    const docRef = doc(db, 'places', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return placeConverter(docSnap);
    }
  } catch(e) {
    console.error("Error fetching place by id:", e)
  }
  return undefined;
}

export async function getPackages(): Promise<Package[]> {
  try {
    const packagesCol = collection(db, 'packages');
    const packagesSnapshot = await getDocs(packagesCol);
    return packagesSnapshot.docs.map(doc => packageConverter(doc));
  } catch(e) {
    console.error("Error fetching packages:", e);
    return [];
  }
}

export async function getPackageById(id: string): Promise<Package | undefined> {
  try {
    const docRef = doc(db, 'packages', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return packageConverter(docSnap);
    }
  } catch(e) {
    console.error("Error fetching package by id:", e);
  }
  return undefined;
}