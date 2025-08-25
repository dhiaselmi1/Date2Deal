"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { User, MapPin, Mail, Phone, Linkedin, ExternalLink, FileText, Briefcase, GraduationCap, Target, Award, Heart, Download, X, Calendar, Clock } from 'lucide-react'

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

interface BioViewerProps {
  isOpen: boolean
  onClose: () => void
  executive: Executive
  onScheduleReminder?: (executive: Executive) => void
}

export function BioViewer({ isOpen, onClose, executive, onScheduleReminder }: BioViewerProps) {
  const [activeSection, setActiveSection] = useState("resume")

  // Données biographiques détaillées
  const getBioData = (executiveId: string) => {
    const bioData: Record<string, any> = {
      "mehdi-houas": {
        resume: "Mehdi Houas est le Chairman & Founder de Talan, un groupe international de conseil en transformation digitale. Avec plus de 20 ans d'expérience dans le secteur technologique, il a bâti Talan comme un acteur majeur de la transformation numérique en Europe et au-delà.",
        roleActuel: {
          titre: "Chairman & Founder - Talan Group",
          description: "Direction stratégique et développement international du groupe Talan",
          responsabilites: [
            "Vision stratégique et développement international",
            "Leadership des équipes dirigeantes",
            "Relations investisseurs et partenaires stratégiques",
            "Innovation et transformation digitale"
          ],
          depuis: "2002"
        },
        parcours: [
          {
            periode: "2002 - Présent",
            poste: "Chairman & Founder",
            entreprise: "Talan Group",
            description: "Création et développement d'un groupe international de conseil en transformation digitale"
          },
          {
            periode: "1998 - 2002",
            poste: "Senior Consultant",
            entreprise: "Cap Gemini",
            description: "Conseil en systèmes d'information et transformation digitale"
          },
          {
            periode: "1995 - 1998",
            poste: "Ingénieur Développement",
            entreprise: "Société Générale",
            description: "Développement de solutions bancaires et financières"
          }
        ],
        formation: [
          {
            diplome: "Ingénieur en Informatique",
            ecole: "École Nationale d'Ingénieurs de Tunis (ENIT)",
            annee: "1995",
            mention: "Très Bien"
          },
          {
            diplome: "Executive MBA",
            ecole: "HEC Paris",
            annee: "2005",
            mention: "Distinction"
          }
        ],
        competences: [
          "Leadership Stratégique",
          "Transformation Digitale",
          "Développement International",
          "Innovation Technologique",
          "Management d'Équipes",
          "Relations Investisseurs",
          "Stratégie d'Entreprise",
          "Fusion-Acquisition"
        ],
        projets: [
          {
            titre: "Fondation et développement du groupe Talan",
            description: "Création et expansion internationale d'un groupe leader en transformation digitale",
            impact: "Groupe international avec présence dans plusieurs pays",
            statut: "Depuis la création",
            badge: "Fondateur"
          },
          {
            titre: "Expansion européenne de Talan",
            description: "Développement de la présence de Talan en Europe via acquisitions et croissance organique",
            impact: "Présence établie dans 5 pays européens",
            statut: "En cours",
            badge: "International"
          },
          {
            titre: "Initiative Innovation Lab",
            description: "Création de laboratoires d'innovation pour développer les technologies émergentes",
            impact: "Positionnement leader sur l'IA et la blockchain",
            statut: "Actif",
            badge: "Innovation"
          },
          {
            titre: "Programme de transformation RSE",
            description: "Mise en place d'une stratégie RSE ambitieuse pour le groupe",
            impact: "Certification B-Corp et réduction empreinte carbone",
            statut: "En cours",
            badge: "RSE"
          }
        ],
        personnalite: {
          traits: ["Visionnaire", "Entrepreneur", "Leader", "Innovateur"],
          valeurs: ["Excellence", "Innovation", "Intégrité", "Collaboration"],
          style: "Leadership transformationnel avec focus sur l'innovation et le développement humain"
        }
      },
      "imen-ayari": {
        resume: "Imen Ayari est Head of Innovation Factory chez Talan, spécialisée dans l'innovation technologique et la R&D. Elle dirige les initiatives d'innovation du groupe et supervise le développement de nouvelles solutions technologiques.",
        roleActuel: {
          titre: "Head of Innovation Factory - Talan",
          description: "Direction de l'innovation et de la recherche & développement",
          responsabilites: [
            "Stratégie d'innovation technologique",
            "Management des équipes R&D",
            "Développement de nouveaux produits",
            "Partenariats technologiques stratégiques"
          ],
          depuis: "2018"
        },
        parcours: [
          {
            periode: "2018 - Présent",
            poste: "Head of Innovation Factory",
            entreprise: "Talan",
            description: "Direction de l'innovation et développement de nouvelles solutions technologiques"
          },
          {
            periode: "2015 - 2018",
            poste: "Senior Innovation Manager",
            entreprise: "Orange Labs",
            description: "Gestion de projets d'innovation dans les télécommunications"
          },
          {
            periode: "2012 - 2015",
            poste: "Research Engineer",
            entreprise: "Alcatel-Lucent",
            description: "Recherche et développement en technologies réseau"
          }
        ],
        formation: [
          {
            diplome: "Doctorat en Informatique",
            ecole: "Université Paris-Saclay",
            annee: "2012",
            mention: "Très Honorable"
          },
          {
            diplome: "Ingénieur Télécommunications",
            ecole: "Sup'Com Tunis",
            annee: "2008",
            mention: "Major de promotion"
          }
        ],
        competences: [
          "Intelligence Artificielle",
          "Machine Learning",
          "Innovation Management",
          "R&D Strategy",
          "Design Thinking",
          "Federated Learning",
          "Data Science",
          "Product Development"
        ],
        projets: [
          {
            titre: "Développement de l'Innovation Factory de Talan",
            description: "Création et structuration du laboratoire d'innovation du groupe",
            impact: "Hub d'innovation reconnu dans l'écosystème tech français",
            statut: "Actif",
            badge: "Innovation"
          },
          {
            titre: "Lancement de projets d'IA avancée",
            description: "Développement de solutions d'intelligence artificielle pour les clients",
            impact: "Portfolio de 15+ solutions IA déployées",
            statut: "En cours",
            badge: "IA"
          },
          {
            titre: "Création de partenariats technologiques stratégiques",
            description: "Établissement de collaborations avec des universités et startups",
            impact: "Réseau de 20+ partenaires technologiques",
            statut: "Actif",
            badge: "Partenariats"
          },
          {
            titre: "Publication de recherches en IA",
            description: "Contribution à la recherche académique et industrielle",
            impact: "10+ publications dans des conférences internationales",
            statut: "Continu",
            badge: "Recherche"
          },
          {
            titre: "Programme de formation interne",
            description: "Développement des compétences IA des équipes Talan",
            impact: "200+ collaborateurs formés aux technologies IA",
            statut: "En cours",
            badge: "Formation"
          }
        ],
        personnalite: {
          traits: ["Innovatrice", "Analytique", "Collaborative", "Passionnée"],
          valeurs: ["Innovation", "Excellence Technique", "Partage de Connaissances", "Impact"],
          style: "Leadership technique avec approche collaborative et focus sur l'innovation"
        }
      }
    }

    return bioData[executiveId] || bioData["mehdi-houas"]
  }

  const data = getBioData(executive.id)

  const menuItems = [
    { id: "resume", label: "Résumé", icon: FileText },
    { id: "role", label: "Rôle Actuel", icon: User },
    { id: "parcours", label: "Parcours", icon: Briefcase },
    { id: "formation", label: "Formation", icon: GraduationCap },
    { id: "competences", label: "Compétences", icon: Target },
    { id: "projets", label: "Projets", icon: Award },
    { id: "personnalite", label: "Personnalité", icon: Heart }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "resume":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Résumé Professionnel
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">{data.resume}</p>
            </div>
          </div>
        )

      case "role":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                {data.roleActuel.titre}
              </h3>
              <p className="text-gray-700 mb-4 text-lg">{data.roleActuel.description}</p>
              <div className="mb-4">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Depuis {data.roleActuel.depuis}
                </Badge>
              </div>
              <h4 className="font-semibold text-gray-800 mb-3">Responsabilités principales :</h4>
              <ul className="space-y-2">
                {data.roleActuel.responsabilites.map((resp: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )

      case "parcours":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Parcours Professionnel
            </h3>
            <div className="space-y-4">
              {data.parcours.map((exp: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-gray-900">{exp.poste}</h4>
                      <Badge variant="outline" className="text-blue-700 border-blue-300">
                        {exp.periode}
                      </Badge>
                    </div>
                    <p className="text-blue-600 font-medium mb-3">{exp.entreprise}</p>
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "formation":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              Formation Académique
            </h3>
            <div className="space-y-4">
              {data.formation.map((form: any, index: number) => (
                <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-purple-900">{form.diplome}</h4>
                    <Badge variant="outline" className="text-purple-700 border-purple-300">
                      {form.annee}
                    </Badge>
                  </div>
                  <p className="text-purple-700 font-medium mb-2">{form.ecole}</p>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                    {form.mention}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )

      case "competences":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Compétences Clés
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {data.competences.map((comp: string, index: number) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <span className="text-orange-800 font-medium">{comp}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case "projets":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" />
              Projets & Réalisations
            </h3>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {data.projets.map((projet: any, index: number) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900 flex-1">{projet.titre}</h4>
                      <Badge className="ml-3 bg-indigo-100 text-indigo-800 border-indigo-300">
                        {projet.badge}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">{projet.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-600">Impact:</span>
                      <span className="text-sm text-green-700 bg-green-50 px-2 py-1 rounded">
                        {projet.impact}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-gray-600 border-gray-300">
                        {projet.statut}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )

      case "personnalite":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600" />
              Profil de Personnalité
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-pink-900 mb-4">Traits de Personnalité</h4>
                <div className="flex flex-wrap gap-2">
                  {data.personnalite.traits.map((trait: string, index: number) => (
                    <Badge key={index} className="bg-pink-100 text-pink-800 border-pink-300">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-blue-900 mb-4">Valeurs Fondamentales</h4>
                <div className="flex flex-wrap gap-2">
                  {data.personnalite.valeurs.map((valeur: string, index: number) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-300">
                      {valeur}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Style de Leadership</h4>
              <p className="text-gray-700 leading-relaxed">{data.personnalite.style}</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* Profile Header */}
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img
                    src={executive.photo || "/placeholder.svg"}
                    alt={executive.fullName}
                    className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
                    onError={(e) => {
                      const initials = executive.fullName.split(" ").map((n) => n[0]).join("")
                      e.currentTarget.src = `/placeholder.svg?height=64&width=64&text=${initials}`
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{executive.fullName}</h2>
                  <p className="text-blue-600 font-medium">{executive.position}</p>
                  <p className="text-sm text-gray-500">{executive.location}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Badge className="bg-green-100 text-green-800 border-green-300 w-full justify-center">
                  <FileText className="h-3 w-3 mr-1" />
                  Rapport Biographique Complet
                </Badge>
                <Badge variant="outline" className="text-blue-700 border-blue-300 w-full justify-center">
                  <Award className="h-3 w-3 mr-1" />
                  Données Vérifiées
                </Badge>
              </div>
            </div>

            {/* Navigation Menu */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <DialogHeader className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {menuItems.find(item => item.id === activeSection)?.label}
                  </DialogTitle>
                  <p className="text-gray-600 mt-1">Profil détaillé de {executive.fullName}</p>
                </div>
                <div className="flex items-center gap-3">
                  {onScheduleReminder && (
                    <Button
                      onClick={() => onScheduleReminder(executive)}
                      variant="outline"
                      className="text-purple-700 border-purple-300 hover:bg-purple-50"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Planifier Communication
                    </Button>
                  )}
                  <Button variant="outline" className="text-gray-700 border-gray-300">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Content */}
            <ScrollArea className="flex-1 p-6">
              {renderContent()}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
