/**
 * Get visitor's location data using browser geolocation and reverse geocoding
 * Uses OpenStreetMap Nominatim API for free reverse geocoding
 */

interface LocationData {
  visitor_city: string
  visitor_province: string
  visitor_country: string
  latitude?: number
  longitude?: number
}

interface NominatimResponse {
  address: {
    region?: string
    city?: string
    town?: string
    village?: string
    county?: string
    state?: string
    province?: string
    country?: string
  }
}

/**
 * Reverse geocode coordinates using OpenStreetMap Nominatim API
 * Free service, no API key required
 */
async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<LocationData | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'Accept-Language': 'id', // Request Indonesian names when available
        },
      },
    )

    if (!response.ok) {
      console.error('Reverse geocoding failed:', response.status)
      return null
    }

    const data: NominatimResponse = await response.json()

    // Extract location data from the response
    const address = data.address || {}

    // Get city (try multiple possible field names)
    const city = address.city || address.town || address.village || 'Unknown'

    // Get province/state
    const province =
      address.region ||
      address.state ||
      address.province ||
      address.county ||
      'Unknown'

    // Get country
    const country = address.country || 'Unknown'

    return {
      visitor_city: city,
      visitor_province: province,
      visitor_country: country,
      latitude,
      longitude,
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error)
    return null
  }
}

/**
 * Get visitor's location using browser Geolocation API
 * Falls back to reverse geocoding if geolocation is available
 */
export async function getVisitorLocation(): Promise<LocationData | null> {
  return new Promise((resolve) => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.warn('Geolocation API not available')
      resolve(null)
      return
    }

    // Request user's position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Reverse geocode the coordinates
        const locationData = await reverseGeocode(latitude, longitude)

        if (locationData) {
          resolve(locationData)
        } else {
          // Fallback to Unknown if reverse geocoding fails
          resolve({
            visitor_city: 'Unknown',
            visitor_province: 'Unknown',
            visitor_country: 'Unknown',
            latitude,
            longitude,
          })
        }
      },
      (error) => {
        // Geolocation permission denied or unavailable
        console.warn('Geolocation error:', error.message)

        // Try to get location from IP-based geolocation service as fallback
        getLocationFromIP()
          .then(resolve)
          .catch(() => resolve(null))
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      },
    )
  })
}

/**
 * Fallback: Get location based on IP address using ip-api.com
 * This is less accurate but works without user permission
 */
async function getLocationFromIP(): Promise<LocationData | null> {
  try {
    const response = await fetch(
      'https://ip-api.com/json/?fields=city,regionName,country',
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    return {
      visitor_city: data.city || 'Unknown',
      visitor_province: data.regionName || 'Unknown',
      visitor_country: data.country || 'Unknown',
    }
  } catch (error) {
    console.error('Error getting location from IP:', error)
    return null
  }
}
