'use client';

import React, { useEffect, useRef, useState } from 'react';

// We assume a fetch endpoint for users (technicians) is available at /api/technicians
// Each technician: { _id, name, role, location: "lat,lng", isActive }

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

type Technician = {
  _id: string;
  name: string;
  location?: string;
  isActive: boolean;
};

const loadGoogleMaps = async () => {
  const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");
  setOptions({
    key: GOOGLE_MAPS_API_KEY ?? "",
    v: "weekly",
  });
  await importLibrary("maps");
};

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapsReady, setMapsReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.google?.maps)
  );
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);

  // Fetch technicians
  useEffect(() => {
    const fetchTechnicians = async () => {
      setLoading(true);
      const res = await fetch('/api/technicians');
      const data = await res.json();
      setTechnicians(data);
      setLoading(false);
    };
    fetchTechnicians();
  }, []);

  // Initialize map and markers
  useEffect(() => {
    let markers: google.maps.Marker[] = [];
    if (!mapsReady || !window.google?.maps || !mapRef.current) return;

    // Default center
    const firstTechLoc = technicians?.[0]?.location
      ? technicians[0].location.split(',').map(Number)
      : [37.7749, -122.4194]; // fallback to San Francisco

    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: firstTechLoc[0], lng: firstTechLoc[1] },
        zoom: 11,
      });
    }

    // Clear old markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    // Add new markers
    technicians.forEach((tech) => {
      if (!tech.location) return;
      const [lat, lng] = tech.location.split(',').map(Number);
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current!,
        label: {
          text: tech.name.charAt(0),
          fontWeight: "bold",
          color: "#fff",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: tech.isActive ? "#16a34a" : "#fbbf24",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#374151",
        },
        title: tech.name,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div>
            <strong>${tech.name}</strong><br/>
            Status: <span style="color:${tech.isActive ? '#16a34a' : '#fbbf24'};">
              ${tech.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current!, marker);
        setSelectedTechId(tech._id);
      });

      if (tech._id === selectedTechId) {
        infoWindow.open(mapInstance.current!, marker);
        mapInstance.current!.panTo({ lat, lng });
      }

      markers.push(marker);
    });

    // Clean up on unmount
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [technicians, selectedTechId, mapsReady]);

  // Load Google Maps JS API
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || mapsReady) return;

    loadGoogleMaps()
      .then(() => setMapsReady(true))
      .catch(() => undefined);
  }, [mapsReady]);

  // When user selects a tech in sidebar, pan map and open marker window
  const handleSidebarClick = (tech: Technician) => {
    setSelectedTechId(tech._id);
    if (!mapInstance.current || !tech.location) return;
    const [lat, lng] = tech.location.split(',').map(Number);
    mapInstance.current.panTo({ lat, lng });
    mapInstance.current.setZoom(13);
  };

  return (
    <div className="flex h-full min-h-[calc(100dvh-0px)] w-full">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl p-4 overflow-y-auto border-r">
        <h2 className="text-xl font-semibold mb-4">Technicians</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {technicians.map((tech) => (
              <li
                key={tech._id}
                className={`flex items-center cursor-pointer px-3 py-2 mb-1 rounded
                  ${selectedTechId === tech._id ? "bg-indigo-100" : "hover:bg-gray-100"}
                `}
                onClick={() => handleSidebarClick(tech)}
              >
                <span
                  className={`inline-block w-2 h-2 mr-2 rounded-full ${
                    tech.isActive ? "bg-green-500" : "bg-yellow-400"
                  }`}
                />
                <span className="font-medium">{tech.name}</span>
                <span className="ml-auto text-xs text-gray-600">
                  {tech.isActive ? "Active" : "Inactive"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </aside>
      {/* Map */}
      <main className="flex-1 h-full relative">
        {!GOOGLE_MAPS_API_KEY ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the live map.
          </div>
        ) : (
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        )}
      </main>
    </div>
  );
};

export default MapPage;