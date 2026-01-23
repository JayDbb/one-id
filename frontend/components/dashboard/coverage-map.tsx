"use client"

import React from "react"
import mapboxgl from "mapbox-gl"
import { useState, useEffect, useRef } from "react"
import { Layers, Users, Building2, AlertTriangle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface MapLayer {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  active: boolean
}

const JAMAICA_CENTER = { lng: -77.297508, lat: 18.109581 }
const JAMAICA_ZOOM = 8.5

// Parish data for Jamaica with mock statistics
const parishData = [
  { name: "Kingston", beneficiaries: 45200, coverage: 78, risk: "low", coords: [-76.7936, 17.9714] },
  { name: "St. Andrew", beneficiaries: 89500, coverage: 72, risk: "medium", coords: [-76.7489, 18.0179] },
  { name: "St. Catherine", beneficiaries: 67800, coverage: 65, risk: "medium", coords: [-77.0055, 18.0335] },
  { name: "Clarendon", beneficiaries: 34200, coverage: 81, risk: "low", coords: [-77.2389, 17.9578] },
  { name: "Manchester", beneficiaries: 28900, coverage: 85, risk: "low", coords: [-77.5083, 18.0419] },
  { name: "St. Elizabeth", beneficiaries: 22100, coverage: 79, risk: "low", coords: [-77.7333, 18.0333] },
  { name: "Westmoreland", beneficiaries: 19800, coverage: 71, risk: "medium", coords: [-78.1333, 18.2667] },
  { name: "Hanover", beneficiaries: 12400, coverage: 68, risk: "medium", coords: [-78.1333, 18.4167] },
  { name: "St. James", beneficiaries: 31200, coverage: 62, risk: "high", coords: [-77.9167, 18.4667] },
  { name: "Trelawny", beneficiaries: 15600, coverage: 74, risk: "medium", coords: [-77.65, 18.35] },
  { name: "St. Ann", beneficiaries: 26700, coverage: 69, risk: "medium", coords: [-77.2, 18.4333] },
  { name: "St. Mary", beneficiaries: 18900, coverage: 76, risk: "low", coords: [-76.9, 18.3667] },
  { name: "Portland", beneficiaries: 14200, coverage: 82, risk: "low", coords: [-76.45, 18.1833] },
  { name: "St. Thomas", beneficiaries: 16800, coverage: 77, risk: "low", coords: [-76.2, 17.9833] },
]

export function CoverageMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedParish, setSelectedParish] = useState<typeof parishData[0] | null>(null)
  
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: "beneficiaries", name: "Beneficiaries", icon: <Users className="size-4" />, color: "bg-amber-500", active: true },
    { id: "programs", name: "Programs", icon: <Building2 className="size-4" />, color: "bg-emerald-500", active: false },
    { id: "risk", name: "Risk Areas", icon: <AlertTriangle className="size-4" />, color: "bg-red-500", active: false },
    { id: "coverage", name: "Coverage", icon: <TrendingUp className="size-4" />, color: "bg-blue-500", active: false },
  ])

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, active: !layer.active } : layer
    ))
  }

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const initMap = async () => {
      try {
        await import("mapbox-gl/dist/mapbox-gl.css")
        
        // Check for API key
        const apiKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        if (!apiKey) {
          setMapError("Mapbox API key not configured")
          return
        }

        mapboxgl.accessToken = apiKey

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [JAMAICA_CENTER.lng, JAMAICA_CENTER.lat],
          zoom: JAMAICA_ZOOM,
          pitch: 0,
          bearing: 0,
        })

        map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right")

        map.current.on("load", () => {
          setMapLoaded(true)
          
          // Add markers for each parish
          parishData.forEach(parish => {
            const el = document.createElement("div")
            el.className = "parish-marker"
            el.innerHTML = `
              <div class="flex items-center justify-center size-10 rounded-full bg-amber-500 text-white text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform">
                ${Math.round(parish.beneficiaries / 1000)}k
              </div>
            `
            
            el.addEventListener("click", () => {
              setSelectedParish(parish)
            })

            new mapboxgl.Marker(el)
              .setLngLat(parish.coords as [number, number])
              .addTo(map.current!)
          })
        })

        map.current.on("error", (e) => {
          console.error("Mapbox error:", e)
          setMapError("Failed to load map")
        })

      } catch (error) {
        console.error("Failed to initialize map:", error)
        setMapError("Failed to initialize map")
      }
    }

    initMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  return (
    <div className="relative h-full w-full bg-slate-900 rounded-xl overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Fallback when no API key */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="text-center p-8">
            <div className="w-full h-[300px] bg-slate-800 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              {/* Static Jamaica outline */}
              <svg viewBox="0 0 400 200" className="w-full h-full opacity-30">
                <path
                  d="M50,100 Q100,50 150,60 Q200,40 250,55 Q300,45 350,80 Q370,100 350,130 Q300,160 250,155 Q200,170 150,150 Q100,160 50,130 Q30,115 50,100"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
              </svg>
              {/* Animated dots representing parishes */}
              {parishData.slice(0, 8).map((parish, i) => (
                <div
                  key={parish.name}
                  className="absolute size-3 bg-amber-500 rounded-full animate-pulse"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
            <p className="text-slate-400 text-sm mb-2">Interactive map unavailable</p>
            <p className="text-slate-500 text-xs">Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to enable</p>
          </div>
        </div>
      )}

      {/* Layer Toggle Panel */}
      <div className="absolute top-4 left-4 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700 p-3 z-10">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
          <Layers className="size-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Layers</span>
        </div>
        <div className="space-y-2">
          {layers.map(layer => (
            <button
              key={layer.id}
              type="button"
              onClick={() => toggleLayer(layer.id)}
              className={cn(
                "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors",
                layer.active 
                  ? "bg-slate-700 text-white" 
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
              )}
            >
              <span className={cn("size-2 rounded-full", layer.color, !layer.active && "opacity-40")} />
              {layer.icon}
              <span>{layer.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Parish Info Panel */}
      {selectedParish && (
        <div className="absolute top-4 right-4 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700 p-4 z-10 w-64">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">{selectedParish.name}</h3>
            <button 
              type="button"
              onClick={() => setSelectedParish(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Beneficiaries</span>
              <span className="text-sm font-bold text-amber-400">{selectedParish.beneficiaries.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Coverage Rate</span>
              <span className="text-sm font-bold text-emerald-400">{selectedParish.coverage}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Risk Level</span>
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full uppercase",
                selectedParish.risk === "low" && "bg-emerald-500/20 text-emerald-400",
                selectedParish.risk === "medium" && "bg-amber-500/20 text-amber-400",
                selectedParish.risk === "high" && "bg-red-500/20 text-red-400",
              )}>
                {selectedParish.risk}
              </span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                style={{ width: `${selectedParish.coverage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700 px-3 py-2 z-10">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-amber-500" />
            <span className="text-slate-300">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-amber-500/60" />
            <span className="text-slate-300">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-amber-500/30" />
            <span className="text-slate-300">Low</span>
          </div>
        </div>
      </div>
    </div>
  )
}
