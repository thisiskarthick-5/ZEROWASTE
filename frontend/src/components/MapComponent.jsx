import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

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

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
};

function SearchControl({ onLocationSelect }) {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Search for location...',
      classNames: {
        container: 'leaflet-geosearch-donatly',
        button: 'leaflet-geosearch-button',
        form: 'leaflet-geosearch-form',
        input: 'leaflet-geosearch-input',
      }
    });

    map.addControl(searchControl);
    
    map.on('geosearch/showlocation', (result) => {
      if (onLocationSelect) {
        onLocationSelect({
          lat: result.location.y,
          lng: result.location.x,
          label: result.location.label
        });
      }
    });

    return () => map.removeControl(searchControl);
  }, [map, onLocationSelect]);

  return null;
}

function MapEvents({ onMapClick, selectable, onAddressFound }) {
  useMapEvents({
    async click(e) {
      if (selectable && onMapClick) {
        const { lat, lng } = e.latlng;
        onMapClick({ lat, lng });
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await response.json();
          if (data && data.display_name && onAddressFound) {
            onAddressFound(data.display_name);
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
        }
      }
    },
  });
  return null;
}

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
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
  const pos = [center.lat, center.lng];

  return (
    <div className="relative w-full h-full min-h-[400px] border-4 border-white shadow-2xl rounded-[2rem] overflow-hidden group">
      <MapContainer
        center={pos}
        zoom={13}
        scrollWheelZoom={true}
        style={containerStyle}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <ChangeView center={pos} />
        <MapEvents onMapClick={onMapClick} selectable={selectable} onAddressFound={onAddressFound} />
        {showSearch && <SearchControl onLocationSelect={(res) => {
           if (onMapClick) onMapClick({ lat: res.lat, lng: res.lng });
           if (onAddressFound) onAddressFound(res.label);
        }} />}

        {markers.map((marker, index) => (
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
        ))}
      </MapContainer>
      
      {selectable && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white px-6 py-2 rounded-full shadow-2xl border border-primary/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
           <p className="text-xs font-black text-primary-dark">Click map to pin location</p>
        </div>
      )}
    </div>
  );
}
