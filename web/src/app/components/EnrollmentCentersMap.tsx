'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface EnrollmentCenter {
  name: string;
  location: string;
  type: 'US' | 'Canada';
  coordinates: [number, number]; // [lat, lng]
  waitTime: string;
  closestCity: string;
  priority: 'fastest' | 'fast' | 'moderate' | 'high-demand' | 'very-high-demand';
}

const enrollmentCenters: EnrollmentCenter[] = [
  {
    name: 'Calais, Maine',
    location: 'US Port of Entry',
    type: 'US',
    coordinates: [45.1836, -67.2769],
    waitTime: '6-10 weeks',
    closestCity: 'Bangor, ME (1.5 hrs)',
    priority: 'fastest',
  },
  {
    name: 'Sweetgrass, Montana',
    location: 'US Port of Entry',
    type: 'US',
    coordinates: [48.9979, -111.9638],
    waitTime: '8-12 weeks',
    closestCity: 'Great Falls, MT (2 hrs)',
    priority: 'fast',
  },
  {
    name: 'Fort Erie, Ontario',
    location: 'Canadian Port of Entry',
    type: 'Canada',
    coordinates: [42.9109, -78.9315],
    waitTime: '10-14 weeks',
    closestCity: 'Buffalo, NY (30 min)',
    priority: 'fast',
  },
  {
    name: 'Champlain, New York',
    location: 'US Port of Entry',
    type: 'US',
    coordinates: [44.9864, -73.4491],
    waitTime: '12-16 weeks',
    closestCity: 'Burlington, VT (1 hr)',
    priority: 'moderate',
  },
  {
    name: 'Lansdowne, Ontario',
    location: 'Canadian Port of Entry (Thousand Islands)',
    type: 'Canada',
    coordinates: [44.3539, -76.0594],
    waitTime: '14-18 weeks',
    closestCity: 'Syracuse, NY (1.5 hrs)',
    priority: 'moderate',
  },
  {
    name: 'Blaine, Washington',
    location: 'US Port of Entry (Peace Arch)',
    type: 'US',
    coordinates: [48.9979, -122.7471],
    waitTime: '18-24 weeks',
    closestCity: 'Seattle, WA (2 hrs)',
    priority: 'high-demand',
  },
  {
    name: 'Detroit, Michigan',
    location: 'US Port of Entry',
    type: 'US',
    coordinates: [42.3314, -83.0458],
    waitTime: '20-26 weeks',
    closestCity: 'Detroit, MI (in city)',
    priority: 'high-demand',
  },
  {
    name: 'Niagara Falls, New York',
    location: 'US Port of Entry',
    type: 'US',
    coordinates: [43.0945, -79.0377],
    waitTime: '24-30 weeks',
    closestCity: 'Buffalo, NY (20 min)',
    priority: 'very-high-demand',
  },
  {
    name: 'Vancouver Airport (YVR)',
    location: 'Airport Enrollment Center',
    type: 'Canada',
    coordinates: [49.1967, -123.1815],
    waitTime: '16-22 weeks',
    closestCity: 'Vancouver, BC',
    priority: 'high-demand',
  },
  {
    name: 'Calgary Airport (YYC)',
    location: 'Airport Enrollment Center',
    type: 'Canada',
    coordinates: [51.1315, -114.0106],
    waitTime: '14-20 weeks',
    closestCity: 'Calgary, AB',
    priority: 'moderate',
  },
  {
    name: 'Toronto Pearson (YYZ)',
    location: 'Airport Enrollment Center',
    type: 'Canada',
    coordinates: [43.6777, -79.6248],
    waitTime: '20-28 weeks',
    closestCity: 'Toronto, ON',
    priority: 'very-high-demand',
  },
  {
    name: 'Montreal Airport (YUL)',
    location: 'Airport Enrollment Center',
    type: 'Canada',
    coordinates: [45.4706, -73.7408],
    waitTime: '18-24 weeks',
    closestCity: 'Montreal, QC',
    priority: 'high-demand',
  },
  {
    name: 'Winnipeg Airport (YWG)',
    location: 'Airport Enrollment Center',
    type: 'Canada',
    coordinates: [49.9100, -97.2399],
    waitTime: '12-18 weeks',
    closestCity: 'Winnipeg, MB',
    priority: 'moderate',
  },
];

function getPriorityColor(priority: EnrollmentCenter['priority']): string {
  switch (priority) {
    case 'fastest':
      return '#22c55e';
    case 'fast':
      return '#22c55e';
    case 'moderate':
      return '#fbbf24';
    case 'high-demand':
      return '#f97316';
    case 'very-high-demand':
      return '#ef4444';
    default:
      return '#888888';
  }
}

function getPriorityLabel(priority: EnrollmentCenter['priority']): string {
  switch (priority) {
    case 'fastest':
      return 'FASTEST';
    case 'fast':
      return 'FAST';
    case 'moderate':
      return 'MODERATE';
    case 'high-demand':
      return 'HIGH DEMAND';
    case 'very-high-demand':
      return 'VERY HIGH DEMAND';
    default:
      return '';
  }
}

// Custom icon generator
function createCustomIcon(priority: EnrollmentCenter['priority']) {
  const color = getPriorityColor(priority);
  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 26 16 26s16-17.2 16-26C32 7.2 24.8 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
}

// Component to fit bounds
function FitBounds({ centers }: { centers: EnrollmentCenter[] }) {
  const map = useMap();

  useEffect(() => {
    if (centers.length > 0) {
      const bounds = L.latLngBounds(centers.map(c => c.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, centers]);

  return null;
}

export default function EnrollmentCentersMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-[#111] border border-[#222] rounded-lg flex items-center justify-center">
        <p className="text-[#888]">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4 text-[#ededed]">Interactive Map of All 13 NEXUS Enrollment Centers</h3>
        <p className="text-[#888] mb-4">
          Click on any marker to see details about wait times and location. Green markers are fastest, red markers have the longest waits.
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
            <span className="text-sm text-[#888]">Fast (6-14 weeks)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#fbbf24]"></div>
            <span className="text-sm text-[#888]">Moderate (12-18 weeks)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#f97316]"></div>
            <span className="text-sm text-[#888]">High Demand (18-26 weeks)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
            <span className="text-sm text-[#888]">Very High Demand (24-30 weeks)</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[600px] border border-[#222] rounded-lg overflow-hidden">
        <MapContainer
          center={[45.0, -93.0]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          <FitBounds centers={enrollmentCenters} />
          {enrollmentCenters.map((center, index) => (
            <Marker
              key={index}
              position={center.coordinates}
              icon={createCustomIcon(center.priority)}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-base text-[#0a0a0a]">{center.name}</h4>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold ml-2 whitespace-nowrap"
                      style={{
                        backgroundColor: `${getPriorityColor(center.priority)}20`,
                        color: getPriorityColor(center.priority)
                      }}
                    >
                      {getPriorityLabel(center.priority)}
                    </span>
                  </div>
                  <p className="text-sm text-[#555] mb-1">{center.location}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <strong className="text-[#0a0a0a]">Wait Time:</strong> {center.waitTime}
                    </p>
                    <p className="text-sm">
                      <strong className="text-[#0a0a0a]">Closest City:</strong> {center.closestCity}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #0a0a0a;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
        .map-tiles {
          filter: brightness(0.9) invert(1) hue-rotate(180deg);
        }
        .leaflet-popup-content-wrapper {
          background: #ffffff;
          border-radius: 8px;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .leaflet-popup-tip {
          background: #ffffff;
        }
        .custom-popup .leaflet-popup-close-button {
          color: #0a0a0a !important;
          font-size: 20px !important;
          padding: 4px 8px !important;
        }
      `}</style>
    </div>
  );
}
