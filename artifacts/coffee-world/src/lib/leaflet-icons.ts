import L from 'leaflet';

// Fix default icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export const createFarmIcon = (opacity: number = 1) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="opacity: ${opacity}; transition: opacity 0.3s ease;">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#C8A96E" stroke="#1E1E1E" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 shadow-sm drop-shadow-md">
      <path d="M17 8c0 4.5-4 9-9 9a9 9 0 0 1-5-5c0-4.5 4-9 9-9a9 9 0 0 1 5 5z"/>
      <path d="M12 4s-1.5 5 2 9c3 3.5 5 4 5 4"/>
    </svg>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export const createRoasterIcon = (opacity: number = 1) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="opacity: ${opacity}; transition: opacity 0.3s ease; background-color: #00704A; border: 2px solid #1E1E1E; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.5);">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});
