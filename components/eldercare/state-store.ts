export interface MedicineItem {
  id: number;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export interface UserProfile {
  name: string;
  age: string;
  city: string;
  avatar: string;
  isLoggedIn?: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Ramesh Sharma',
  age: '68',
  city: 'Delhi',
  avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150',
  isLoggedIn: true,
};

const DEFAULT_MEDS: MedicineItem[] = [
  {
    id: 1,
    name: 'Metformin',
    dosage: '500mg - 1 Tablet',
    time: '08:00 AM',
    taken: false,
  },
  {
    id: 2,
    name: 'Amlodipine',
    dosage: '5mg - 1 Tablet',
    time: '01:00 PM',
    taken: false,
  },
  {
    id: 3,
    name: 'Atorvastatin',
    dosage: '10mg - 1 Tablet',
    time: '08:30 PM',
    taken: false,
  },
];

export const getStoredProfile = (): UserProfile => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const data = localStorage.getItem('sanjeevani_user_profile');
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const setStoredProfile = (profile: Partial<UserProfile>) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem('sanjeevani_user_profile', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to set profile:', error);
  }
};

export const getStoredMeds = (): MedicineItem[] => {
  if (typeof window === 'undefined') return DEFAULT_MEDS;
  try {
    const data = localStorage.getItem('sanjeevani_meds');
    return data ? JSON.parse(data) : DEFAULT_MEDS;
  } catch {
    return DEFAULT_MEDS;
  }
};

export const setStoredMeds = (meds: MedicineItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sanjeevani_meds', JSON.stringify(meds));
  } catch (error) {
    console.error('Failed to set meds:', error);
  }
};

export const getStoredWater = (): number => {
  if (typeof window === 'undefined') return 4;
  try {
    const data = localStorage.getItem('sanjeevani_water');
    return data !== null ? Number(data) : 4;
  } catch {
    return 4;
  }
};

export const setStoredWater = (glasses: number) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sanjeevani_water', String(glasses));
  } catch (error) {
    console.error('Failed to set water:', error);
  }
};