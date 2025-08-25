"use client"

import { useState } from "react"
import { Camera, User } from "lucide-react"

interface ExecutiveImageProps {
  src: string
  alt: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showBadge?: boolean
}

export function ExecutiveImage({ src, alt, className = "", size = "md", showBadge = true }: ExecutiveImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  }

  const handleImageError = () => {
    console.warn(`❌ Erreur chargement image: ${src}`)
    setImageError(true)
  }

  const handleImageLoad = () => {
    console.log(`✅ Image chargée: ${src}`)
    setImageLoaded(true)
  }

  // Générer initiales pour le fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 3)
  }

  if (imageError || !src) {
    // Fallback avec initiales
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold ${className}`}
      >
        <span className="text-sm">{getInitials(alt)}</span>
        {showBadge && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
            <User className="h-2 w-2 text-white" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full border-3 border-white shadow-lg object-cover transition-all duration-300 hover:scale-105 ${!imageLoaded ? "opacity-0" : "opacity-100"}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
      {showBadge && imageLoaded && !imageError && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <Camera className="h-2 w-2 text-white" />
        </div>
      )}
      {!imageLoaded && !imageError && (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse flex items-center justify-center`}>
          <Camera className="h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>
  )
}
