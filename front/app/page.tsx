"use client"

import { useState, useEffect } from "react"
import { Search, Building2, MapPin, Users, TrendingUp, DollarSign, Calendar, Mail, Phone, Send, MessageCircle, LogOut, User, Smile, Frown, Meh, ThumbsUp, AlertCircle, Loader2, Globe, Linkedin, ExternalLink, Star, Award, Camera, FileText, Eye, MapIcon as Sitemap, Upload, Bot, Sparkles, Target, UserCheck, Zap, ChevronDown, Filter, X, Briefcase, GraduationCap, Brain, BarChart3 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BioViewer } from "../bio-viewer"
import { OrganizationalChart } from "../organizational-chart"
import { EnhancedCompanyDataService } from "../enhanced-company-data-service"
import { AIChatPage } from "../ai-chat-page"
import { Dashboard } from "../dashboard"

// Interfaces
interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  sentiment?: {
    type: "positive" | "negative" | "neutral"
    score: number
    keywords: string[]
  }
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  messages: Message[]
  lastMessage?: Message
}

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

interface CompanyData {
  name: string
  region: string
  founded: number
  employees: number
  revenue: string
  industry: string
  website?: string
  description?: string
  headquarters: string
  structure: {
    ceo: Executive
  }
}

interface Client {
  id: string
  name: string
  industry: string
  location: string
  logo?: string
  executives: Executive[]
  lastContact?: Date
  nextReminder?: Date
  status: "active" | "prospect" | "inactive"
}

interface Reminder {
  id: string
  clientId: string
  executiveId: string
  clientName: string
  executiveName: string
  executivePhoto: string
  message: string
  scheduledDate: Date
  scheduledTime: string
  status: "pending" | "sent" | "overdue"
  type: "follow-up" | "meeting" | "proposal" | "check-in"
}

// Données pour l'auto-complétion des régions
const regions = [
  "France", "Tunisie", "Turquie", "Allemagne", "Espagne", "Italie", "Maroc", "Algérie", "Égypte",
  "Émirats Arabes Unis", "Arabie Saoudite", "Canada", "États-Unis", "Brésil", "Argentine", "Chili",
  "Japon", "Chine", "Inde", "Singapour", "Australie", "Royaume-Uni", "Suisse"
]

// Composant de Login
function LoginForm({ onLogin }: { onLogin: (user: any) => void }) {
  const [companyName, setCompanyName] = useState("")
  const [sector, setSector] = useState("")
  const [website, setWebsite] = useState("")
  const [linkedinPage, setLinkedinPage] = useState("")
  const [crmApi, setCrmApi] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleLogin = async () => {
    if (!companyName || !sector || !website) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const user = {
      id: `user-${Date.now()}`,
      companyName,
      sector,
      website,
      linkedinPage,
      crmApi,
      file: file?.name || null,
    }

    onLogin(user)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Company Signup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Company Name <span className="text-red-500">*</span>
            </label>
            <Input 
              placeholder="Enter your company name" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector of Activity <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., Technology, Healthcare, Finance"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Official Website Link <span className="text-red-500">*</span>
            </label>
            <Input
              type="url"
              placeholder="https://www.yourcompany.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Page
            </label>
            <Input
              placeholder="https://linkedin.com/company/yourcompany"
              value={linkedinPage}
              onChange={(e) => setLinkedinPage(e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CRM API
            </label>
            <Input
              placeholder="Your CRM API endpoint"
              value={crmApi}
              onChange={(e) => setCrmApi(e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products/Services File (CSV, Excel, or PDF)
            </label>
            <div className="relative">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls,.pdf"
                onChange={handleFileChange}
                className="border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {!file && (
                <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                  <span className="text-gray-500 text-sm">Browse... No file selected</span>
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleLogin} 
            disabled={!companyName || !sector || !website || isLoading} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant Landing Page avec design simplifié selon l'image
function LandingPage({ user, onNavigate, onLogout }: { user: any, onNavigate: (page: string) => void, onLogout: () => void }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <div className={`flex items-center gap-3 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Date2Deal</h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
        </div>
        <div className={`flex items-center gap-4 transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <div className="text-gray-700 text-sm bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Bienvenue, <span className="font-semibold">{user.companyName}</span>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="text-gray-700 border-gray-300 hover:bg-gray-50 backdrop-blur-sm">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Top Badges */}
        <div className={`flex justify-center gap-4 flex-wrap mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            IA Avancée
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-2">
            <Target className="h-4 w-4 mr-2" />
            Stratégies Personnalisées
          </Badge>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-2">
            <TrendingUp className="h-4 w-4 mr-2" />
            Résultats Mesurables
          </Badge>
        </div>

        {/* Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Company Analyzer Card */}
          <Card 
            className="bg-gradient-to-br from-cyan-50 to-blue-100 border-blue-200 hover:border-blue-300 transition-all duration-300 cursor-pointer group backdrop-blur-sm hover:scale-105 hover:shadow-xl"
            onClick={() => onNavigate('company-search')}
          >
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Analyseur d'Entreprises</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Découvrez la structure organisationnelle des entreprises avec des organigrammes interactifs et des données vérifiées.
                </p>
                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                  <Badge variant="outline" className="text-xs text-blue-700 border-blue-300">
                    <Star className="h-3 w-3 mr-1" />
                    Données Vérifiées
                  </Badge>
                  <Badge variant="outline" className="text-xs text-blue-700 border-blue-300">
                    <Linkedin className="h-3 w-3 mr-1" />
                    LinkedIn
                  </Badge>
                  <Badge variant="outline" className="text-xs text-blue-700 border-blue-300">
                    <Sitemap className="h-3 w-3 mr-1" />
                    Organigramme
                  </Badge>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white group-hover:shadow-lg transition-all">
                  Rechercher une Entreprise
                  <Search className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Card */}
          <Card 
            className="bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200 hover:border-purple-300 transition-all duration-300 cursor-pointer group backdrop-blur-sm hover:scale-105 hover:shadow-xl"
            onClick={() => onNavigate('dashboard')}
          >
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-indigo-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Client</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Gérez vos interactions clients, planifiez des rappels et suivez vos communications avec une interface intuitive.
                </p>
                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                  <Badge variant="outline" className="text-xs text-purple-700 border-purple-300">
                    <Calendar className="h-3 w-3 mr-1" />
                    Rappels
                  </Badge>
                  <Badge variant="outline" className="text-xs text-purple-700 border-purple-300">
                    <Users className="h-3 w-3 mr-1" />
                    Contacts
                  </Badge>
                  <Badge variant="outline" className="text-xs text-purple-700 border-purple-300">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Suivi
                  </Badge>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white group-hover:shadow-lg transition-all">
                  Accéder au Dashboard
                  <BarChart3 className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">10K+</div>
              <div className="text-gray-600 text-sm">Entreprises Analysées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">95%</div>
              <div className="text-gray-600 text-sm">Précision des Données</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">24/7</div>
              <div className="text-gray-600 text-sm">Assistant IA Disponible</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant Company Search complet restauré avec gestion d'erreur
function CompanySearchPage({ user, onBack, onNavigateToChat, onNavigateToDashboard }: { user: any, onBack: () => void, onNavigateToChat: (executive: Executive, companyData: CompanyData) => void, onNavigateToDashboard: () => void }) {
  const [companyName, setCompanyName] = useState("Talan")
  const [selectedRegion, setSelectedRegion] = useState("France")
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null)
  const [showBioModal, setShowBioModal] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showMessaging, setShowMessaging] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const dataService = new EnhancedCompanyDataService()

  // Auto-search for Talan on component mount to demonstrate the new images
  useEffect(() => {
    handleSearch()
  }, [])

  const handleGenerateStrategy = (executive: Executive) => {
    // Navigate to AI chat page with executive data
    if (companyData) {
      onNavigateToChat(executive, companyData)
    }
  }

  const handleScheduleReminder = (executive: Executive) => {
    // This will be handled by the dashboard
    console.log("Schedule reminder for:", executive.fullName)
  }

  const handleSearch = async () => {
    if (!companyName.trim() || !selectedRegion) return

    setIsLoading(true)
    try {
      const data = await dataService.getCompanyData(companyName, selectedRegion)
      setCompanyData(data)
      
      // Ajouter à l'historique
      const searchTerm = `${companyName} - ${selectedRegion}`
      setSearchHistory(prev => [searchTerm, ...prev.filter(item => item !== searchTerm)].slice(0, 5))
    } catch (error) {
      console.error("Erreur lors de la recherche:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExecutiveClick = (executive: Executive) => {
    setSelectedExecutive(executive)
    setShowMessaging(true)
  }

  const handleBioClick = (executive: Executive) => {
    setSelectedExecutive(executive)
    setShowBioModal(true)
  }

  const handleSendMessage = (executiveId: string, content: string) => {
    if (!content.trim()) return

    const executive = findExecutiveById(executiveId)
    if (!executive) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.companyName,
      content,
      timestamp: new Date(),
      sentiment: analyzeSentiment(content)
    }

    setConversations(prev => {
      const existingConv = prev.find(conv => conv.participantId === executiveId)
      if (existingConv) {
        return prev.map(conv => 
          conv.id === existingConv.id 
            ? { ...conv, messages: [...conv.messages, message], lastMessage: message }
            : conv
        )
      } else {
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          participantId: executiveId,
          participantName: executive.fullName,
          messages: [message],
          lastMessage: message
        }
        return [...prev, newConv]
      }
    })

    setNewMessage("")
  }

  const findExecutiveById = (id: string): Executive | null => {
    if (!companyData || !companyData.structure || !companyData.structure.ceo) return null
    
    const searchInStructure = (exec: Executive): Executive | null => {
      if (exec.id === id) return exec
      if (exec.children) {
        for (const child of exec.children) {
          const found = searchInStructure(child)
          if (found) return found
        }
      }
      return null
    }
    
    return searchInStructure(companyData.structure.ceo)
  }

  const analyzeSentiment = (message: string) => {
    const positiveWords = ["merci", "excellent", "parfait", "génial", "super", "bravo"]
    const negativeWords = ["problème", "erreur", "mauvais", "terrible", "déçu", "frustré"]

    const words = message.toLowerCase().split(/\s+/)
    const positiveCount = words.filter(word => positiveWords.some(pw => word.includes(pw))).length
    const negativeCount = words.filter(word => negativeWords.some(nw => word.includes(nw))).length

    let sentiment: "positive" | "negative" | "neutral" = "neutral"
    let score = 0.5

    if (positiveCount > negativeCount) {
      sentiment = "positive"
      score = Math.min(0.9, 0.5 + positiveCount * 0.2)
    } else if (negativeCount > positiveCount) {
      sentiment = "negative"
      score = Math.max(0.1, 0.5 - negativeCount * 0.2)
    }

    return {
      type: sentiment,
      score,
      keywords: [
        ...positiveWords.filter(pw => message.toLowerCase().includes(pw)),
        ...negativeWords.filter(nw => message.toLowerCase().includes(nw))
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 backdrop-blur-sm bg-white/80">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-gray-700 hover:bg-gray-100">
            ← Retour
          </Button>
          <div className="flex items-center gap-3">
            <Building2 className="h-10 w-10 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Analyseur d'Entreprises</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onNavigateToDashboard}
            className="text-purple-700 border-purple-300 hover:bg-purple-50"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          {conversations.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowMessaging(!showMessaging)}
              className="text-gray-700 border-gray-300"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages ({conversations.length})
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search Section */}
        <Card className="mb-8 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Search className="h-5 w-5" />
              Recherche d'Entreprise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise
                </label>
                <Input
                  placeholder="Ex: Apple, Microsoft, Talan..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-white border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Région
                </label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={!companyName.trim() || !selectedRegion || isLoading}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    "Analyser l'entreprise"
                  )}
                </Button>
              </div>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Recherches récentes :</p>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((search, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100 text-gray-700 border-gray-300"
                      onClick={() => {
                        const [name, region] = search.split(' - ')
                        setCompanyName(name)
                        setSelectedRegion(region)
                      }}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {companyData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-800">Informations Générales</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{companyData.name}</h3>
                    <p className="text-gray-600">{companyData.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Fondée en</p>
                        <p className="font-semibold text-gray-800">{companyData.founded}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Employés</p>
                        <p className="font-semibold text-gray-800">{companyData.employees.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Secteur</p>
                        <p className="font-semibold text-gray-800">{companyData.industry}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">Siège social</p>
                      <p className="font-semibold text-gray-800">{companyData.headquarters}</p>
                    </div>
                  </div>

                  {companyData.website && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Site web</p>
                        <a
                          href={companyData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500 flex items-center gap-1 font-semibold"
                        >
                          Visiter le site
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir Cartes
                    </Button>
                    <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
                      <Sitemap className="h-4 w-4 mr-2" />
                      Organigramme
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Organizational Chart */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Users className="h-5 w-5" />
                      Équipe Dirigeante - {companyData.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Star className="h-3 w-3 mr-1" />
                        Photos Réelles
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <Linkedin className="h-3 w-3 mr-1" />
                        Données Vérifiées
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        <Sitemap className="h-3 w-3 mr-1" />
                        Organigramme Hiérarchique
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <OrganizationalChart
                    structure={companyData.structure}
                    onProfileClick={handleExecutiveClick}
                    onBioClick={handleBioClick}
                    onStrategyClick={handleGenerateStrategy}
                    conversations={conversations}
                    companyName={companyData.name}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Bio Modal */}
        {selectedExecutive && (
          <BioViewer
            isOpen={showBioModal}
            onClose={() => setShowBioModal(false)}
            executive={selectedExecutive}
            onScheduleReminder={handleScheduleReminder}
          />
        )}

        {/* Messaging Panel - Updated Design matching the provided images */}
        {showMessaging && selectedExecutive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-6xl h-[85vh] bg-white rounded-lg shadow-xl border border-gray-200 flex overflow-hidden">
              {/* Left Panel - Profile Information */}
              <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col">
                {/* Profile Header */}
                <div className="p-6 bg-white border-b border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={selectedExecutive.photo || "/placeholder.svg"}
                        alt={selectedExecutive.fullName}
                        className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
                        onError={(e) => {
                          const initials = selectedExecutive.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                          e.currentTarget.src = `/placeholder.svg?height=80&width=80&text=${initials}`
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedExecutive.fullName}</h2>
                      <p className="text-blue-600 font-medium mb-1">{selectedExecutive.position}</p>
                      <p className="text-sm text-gray-500">{selectedExecutive.department}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {/* Contact & Informations */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Contact & Informations
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-700">{selectedExecutive.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-700">{selectedExecutive.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-700">{selectedExecutive.location}</span>
                        </div>
                        {selectedExecutive.linkedinUrl && (
                          <div className="flex items-center gap-3 text-sm">
                            <Linkedin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <a 
                              href={selectedExecutive.linkedinUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Profil LinkedIn
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* À Propos */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        À Propos
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedExecutive.bio}</p>
                    </div>

                    {/* Expérience */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        Expérience
                      </h3>
                      <div className="space-y-3">
                        <div className="border-l-2 border-blue-200 pl-4">
                          <h4 className="font-medium text-gray-900">{selectedExecutive.position}</h4>
                          <p className="text-sm text-gray-600">{selectedExecutive.department}</p>
                          <p className="text-xs text-gray-500 mt-1">{selectedExecutive.experience}</p>
                        </div>
                        {selectedExecutive.previousRoles && selectedExecutive.previousRoles.length > 0 && (
                          <div className="space-y-2">
                            {selectedExecutive.previousRoles.slice(0, 2).map((role, index) => (
                              <div key={index} className="border-l-2 border-gray-200 pl-4">
                                <h4 className="font-medium text-gray-800 text-sm">{role.position}</h4>
                                <p className="text-xs text-gray-600">{role.company}</p>
                                <p className="text-xs text-gray-500">{role.duration}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Formation */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        Formation
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedExecutive.education}</p>
                    </div>

                    {/* Compétences */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        Compétences
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedExecutive.skills && selectedExecutive.skills.slice(0, 10).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Réalisations */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-600" />
                        Réalisations
                      </h3>
                      <ul className="space-y-2">
                        {selectedExecutive.achievements && selectedExecutive.achievements.slice(0, 4).map((achievement, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Right Panel - Conversation */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Conversation avec {selectedExecutive.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {conversations.find(conv => conv.participantId === selectedExecutive.id)?.messages?.length || 0} message(s)
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMessaging(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4 bg-gray-50">
                  {conversations
                    .find(conv => conv.participantId === selectedExecutive.id)
                    ?.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-4 ${msg.senderId === user.id ? 'text-right' : 'text-left'}`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg max-w-[70%] ${
                            msg.senderId === user.id
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className="flex items-center justify-between mt-2 pt-1">
                            <p className="text-xs opacity-70">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                            {msg.sentiment && (
                              <Badge variant="outline" className="text-xs ml-2">
                                {msg.sentiment.type === 'positive' ? '😊' : msg.sentiment.type === 'negative' ? '😔' : '😐'} 
                                ({Math.round(msg.sentiment.score * 100)}%)
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )) || (
                    <div className="text-center py-12">
                      <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-600 mb-2">Aucun message encore</h4>
                      <p className="text-gray-500 mb-6">Commencez la conversation avec {selectedExecutive.fullName}</p>
                    </div>
                  )}
                </ScrollArea>

                {/* AI Suggestions */}
                {(!conversations.find(conv => conv.participantId === selectedExecutive.id)?.messages?.length || 
                  conversations.find(conv => conv.participantId === selectedExecutive.id)?.messages?.length === 0) && (
                  <div className="p-4 bg-blue-50 border-t border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Suggestions IA :</span>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-left text-sm text-blue-700 hover:bg-blue-100 justify-start h-auto py-2 px-3"
                        onClick={() => handleSendMessage(selectedExecutive.id, `Merci ${selectedExecutive.fullName} pour votre message. Je reviens vers vous dans les plus brefs délais.`)}
                      >
                        Merci {selectedExecutive.fullName} pour votre message. Je reviens vers vous dans les plus brefs délais.
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-left text-sm text-blue-700 hover:bg-blue-100 justify-start h-auto py-2 px-3"
                        onClick={() => handleSendMessage(selectedExecutive.id, `Bonjour ${selectedExecutive.fullName}, j'ai bien reçu votre message et je vous réponds sous peu.`)}
                      >
                        Bonjour {selectedExecutive.fullName}, j'ai bien reçu votre message et je vous réponds sous peu.
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-left text-sm text-blue-700 hover:bg-blue-100 justify-start h-auto py-2 px-3"
                        onClick={() => handleSendMessage(selectedExecutive.id, `${selectedExecutive.fullName}, merci pour ces informations. Je vais étudier cela attentivement.`)}
                      >
                        {selectedExecutive.fullName}, merci pour ces informations. Je vais étudier cela attentivement.
                      </Button>
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-3">
                    <Input
                      placeholder={`Écrivez votre message à ${selectedExecutive.fullName}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(selectedExecutive.id, newMessage)
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleSendMessage(selectedExecutive.id, newMessage)}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant principal
export default function CompanyAnalyzer() {
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [currentPage, setCurrentPage] = useState<'landing' | 'company-search' | 'ai-chat' | 'dashboard'>('landing')
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null)
  const [selectedCompanyData, setSelectedCompanyData] = useState<CompanyData | null>(null)
  const [clients, setClients] = useState<Client[]>([])

  // Initialize sample clients
  useEffect(() => {
    const sampleClients: Client[] = [
      {
        id: "talan",
        name: "Talan",
        industry: "Conseil en Transformation Digitale",
        location: "Paris, France",
        executives: [], // Will be populated from company data
        status: "active"
      },
      {
        id: "microsoft",
        name: "Microsoft",
        industry: "Technologie",
        location: "Redmond, USA",
        executives: [],
        status: "prospect"
      },
      {
        id: "apple",
        name: "Apple",
        industry: "Technologie",
        location: "Cupertino, USA",
        executives: [],
        status: "active"
      }
    ]
    setClients(sampleClients)
  }, [])

  const handleLogin = (user: any) => {
    setCurrentUser(user)
    setCurrentPage('landing')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentPage('landing')
  }

  const handleNavigate = (page: 'landing' | 'company-search' | 'dashboard') => {
    setCurrentPage(page)
  }

  const handleNavigateToChat = (executive: Executive, companyData: CompanyData) => {
    setSelectedExecutive(executive)
    setSelectedCompanyData(companyData)
    setCurrentPage('ai-chat')
  }

  const handleBackFromChat = () => {
    setCurrentPage('company-search')
    setSelectedExecutive(null)
    setSelectedCompanyData(null)
  }

  const handleScheduleReminder = (clientId: string, executiveId: string, reminder: Omit<Reminder, 'id' | 'clientId' | 'executiveId' | 'clientName' | 'executiveName' | 'executivePhoto'>) => {
    // This would typically save to a database
    console.log("Scheduling reminder:", { clientId, executiveId, reminder })
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  switch (currentPage) {
    case 'landing':
      return <LandingPage user={currentUser} onNavigate={handleNavigate} onLogout={handleLogout} />
    case 'company-search':
      return (
        <CompanySearchPage 
          user={currentUser} 
          onBack={() => handleNavigate('landing')} 
          onNavigateToChat={handleNavigateToChat}
          onNavigateToDashboard={() => handleNavigate('dashboard')}
        />
      )
    case 'ai-chat':
      return <AIChatPage onBack={handleBackFromChat} executive={selectedExecutive} companyData={selectedCompanyData} />
    case 'dashboard':
      return (
        <Dashboard 
          onBack={() => handleNavigate('landing')} 
          clients={clients}
          onScheduleReminder={handleScheduleReminder}
        />
      )
    default:
      return <LandingPage user={currentUser} onNavigate={handleNavigate} onLogout={handleLogout} />
  }
}
