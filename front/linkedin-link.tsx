"use client"

import type React from "react"

import { ExternalLink, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LinkedInLinkProps {
  url: string
  text?: string
  className?: string
  showIcon?: boolean
  showExternalIcon?: boolean
}

export function LinkedInLink({
  url,
  text = "LinkedIn",
  className = "",
  showIcon = true,
  showExternalIcon = true,
}: LinkedInLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Validation de l'URL LinkedIn
    if (!url || !url.includes("linkedin.com")) {
      console.warn("URL LinkedIn invalide:", url)
      return
    }

    console.log(`🔗 Ouverture du profil LinkedIn: ${url}`)

    // Ouvrir dans un nouvel onglet avec sécurité
    const newWindow = window.open(url, "_blank", "noopener,noreferrer")

    if (!newWindow) {
      console.warn("Popup bloqué, tentative de redirection directe")
      window.location.href = url
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && <Linkedin className="h-4 w-4 text-blue-600" />}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="text-blue-600 hover:underline cursor-pointer font-medium"
      >
        {text}
      </a>
      {showExternalIcon && (
        <Button size="sm" variant="ghost" className="h-6 px-2" onClick={handleClick}>
          <ExternalLink className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
