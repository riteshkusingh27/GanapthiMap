import { createClient } from '@supabase/supabase-js';
import { initialPandals } from '../data/pandalsData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kiawqprxtbicqodmyube.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_OnDW7IEhGI8fUIVpHLy2VA_cWCBucC6';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch User IP Address
export async function getUserIp() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (res.ok) {
      const data = await res.json();
      return data.ip;
    }
  } catch { /* fallback to random device fingerprint */ }
  let fp = localStorage.getItem('ganapathimap_device_fp');
  if (!fp) {
    fp = `fp-${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem('ganapathimap_device_fp', fp);
  }
  return fp;
}

// IP Cooldown Check (5 minute cooldown between submissions per IP)
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export function checkIpCooldown(ip) {
  const lastSubmitKey = `gmap_last_sub_${ip}`;
  const lastSubmitTime = localStorage.getItem(lastSubmitKey);
  if (lastSubmitTime) {
    const elapsed = Date.now() - parseInt(lastSubmitTime, 10);
    if (elapsed < COOLDOWN_MS) {
      const remainingSecs = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
      const remainingMins = Math.ceil(remainingSecs / 60);
      return {
        allowed: false,
        remainingMins,
        remainingSecs,
        message: `IP Cooldown active: Please wait ${remainingMins} min before adding another pandal.`
      };
    }
  }
  return { allowed: true };
}

export function recordIpSubmission(ip) {
  const lastSubmitKey = `gmap_last_sub_${ip}`;
  localStorage.setItem(lastSubmitKey, Date.now().toString());
}

// Fetch Pandals from Supabase (with automatic initial seeding & local fallback)
export async function fetchPandalsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('pandals')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug || item.id,
        locality: item.locality || 'Bengaluru',
        address: item.address || `${item.name}, Bengaluru`,
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        establishmentYear: item.establishment_year || 2025,
        edition: item.edition || '2025 Edition',
        theme: item.theme || 'Festival Pandal',
        idolType: item.idol_type || 'Clay Eco Idol',
        isEcoFriendly: item.is_eco_friendly ?? true,
        isFeatured: item.is_featured ?? false,
        isTrending: item.is_trending ?? true,
        status: item.status || 'verified',
        darshanTimings: item.darshan_timings || '06:00 AM - 10:00 PM',
        aartiTimings: item.aarti_timings || '08:00 AM & 07:30 PM',
        annadanam: item.annadanam || { available: false },
        facilities: item.facilities || { parking: true, toilets: true, drinkingWater: true, accessibility: true, firstAid: true },
        crowdLevel: item.crowd_level || 'Moderate',
        coverImage: item.cover_image,
        images: item.images || [item.cover_image],
        description: item.description || '',
        uploaderIp: item.uploader_ip,
        likesCount: item.likes_count || 1,
        checkinsCount: item.checkins_count || 1
      }));
    }
  } catch (err) {
    console.warn('Supabase fetch notice:', err);
  }

  return [];
}

// Save Pandal to Supabase & Store Uploader IP
export async function savePandalToSupabase(pandal, uploaderIp) {
  const payload = {
    id: pandal.id,
    name: pandal.name,
    slug: pandal.slug,
    locality: pandal.locality,
    address: pandal.address,
    latitude: pandal.latitude,
    longitude: pandal.longitude,
    establishment_year: pandal.establishmentYear,
    edition: pandal.edition,
    theme: pandal.theme,
    idol_type: pandal.idolType,
    is_eco_friendly: pandal.isEcoFriendly,
    is_featured: pandal.isFeatured,
    is_trending: pandal.isTrending,
    status: pandal.status,
    darshan_timings: pandal.darshanTimings,
    aarti_timings: pandal.aartiTimings,
    annadanam: pandal.annadanam,
    facilities: pandal.facilities,
    crowd_level: pandal.crowdLevel,
    cover_image: pandal.coverImage,
    images: pandal.images,
    description: pandal.description,
    uploader_ip: uploaderIp
  };

  try {
    const { error } = await supabase.from('pandals').upsert([payload]);
    if (error) {
      console.warn('Supabase insert notice (local storage synced):', error.message);
    }
  } catch (err) {
    console.warn('Supabase offline mode:', err);
  }
}

// Update Crowd Status in Supabase
export async function updateCrowdStatusInSupabase(pandalId, crowdLevel) {
  try {
    await supabase.from('pandals').update({ crowd_level: crowdLevel }).eq('id', pandalId);
  } catch (err) {
    console.warn('Supabase crowd update error:', err);
  }
}
