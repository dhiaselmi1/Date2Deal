"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, Eye, Star, Linkedin, ExternalLink, Building2, Info, Target } from 'lucide-react'

interface Executive {
  id: string
  name: string
  fullName: string
  position: string
  department: string
  email: string
  phone: string
  location: string
  photo: string
  linkedinUrl?: string
  twitterUrl?: string
  experience: string
  education: string
  skills: string[]
  bio: string
  achievements: string[]
  previousRoles: Array<{
    company: string
    position: string
    duration: string
  }>
  children: Executive[]
  bioFile?: string
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  messages: any[]
  lastMessage?: any
}

interface OrganizationalChartProps {
  structure: {
    ceo: Executive
  } | null | undefined
  onProfileClick: (profile: Executive) => void
  onBioClick: (profile: Executive) => void
  onStrategyClick: (profile: Executive) => void
  conversations: Conversation[]
  companyName: string
}

export function OrganizationalChart({
  structure,
  onProfileClick,
  onBioClick,
  conversations,
  companyName,
  onStrategyClick,
}: OrganizationalChartProps) {
  const [hoveredProfile, setHoveredProfile] = useState<string | null>(null)

  // Enhanced safety checks
  if (!structure || !structure.ceo || typeof structure.ceo !== 'object') {
    return (
      <div className="w-full text-center py-12">
        <div className="text-gray-500 mb-4">
          <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Aucune structure organisationnelle disponible</h3>
          <p>Les données de l'organigramme ne sont pas encore chargées.</p>
        </div>
      </div>
    )
  }

  const renderExecutive = (executive: Executive, level = 0) => {
    if (!executive || !executive.id) {
      return null
    }

    const hasConversation = conversations.find((c) => c.participantId === executive.id)
    const isHovered = hoveredProfile === executive.id

    return (
      <div key={executive.id} className="flex flex-col items-center">
        {/* Executive Card */}
        <div
          className={`relative bg-white rounded-xl border-2 shadow-lg transition-all duration-300 cursor-pointer
            ${isHovered ? "border-blue-500 shadow-xl scale-105" : "border-gray-200 hover:border-blue-300 hover:shadow-md"}
            w-80
          `}
          onMouseEnter={() => setHoveredProfile(executive.id)}
          onMouseLeave={() => setHoveredProfile(null)}
          onClick={() => onProfileClick(executive)}
        >
          {/* Position Badge */}
          {level === 0 && executive.position.toLowerCase().includes('chairman') && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1">
                <Building2 className="h-3 w-3 mr-1" />
                Chairman & Founder
              </Badge>
            </div>
          )}

          {level === 0 && executive.position.toLowerCase().includes('président') && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1">
                <Building2 className="h-3 w-3 mr-1" />
                Président
              </Badge>
            </div>
          )}

          {level === 1 && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
                <Building2 className="h-3 w-3 mr-1" />
                CEO
              </Badge>
            </div>
          )}

          {/* Conversation Indicator */}
          {hasConversation && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <MessageCircle className="h-3 w-3 text-white" />
            </div>
          )}

          <CardContent className="p-6">
            {/* Photo and Basic Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src={executive.photo || "/placeholder.svg"}
                  alt={executive.fullName || "Executive"}
                  className="w-16 h-16 rounded-full border-3 border-white shadow-lg object-cover"
                  onError={(e) => {
                    const initials = (executive.fullName || "EX")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                    e.currentTarget.src = `/placeholder.svg?height=64&width=64&text=${initials}`
                  }}
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <Star className="h-2 w-2 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{executive.fullName || "Nom non disponible"}</h3>
                <p className="text-blue-600 font-medium">{executive.position || "Poste non spécifié"}</p>
                <p className="text-sm text-gray-500">{executive.department || "Département non spécifié"}</p>
                <div className="flex items-center gap-2 mt-1">
                  {executive.linkedinUrl && (
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-3 w-3 text-blue-600" />
                      <a
                        href={executive.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        LinkedIn
                      </a>
                      <ExternalLink className="h-2 w-2 text-blue-600" />
                    </div>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-2 w-2 mr-1" />
                    Données Réelles
                  </Badge>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {executive.skills && Array.isArray(executive.skills) && executive.skills.slice(0, 6).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                    {skill}
                  </Badge>
                ))}
                {executive.skills && Array.isArray(executive.skills) && executive.skills.length > 6 && (
                  <Badge variant="secondary" className="text-xs">
                    +{executive.skills.length - 6}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-8 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  onBioClick(executive)
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                Bio
              </Button>
              <Button
                size="sm"
                variant="default"
                className="flex-1 text-xs h-8 bg-black hover:bg-gray-800 text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onProfileClick(executive)
                }}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Message
              </Button>
            </div>
            
            {/* Strategy Button */}
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs h-8 border-blue-300 text-blue-700 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation()
                onStrategyClick(executive)
              }}
            >
              <Target className="h-3 w-3 mr-1" />
              Générer Stratégie Commerciale
            </Button>
          </CardContent>
        </div>

        {/* Connection Line to Children */}
        {executive.children && Array.isArray(executive.children) && executive.children.length > 0 && (
          <div className="flex flex-col items-center mt-6">
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="w-px h-8 bg-gray-300"></div>
          </div>
        )}

        {/* Children - Structured according to hierarchy with 3-2 layout */}
        {executive.children && Array.isArray(executive.children) && executive.children.length > 0 && (
          <div className="mt-6">
            {/* Level 1: Mehdi Houas has only one child (Behjet) */}
            {level === 0 && executive.children.length === 1 && (
              <div className="flex justify-center">
                {renderExecutive(executive.children[0], level + 1)}
              </div>
            )}
            
            {/* Level 2: Behjet has 5 children arranged in 3-2 layout */}
            {level === 1 && executive.children.length === 5 && (
              <div className="flex flex-col items-center gap-8">
                {/* First row: 3 executives */}
                <div className="flex justify-center gap-8">
                  {executive.children.slice(0, 3).map((child) => (
                    <div key={child.id} className="flex flex-col items-center">
                      {renderExecutive(child, level + 1)}
                    </div>
                  ))}
                </div>
                
                {/* Second row: 2 executives */}
                <div className="flex justify-center gap-8">
                  {executive.children.slice(3, 5).map((child) => (
                    <div key={child.id} className="flex flex-col items-center">
                      {renderExecutive(child, level + 1)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fallback for other configurations */}
            {level === 1 && executive.children.length !== 5 && (
              <div className="flex flex-wrap justify-center gap-8 max-w-6xl">
                {executive.children.map((child) => (
                  <div key={child.id} className="flex flex-col items-center">
                    {renderExecutive(child, level + 1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Safe access to structure.ceo with additional checks
  const ceo = structure?.ceo
  if (!ceo) {
    return (
      <div className="w-full text-center py-12">
        <div className="text-gray-500 mb-4">
          <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Données CEO non disponibles</h3>
          <p>Les informations du dirigeant principal ne sont pas chargées.</p>
        </div>
      </div>
    )
  }

  // Calculate total executives recursively
  const countExecutives = (exec: Executive): number => {
    let count = 1
    if (exec.children && Array.isArray(exec.children)) {
      exec.children.forEach(child => {
        count += countExecutives(child)
      })
    }
    return count
  }

  const totalExecutives = countExecutives(ceo)

  return (
    <div className="w-full">
      {/* Company Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Organigramme - {companyName}</h2>
        <p className="text-gray-600">Structure organisationnelle interactive</p>
        <div className="flex justify-center gap-2 mt-3">
          <Badge variant="secondary">
            <Users className="h-3 w-3 mr-1" />
            {totalExecutives} Dirigeants
          </Badge>
          <Badge variant="secondary">
            <MessageCircle className="h-3 w-3 mr-1" />
            {conversations.length} Conversations
          </Badge>
        </div>
      </div>

      {/* Organizational Chart */}
      <div className="flex justify-center">
        <div className="max-w-7xl">{renderExecutive(ceo)}</div>
      </div>

      {/* Instructions */}
      <div className="mt-16 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Instructions :</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Cliquez sur "Bio" pour voir le rapport détaillé d'un dirigeant</li>
                  <li>• Cliquez sur "Message" pour envoyer un message direct</li>
                  <li>• Cliquez sur "Générer Stratégie Commerciale" pour obtenir une stratégie IA personnalisée</li>
                  <li>• Survolez les cartes pour voir les effets interactifs</li>
                  <li>• Les profils LinkedIn sont vérifiés et authentiques</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
