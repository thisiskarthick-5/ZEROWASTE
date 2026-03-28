import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Search, Navigation, MapPin, Loader2, Check } from 'lucide-react';

// Custom Marker Creator
const createCustomIcon = (color) => {
  const svgTemplate = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 35C20 35 32 24.5 32 16C32 9.37258 26.6274 4 20 4C13.3726 4 8 9.37258 8 16C8 24.5 20 35 20 35Z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="20" cy="16" r="6" fill="white" fill-opacity="0.3"/>
      <circle cx="20" cy="16" r="3" fill="white"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgTemplate,
    className: 'custom-map-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 35],
    popupAnchor: [0, -35]
  });
};

const icons = {
  donor: createCustomIcon('#A3E635'), // Lime
  trust: createCustomIcon('#3B82F6'), // Blue
  volunteer: createCustomIcon('#F97316'), // Orange
};

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 15, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

function LocateMeControl({ onLocationFound }) {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    setLocating(true);
    map.locate({ setView: true, maxZoom: 16 }).on('locationfound', (e) => {
      setLocating(false);
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      onLocationFound(newPos);
    }).on('locationerror', (e) => {
      setLocating(false);
      console.error("Location error:", e);
      alert('Could not access your location. Please check your browser permissions.');
    });
  };

  return (
    <button
      type="button"
      onClick={handleLocate}
      className="absolute bottom-24 right-4 z-[1000] bg-white p-3 rounded-2xl shadow-2xl border border-primary/20 hover:bg-surface transition-colors group"
      title="Use My Location"
    >
      {locating ? (
        <Loader2 className="text-primary animate-spin" size={24} />
      ) : (
        <Navigation className="text-primary group-hover:scale-110 transition-transform" size={24} />
      )}
    </button>
  );
}

export default function MapComponent({ 
  center = { lat: 12.9716, lng: 77.5946 }, 
  markers = [], 
  onMapClick, 
  onAddressFound, 
  selectable = false, 
  showSearch = false,
  type = 'donor'
}) {
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const provider = useMemo(() => new OpenStreetMapProvider(), []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 3) {
      setIsSearching(true);
      const results = await provider.search({ query });
      setSearchResults(results.slice(0, 5));
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (selectable && center) {
      fetchAddress(center.lat, center.lng, false);
    }
  }, []);

  const fetchAddress = async (lat, lng, syncSearch = true) => {
    try {
      if (syncSearch) setIsSearching(true);
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
        if (syncSearch) setSearchQuery(data.display_name);
        if (onAddressFound) onAddressFound(data.display_name);
      } else {
        // Fallback for empty results
        const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setAddress(fallback);
        if (syncSearch) setSearchQuery(fallback);
        if (onAddressFound) onAddressFound(fallback);
      }
      setIsSearching(false);
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result) => {
    const newPos = { lat: result.y, lng: result.x };
    if (onMapClick) onMapClick(newPos);
    if (onAddressFound) onAddressFound(result.label);
    setAddress(result.label);
    setSearchQuery(result.label); // Fill search bar with selected result
    setSearchResults([]);
  };

  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const marker = e.target;
        const position = marker.getLatLng();
        if (onMapClick) onMapClick({ lat: position.lat, lng: position.lng });
        fetchAddress(position.lat, position.lng, true); // Sync search bar on drag
      },
    }),
    [onMapClick],
  );

  const MapEventsHook = () => {
    useMapEvents({
      click(e) {
        if (selectable && onMapClick) {
          onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
          fetchAddress(e.latlng.lat, e.latlng.lng, true); // Sync search bar on click
        }
      },
    });
    return null;
  };

  return (
    <div className="relative w-full h-full min-h-[400px] border-4 border-white shadow-2xl rounded-[3rem] overflow-hidden group">
      {showSearch && (
        <div className="absolute top-4 left-4 right-14 z-[1000] focus-within:right-4 transition-all duration-300">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for your location..."
              className="w-full bg-white/95 backdrop-blur-md border-none pl-12 pr-4 py-4 rounded-[1.5rem] shadow-xl outline-none ring-4 ring-transparent focus:ring-primary/20 font-bold text-sm transition-all"
            />
            {isSearching && (
              <div className="absolute right-4 top-4">
                <Loader2 className="animate-spin text-primary" size={20} />
              </div>
            )}
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 divide-y divide-slate-50">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors flex items-start gap-3 group/item"
                >
                  <MapPin className="text-slate-400 mt-1 flex-shrink-0 group-hover/item:text-primary transition-colors" size={16} />
                  <span className="text-sm font-bold text-slate-600 line-clamp-2">{result.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        className="z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <ChangeView center={center} />
        <MapEventsHook />
        <LocateMeControl onLocationFound={(pos) => {
          if (onMapClick) onMapClick(pos);
          fetchAddress(pos.lat, pos.lng);
        }} />

        {selectable ? (
          <Marker 
            position={[center.lat, center.lng]} 
            icon={icons[type]} 
            draggable={true}
            eventHandlers={eventHandlers}
          >
            <Popup className="donatly-popup">
              <div className="p-2">
                <h4 className="font-black text-primary-dark mb-1">Move me!</h4>
                <p className="text-xs font-bold text-slate-500">Drag to pin exact location</p>
              </div>
            </Popup>
          </Marker>
        ) : (
          markers.map((marker, index) => (
            <Marker 
              key={index} 
              position={[marker.position.lat, marker.position.lng]}
              icon={icons[marker.type || type]}
            >
              {marker.title && (
                <Popup className="donatly-popup">
                  <div className="p-1">
                    <h4 className="font-black text-primary-dark">{marker.title}</h4>
                    {marker.description && <p className="text-xs font-bold text-slate-500 mt-1">{marker.description}</p>}
                  </div>
                </Popup>
              )}
            </Marker>
          ))
        )}
      </MapContainer>
      
      {address && selectable && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-l-4 border-primary pointer-events-auto flex items-center justify-between gap-4">
             <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Selected Location</p>
                <p className="text-xs font-bold text-slate-600 truncate">{address}</p>
             </div>
             <div className="bg-primary/20 p-2 rounded-xl text-primary">
                <Check size={18} strokeWidth={3} />
             </div>
          </div>
        </div>
      )}

      {selectable && !address && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white px-6 py-2 rounded-full shadow-2xl border border-primary/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
           <p className="text-xs font-black text-primary-dark">Click or drag marker to set location</p>
        </div>
      )}
    </div>
  );
}
