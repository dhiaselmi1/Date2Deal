"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, ArrowLeft, MessageCircle, TrendingUp, DollarSign, Target, Users, Sparkles, User, Phone, Mail, Building2, Zap, Star, Lightbulb, BarChart3, PieChart, Settings } from 'lucide-react'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
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
  company?: string
}

interface AIChatPageProps {
  onBack: () => void
  executive?: Executive
  companyData?: any
}

export function AIChatPage({ onBack, executive, companyData }: AIChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Messages d'accueil personnalisés
  useEffect(() => {
    if (executive) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: `Bonjour ! Je suis votre assistant IA spécialisé en stratégies commerciales. Je vais vous aider à développer une approche personnalisée pour ${executive.fullName}, ${executive.position} chez ${companyData?.name || 'leur entreprise'}. 

Que souhaitez-vous développer aujourd'hui ?`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [executive, companyData])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simuler une réponse de l'IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, executive)
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string, exec?: Executive): string => {
    const responses = [
      `Excellente question ! Pour ${exec?.fullName || 'ce contact'}, je recommande une approche basée sur leur expertise en ${exec?.department || 'leur domaine'}. Voici une stratégie personnalisée...`,
      `Basé sur le profil de ${exec?.fullName || 'votre contact'}, voici mes recommandations stratégiques pour maximiser vos chances de succès...`,
      `Parfait ! Développons ensemble une stratégie commerciale ciblée. Compte tenu du poste de ${exec?.position || 'la position'} de votre contact...`,
      `Je vais analyser les meilleures approches pour ${exec?.fullName || 'ce prospect'}. Voici ce que je propose...`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const quickSuggestions = [
    "Analyser la concurrence",
    "Optimiser le pricing", 
    "Améliorer le closing",
    "Développer le réseau"
  ]

  const strategySuggestions = [
    {
      title: "Profil du Client",
      description: "Analysez et comprenez votre client cible",
      icon: User,
      color: "bg-emerald-500"
    },
    {
      title: "Une Stratégie Commerciale", 
      description: "Développez une stratégie de vente efficace",
      icon: Target,
      color: "bg-blue-500"
    },
    {
      title: "Un Pitch Personnalisé",
      description: "Rédigez un pitch convaincant",
      icon: Zap,
      color: "bg-purple-500"
    },
    {
      title: "Des Recommandations de Communication",
      description: "Améliorez votre communication client",
      icon: MessageCircle,
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Assistant IA Commercial</h1>
                  <p className="text-sm text-gray-600">Stratégies personnalisées par intelligence artificielle</p>
                </div>
              </div>
            </div>
            
            {executive && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
                <img
                  src={executive.photo || "/placeholder.svg"}
                  alt={executive.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    const initials = executive.fullName.split(" ").map((n) => n[0]).join("")
                    e.currentTarget.src = `/placeholder.svg?height=32&width=32&text=${initials}`
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{executive.fullName}</p>
                  <p className="text-xs text-gray-600">{executive.position}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    Conversation
                  </CardTitle>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    {messages.length} message{messages.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-6">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6">
                        <Bot className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Prêt à vous aider !</h3>
                      <p className="text-gray-600 mb-8 max-w-md">
                        Choisissez une suggestion ou tapez votre question.
                      </p>
                      
                      {/* Quick Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {quickSuggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.isUser 
                                ? 'bg-blue-500' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-500'
                            }`}>
                              {message.isUser ? (
                                <User className="h-4 w-4 text-white" />
                              ) : (
                                <Bot className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div className={`rounded-2xl px-4 py-3 ${
                              message.isUser
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                            }`}>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                              <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Tapez votre message ici..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions Panel */}
          <div className="lg:col-span-1">
            <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 bg-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Suggestions
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-4">
                    {strategySuggestions.map((suggestion, index) => (
                      <Card 
                        key={index} 
                        className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
                        onClick={() => handleSuggestionClick(`Aidez-moi avec: ${suggestion.title}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 ${suggestion.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <suggestion.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-1">{suggestion.title}</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">{suggestion.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Executive Info Card */}
                    {executive && (
                      <Card className="border border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Contact Ciblé
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-3 w-3 text-blue-600" />
                              <span className="text-blue-700">{executive.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="h-3 w-3 text-blue-600" />
                              <span className="text-blue-700">{executive.position}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-blue-600" />
                              <span className="text-blue-700">{executive.email}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Quick Stats */}
                    <Card className="border border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Statistiques IA
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">Précision</span>
                            <span className="text-green-800 font-medium">94%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">Stratégies générées</span>
                            <span className="text-green-800 font-medium">1,247</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">Taux de succès</span>
                            <span className="text-green-800 font-medium">87%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
