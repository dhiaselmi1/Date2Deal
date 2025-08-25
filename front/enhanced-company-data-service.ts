export class EnhancedCompanyDataService {
  private getAppleData() {
    return {
      name: "Apple Inc.",
      region: "États-Unis",
      founded: 1976,
      employees: 164000,
      revenue: "$394.3 milliards",
      industry: "Technologie",
      website: "https://www.apple.com",
      description: "Entreprise technologique américaine spécialisée dans l'électronique grand public, les logiciels informatiques et les services en ligne.",
      headquarters: "Cupertino, Californie",
      structure: {
        ceo: {
          id: "tim-cook",
          name: "Tim Cook",
          fullName: "Timothy Donald Cook",
          position: "Chief Executive Officer",
          department: "Direction Générale",
          email: "tcook@apple.com",
          phone: "+1-408-996-1010",
          location: "Cupertino, CA",
          photo: "/placeholder.svg?height=200&width=200&text=TC",
          linkedinUrl: "https://www.linkedin.com/in/tim-cook-0b5b8b1/",
          experience: "CEO d'Apple depuis 2011, précédemment COO",
          education: "MBA Duke University, BS Auburn University",
          skills: ["Leadership", "Operations", "Supply Chain", "Strategic Planning"],
          bio: "Tim Cook est le CEO d'Apple depuis 2011. Il a rejoint Apple en 1998 et a supervisé les opérations mondiales de l'entreprise.",
          achievements: [
            "A dirigé Apple vers une valorisation de plus de 3 000 milliards de dollars",
            "A lancé l'Apple Watch et les services Apple",
            "Champion de la durabilité et des droits de l'homme"
          ],
          previousRoles: [
            { company: "Compaq", position: "VP Operations", duration: "1997-1998" },
            { company: "IBM", position: "Director Operations", duration: "1982-1997" }
          ],
          children: [
            {
              id: "craig-federighi",
              name: "Craig Federighi",
              fullName: "Craig Federighi",
              position: "Senior Vice President Software Engineering",
              department: "Engineering",
              email: "cfederighi@apple.com",
              phone: "+1-408-996-1010",
              location: "Cupertino, CA",
              photo: "/placeholder.svg?height=200&width=200&text=CF",
              linkedinUrl: "https://www.linkedin.com/in/craig-federighi/",
              experience: "SVP Software Engineering depuis 2012",
              education: "MS Computer Science UC Berkeley",
              skills: ["Software Engineering", "macOS", "iOS", "Leadership"],
              bio: "Craig Federighi supervise le développement de iOS, macOS et les technologies logicielles d'Apple.",
              achievements: [
                "Supervision du développement de iOS et macOS",
                "Leadership dans l'innovation logicielle d'Apple"
              ],
              previousRoles: [
                { company: "NeXT", position: "Engineer", duration: "1996-2009" }
              ],
              children: []
            },
            {
              id: "johnny-srouji",
              name: "Johnny Srouji",
              fullName: "Johnny Srouji",
              position: "Senior Vice President Hardware Technologies",
              department: "Hardware",
              email: "jsrouji@apple.com",
              phone: "+1-408-996-1010",
              location: "Cupertino, CA",
              photo: "/placeholder.svg?height=200&width=200&text=JS",
              linkedinUrl: "https://www.linkedin.com/in/johnny-srouji/",
              experience: "SVP Hardware Technologies depuis 2015",
              education: "MS Electrical Engineering Technion",
              skills: ["Hardware Engineering", "Chip Design", "Silicon", "Leadership"],
              bio: "Johnny Srouji dirige le développement des puces et technologies hardware d'Apple.",
              achievements: [
                "Développement des puces Apple Silicon",
                "Innovation dans les technologies de processeurs mobiles"
              ],
              previousRoles: [
                { company: "Intel", position: "Principal Engineer", duration: "1993-2008" }
              ],
              children: []
            }
          ]
        }
      }
    }
  }

  private getTalanData() {
    return {
      name: "Talan",
      region: "France",
      founded: 2002,
      employees: 6000,
      revenue: "€800 millions",
      industry: "Conseil en transformation digitale",
      website: "https://www.talan.com",
      description: "Cabinet de conseil en transformation et innovation technologique, spécialisé dans l'accompagnement des entreprises dans leur transformation digitale.",
      headquarters: "Paris, France",
      structure: {
        ceo: {
          id: "mehdi-houas",
          name: "Mehdi Houas",
          fullName: "Mehdi Houas",
          position: "Président du Groupe Talan",
          department: "Direction Générale",
          email: "mehdi.houas@talan.com",
          phone: "+33-1-55-37-00-00",
          location: "Paris, France",
          photo: "/images/talan/mahdi-houas.png",
          linkedinUrl: "https://www.linkedin.com/in/mehdi-houas/",
          experience: "Fondateur et Président de Talan depuis 2002",
          education: "Ingénieur ENIT (École Nationale d'Ingénieurs de Tunis), Executive MBA",
          skills: ["Leadership", "Transformation Digitale", "Innovation", "Entrepreneuriat", "Stratégie"],
          bio: "Mehdi Houas est le fondateur et président du Groupe Talan. Entrepreneur visionnaire, il a créé Talan en 2002 et l'a développé pour en faire un acteur majeur du conseil en transformation digitale avec plus de 6000 collaborateurs.",
          achievements: [
            "Création et développement de Talan (2002-présent)",
            "Expansion internationale du groupe",
            "Leadership en transformation digitale",
            "Développement d'une équipe de 6000+ collaborateurs"
          ],
          previousRoles: [
            { company: "Startup Tech", position: "Entrepreneur", duration: "1998-2002" }
          ],
          bioFile: "mehdi-houas",
          children: [
            {
              id: "behjet-bousfara",
              name: "Behjet Bousfara",
              fullName: "Behjet Bousfara",
              position: "Chief Executive Officer",
              department: "Direction Générale",
              email: "behjet.bousfara@talan.com",
              phone: "+33-1-55-37-00-01",
              location: "Paris, France",
              photo: "/images/talan/behjet-bousfara.png",
              linkedinUrl: "https://www.linkedin.com/in/behjet-bousfara/",
              experience: "CEO chez Talan depuis 2015",
              education: "MBA HEC Paris, Ingénieur Centrale",
              skills: ["Management", "Stratégie", "Développement Commercial", "Leadership", "Transformation"],
              bio: "Behjet Bousfara est CEO de Talan. Il supervise les opérations stratégiques et le développement commercial du groupe, contribuant à son expansion internationale.",
              achievements: [
                "Supervision de l'expansion européenne de Talan",
                "Développement de partenariats stratégiques majeurs",
                "Leadership dans la transformation organisationnelle",
                "Croissance du chiffre d'affaires de 300% sous sa direction"
              ],
              previousRoles: [
                { company: "McKinsey & Company", position: "Senior Partner", duration: "2010-2015" },
                { company: "BCG", position: "Principal", duration: "2005-2010" }
              ],
              children: [
                {
                  id: "imen-ayari",
                  name: "Imen Ayari",
                  fullName: "Imen Ayari",
                  position: "Head of Innovation Factory",
                  department: "Innovation & R&D",
                  email: "imen.ayari@talan.com",
                  phone: "+216-71-123-456",
                  location: "Tunis, Tunisie",
                  photo: "/images/talan/imen-ayari.png",
                  linkedinUrl: "https://www.linkedin.com/in/imen-ayari/",
                  experience: "Head of Innovation Factory chez Talan depuis 2020",
                  education: "Ingénieure ENIT, Master Data Science, Executive MBA",
                  skills: ["Blockchain", "Intelligence Artificielle", "IA Générative", "Réalité Virtuelle", "Design Thinking", "Federated Learning"],
                  bio: "Imen Ayari dirige l'Innovation Factory de Talan, où elle supervise les initiatives d'innovation technologique et d'intelligence artificielle. Experte reconnue en data science et technologies émergentes.",
                  achievements: [
                    "Développement de l'Innovation Factory de Talan",
                    "Lancement de projets d'IA avancée",
                    "Création de partenariats technologiques stratégiques",
                    "Publication de recherches en IA"
                  ],
                  previousRoles: [
                    { company: "Talan", position: "Senior Consultant", duration: "2018-2020" },
                    { company: "Tech Startup", position: "Data Scientist", duration: "2016-2018" }
                  ],
                  bioFile: "imen-ayari",
                  children: []
                },
                {
                  id: "ramzi-khiralah",
                  name: "Ramzi Khairallah",
                  fullName: "Ramzi Khairallah",
                  position: "Directeur Data & Analytics",
                  department: "Data & Intelligence",
                  email: "ramzi.khiralah@talan.com",
                  phone: "+33-1-55-37-00-03",
                  location: "Paris, France",
                  photo: "/images/talan/ramzi-khiralah.png",
                  linkedinUrl: "https://www.linkedin.com/in/ramzi-khiralah/",
                  experience: "Directeur Data & Analytics chez Talan depuis 2017",
                  education: "MBA INSEAD, Ingénieur Mines ParisTech",
                  skills: ["Data Science", "Machine Learning", "Analytics", "Big Data", "Python", "R"],
                  bio: "Ramzi Khairallah supervise les initiatives data et analytics de Talan. Il est responsable de l'implémentation des solutions d'intelligence artificielle et d'analyse de données pour les clients du groupe.",
                  achievements: [
                    "Mise en place de la practice Data & Analytics",
                    "Développement de solutions IA avancées",
                    "Leadership dans les projets de transformation data",
                    "Certification en Machine Learning et Big Data"
                  ],
                  previousRoles: [
                    { company: "Accenture", position: "Senior Manager", duration: "2013-2017" },
                    { company: "Deloitte", position: "Manager", duration: "2010-2013" }
                  ],
                  children: []
                },
                {
                  id: "ahmed-sehli",
                  name: "Ahmed Sehli",
                  fullName: "Ahmed Sehli",
                  position: "Manager Projets Stratégiques",
                  department: "AI, Tech & Delivery",
                  email: "ahmed.sehli@talan.com",
                  phone: "+33-1-55-37-00-02",
                  location: "Paris, France",
                  photo: "/images/talan/ahmed-sehli.png",
                  linkedinUrl: "https://www.linkedin.com/in/ahmed-sehli/",
                  experience: "Manager Projets Stratégiques chez Talan depuis 2018",
                  education: "PhD Computer Science, Ingénieur Polytechnique",
                  skills: ["Project Management", "Agile", "Scrum", "Strategic Planning", "PMO"],
                  bio: "Ahmed Sehli dirige les projets stratégiques de Talan. Expert en gestion de projets et méthodologies agiles, il supervise la livraison des solutions technologiques les plus complexes pour les clients du groupe.",
                  achievements: [
                    "Management de projets stratégiques majeurs",
                    "Certification PMP et Scrum Master",
                    "Leadership dans la transformation Agile",
                    "Optimisation des processus de delivery"
                  ],
                  previousRoles: [
                    { company: "Amazon Web Services", position: "Solutions Architect", duration: "2015-2018" },
                    { company: "Microsoft", position: "Senior Engineer", duration: "2012-2015" }
                  ],
                  children: []
                },
                {
                  id: "med-amine-issaoui",
                  name: "Med Amine Issaoui",
                  fullName: "Mohamed Amine Issaoui",
                  position: "Directeur Pôle Testing & Qualité",
                  department: "Quality Assurance",
                  email: "medamine.issaoui@talan.com",
                  phone: "+216-71-123-457",
                  location: "Tunis, Tunisie",
                  photo: "/images/talan/med-amine-issaoui.png",
                  linkedinUrl: "https://www.linkedin.com/in/med-amine-issaoui/",
                  experience: "Directeur Pôle Testing & Qualité chez Talan depuis 2019",
                  education: "MBA, Ingénieur ENIT",
                  skills: ["Test Automation", "Quality Assurance", "Selenium", "Performance Testing", "DevOps"],
                  bio: "Mohamed Amine Issaoui dirige le pôle Testing & Qualité de Talan. Il supervise l'assurance qualité et les tests automatisés pour garantir l'excellence des livrables du groupe.",
                  achievements: [
                    "Mise en place du centre d'excellence Testing",
                    "Automatisation des processus de test (90%)",
                    "Certification en outils de test avancés",
                    "Amélioration de la qualité logicielle (+95%)"
                  ],
                  previousRoles: [
                    { company: "Capgemini", position: "Senior Consultant", duration: "2016-2019" },
                    { company: "Sopra Steria", position: "Consultant", duration: "2014-2016" }
                  ],
                  children: []
                },
                {
                  id: "ons-mahsni",
                  name: "Ons Mahsni",
                  fullName: "Ons Mahsni",
                  position: "Directrice des Ressources Humaines",
                  department: "Ressources Humaines",
                  email: "ons.mahsni@talan.com",
                  phone: "+216-71-123-458",
                  location: "Tunis, Tunisie",
                  photo: "/placeholder.svg?height=200&width=200&text=OM",
                  linkedinUrl: "https://www.linkedin.com/in/ons-mahsni/",
                  experience: "Directrice des Ressources Humaines chez Talan depuis 2018",
                  education: "Master RH, MBA Management",
                  skills: ["Gestion RH", "Recrutement", "Formation", "SIRH", "Talent Management", "Droit Social"],
                  bio: "Ons Mahsni dirige les ressources humaines de Talan. Elle supervise le recrutement, la formation et le développement des talents, contribuant à la croissance et au bien-être des équipes du groupe.",
                  achievements: [
                    "Développement de la stratégie RH du groupe",
                    "Mise en place de programmes de formation innovants",
                    "Optimisation des processus de recrutement",
                    "Leadership dans la transformation digitale RH"
                  ],
                  previousRoles: [
                    { company: "Groupe Poulina", position: "RH Manager", duration: "2015-2018" },
                    { company: "Tunisie Telecom", position: "RH Specialist", duration: "2012-2015" }
                  ],
                  children: []
                }
              ]
            }
          ]
        }
      }
    }
  }

  private getTalanTunisieData() {
    return {
      name: "Talan Tunisie",
      region: "Tunisie",
      founded: 2013,
      employees: 500,
      revenue: "Non publié spécifiquement pour la Tunisie (le CA de 500M€ est celui du groupe Talan)",
      industry: "Conseil en Technologies, Data, Cloud & Transformation Digitale",
      website: "https://www.talan.com/tunisie",
      description: "Talan Tunisie accompagne ses clients dans leur transformation digitale à travers l'innovation technologique.",
      headquarters: "Tunis, Tunisie",
      structure: {
        ceo: {
          id: "mehdi-houas-tunisia",
          name: "Mehdi Houas",
          fullName: "Mehdi Houas",
          position: "Chairman & Founder",
          department: "Direction Générale",
          email: "mehdi.houas@talan.com",
          phone: "+216 71 962 000",
          location: "Tunis, Tunisie",
          photo: "/images/talan/mahdi-houas.png",
          linkedinUrl: "https://www.linkedin.com/in/mehdi-houas/",
          experience: "Entrepreneur franco-tunisien, fondateur et Président Directeur Général (PDG) du groupe Talan",
          education: "Ingénieur ENIT (École Nationale d'Ingénieurs de Tunis), Executive MBA",
          skills: ["Leadership", "Transformation Digitale", "Innovation", "Entrepreneuriat", "Stratégie"],
          bio: "Mehdi Houas est un entrepreneur franco-tunisien, fondateur et Président Directeur Général (PDG) du groupe Talan. Se décrivant comme '100% français, 100% tunisien', il est reconnu pour son optimisme, son pragmatisme et sa passion pour la technologie, la data et l'innovation.",
          achievements: [
            "Création et développement de Talan (2002-présent)",
            "Expansion internationale du groupe",
            "Leadership en transformation digitale",
            "Développement d'une équipe de 6000+ collaborateurs"
          ],
          previousRoles: [
            { company: "Startup Tech", position: "Entrepreneur", duration: "1998-2002" }
          ],
          bioFile: "mehdi-houas",
          children: [
            {
              id: "behjet-bousfara-tunisia",
              name: "Behjet Bousfara",
              fullName: "Behjet Bousfara",
              position: "Chief Executive Officer",
              department: "Direction Générale",
              email: "behjet.bousfara@talan.com",
              phone: "+33-1-55-37-00-01",
              location: "Paris, France",
              photo: "/images/talan/behjet-bousfara.png",
              linkedinUrl: "https://www.linkedin.com/in/behjet-bousfara/",
              experience: "CEO chez Talan depuis 2015",
              education: "MBA HEC Paris, Ingénieur Centrale",
              skills: ["Management", "Stratégie", "Développement Commercial", "Leadership", "Transformation"],
              bio: "Behjet Bousfara est CEO de Talan. Il supervise les opérations stratégiques et le développement commercial du groupe, contribuant à son expansion internationale.",
              achievements: [
                "Supervision de l'expansion européenne de Talan",
                "Développement de partenariats stratégiques majeurs",
                "Leadership dans la transformation organisationnelle",
                "Croissance du chiffre d'affaires de 300% sous sa direction"
              ],
              previousRoles: [
                { company: "McKinsey & Company", position: "Senior Partner", duration: "2010-2015" },
                { company: "BCG", position: "Principal", duration: "2005-2010" }
              ],
              children: [
                {
                  id: "imen-ayari-tunisia",
                  name: "Imen Ayari",
                  fullName: "Imen Ayari",
                  position: "Head of Innovation Factory",
                  department: "Innovation & R&D",
                  email: "imen.ayari@talan.com",
                  phone: "+216-71-123-456",
                  location: "Tunis, Tunisie",
                  photo: "/images/talan/imen-ayari.png",
                  linkedinUrl: "https://www.linkedin.com/in/imen-ayari/",
                  experience: "Head of Innovation Factory chez Talan depuis 2020",
                  education: "Ingénieure ENIT, Master Data Science, Executive MBA",
                  skills: ["Blockchain", "Intelligence Artificielle", "IA Générative", "Réalité Virtuelle", "Design Thinking", "Federated Learning"],
                  bio: "Imen Ayari dirige l'Innovation Factory de Talan, où elle supervise les initiatives d'innovation technologique et d'intelligence artificielle. Experte reconnue en data science et technologies émergentes.",
                  achievements: [
                    "Développement de l'Innovation Factory de Talan",
                    "Lancement de projets d'IA avancée",
                    "Création de partenariats technologiques stratégiques",
                    "Publication de recherches en IA"
                  ],
                  previousRoles: [
                    { company: "Talan", position: "Senior Consultant", duration: "2018-2020" },
                    { company: "Tech Startup", position: "Data Scientist", duration: "2016-2018" }
                  ],
                  bioFile: "imen-ayari",
                  children: []
                },
                {
                  id: "ramzi-khiralah-tunisia",
                  name: "Ramzi Khairallah",
                  fullName: "Ramzi Khairallah",
                  position: "Directeur Data & Analytics",
                  department: "Data & Intelligence",
                  email: "ramzi.khiralah@talan.com",
                  phone: "+33-1-55-37-00-03",
                  location: "Paris, France",
                  photo: "/images/talan/ramzi-khiralah.png",
                  linkedinUrl: "https://www.linkedin.com/in/ramzi-khiralah/",
                  experience: "Directeur Data & Analytics chez Talan depuis 2017",
                  education: "MBA INSEAD, Ingénieur Mines ParisTech",
                  skills: ["Data Science", "Machine Learning", "Analytics", "Big Data", "Python", "R"],
                  bio: "Ramzi Khairallah supervise les initiatives data et analytics de Talan. Il est responsable de l'implémentation des solutions d'intelligence artificielle et d'analyse de données pour les clients du groupe.",
                  achievements: [
                    "Mise en place de la practice Data & Analytics",
                    "Développement de solutions IA avancées",
                    "Leadership dans les projets de transformation data",
                    "Certification en Machine Learning et Big Data"
                  ],
                  previousRoles: [
                    { company: "Accenture", position: "Senior Manager", duration: "2013-2017" },
                    { company: "Deloitte", position: "Manager", duration: "2010-2013" }
                  ],
                  children: []
                },
                {
                  id: "ahmed-sehli-tunisia",
                  name: "Ahmed Sehli",
                  fullName: "Ahmed Sehli",
                  position: "Manager Projets Stratégiques",
                  department: "AI, Tech & Delivery",
                  email: "ahmed.sehli@talan.com",
                  phone: "+33-1-55-37-00-02",
                  location: "Paris, France",
                  photo: "/images/talan/ahmed-sehli.png",
                  linkedinUrl: "https://www.linkedin.com/in/ahmed-sehli/",
                  experience: "Manager Projets Stratégiques chez Talan depuis 2018",
                  education: "PhD Computer Science, Ingénieur Polytechnique",
                  skills: ["Project Management", "Agile", "Scrum", "Strategic Planning", "PMO"],
                  bio: "Ahmed Sehli dirige les projets stratégiques de Talan. Expert en gestion de projets et méthodologies agiles, il supervise la livraison des solutions technologiques les plus complexes pour les clients du groupe.",
                  achievements: [
                    "Management de projets stratégiques majeurs",
                    "Certification PMP et Scrum Master",
                    "Leadership dans la transformation Agile",
                    "Optimisation des processus de delivery"
                  ],
                  previousRoles: [
                    { company: "Amazon Web Services", position: "Solutions Architect", duration: "2015-2018" },
                    { company: "Microsoft", position: "Senior Engineer", duration: "2012-2015" }
                  ],
                  children: []
                },
                {
                  id: "med-amine-issaoui-tunisia",
                  name: "Med Amine Issaoui",
                  fullName: "Mohamed Amine Issaoui",
                  position: "Directeur Pôle Testing & Qualité",
                  department: "Quality Assurance",
                  email: "medamine.issaoui@talan.com",
                  phone: "+216-71-123-457",
                  location: "Tunis, Tunisie",
                  photo: "/images/talan/med-amine-issaoui.png",
                  linkedinUrl: "https://www.linkedin.com/in/med-amine-issaoui/",
                  experience: "Directeur Pôle Testing & Qualité chez Talan depuis 2019",
                  education: "MBA, Ingénieur ENIT",
                  skills: ["Test Automation", "Quality Assurance", "Selenium", "Performance Testing", "DevOps"],
                  bio: "Mohamed Amine Issaoui dirige le pôle Testing & Qualité de Talan. Il supervise l'assurance qualité et les tests automatisés pour garantir l'excellence des livrables du groupe.",
                  achievements: [
                    "Mise en place du centre d'excellence Testing",
                    "Automatisation des processus de test (90%)",
                    "Certification en outils de test avancés",
                    "Amélioration de la qualité logicielle (+95%)"
                  ],
                  previousRoles: [
                    { company: "Capgemini", position: "Senior Consultant", duration: "2016-2019" },
                    { company: "Sopra Steria", position: "Consultant", duration: "2014-2016" }
                  ],
                  children: []
                },
                {
                  id: "ons-mahsni-tunisia",
                  name: "Ons Mahsni",
                  fullName: "Ons Mahsni",
                  position: "Directrice des Ressources Humaines",
                  department: "Ressources Humaines",
                  email: "ons.mahsni@talan.com",
                  phone: "+216-71-123-458",
                  location: "Tunis, Tunisie",
                  photo: "/placeholder.svg?height=200&width=200&text=OM",
                  linkedinUrl: "https://www.linkedin.com/in/ons-mahsni/",
                  experience: "Directrice des Ressources Humaines chez Talan depuis 2018",
                  education: "Master RH, MBA Management",
                  skills: ["Gestion RH", "Recrutement", "Formation", "SIRH", "Talent Management", "Droit Social"],
                  bio: "Ons Mahsni dirige les ressources humaines de Talan. Elle supervise le recrutement, la formation et le développement des talents, contribuant à la croissance et au bien-être des équipes du groupe.",
                  achievements: [
                    "Développement de la stratégie RH du groupe",
                    "Mise en place de programmes de formation innovants",
                    "Optimisation des processus de recrutement",
                    "Leadership dans la transformation digitale RH"
                  ],
                  previousRoles: [
                    { company: "Groupe Poulina", position: "RH Manager", duration: "2015-2018" },
                    { company: "Tunisie Telecom", position: "RH Specialist", duration: "2012-2015" }
                  ],
                  children: []
                }
              ]
            }
          ]
        }
      }
    }
  }

  async getCompanyData(companyName: string, region: string) {
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 2000))

    const normalizedName = companyName.toLowerCase().trim()
    const normalizedRegion = region.toLowerCase().trim()
    
    if (normalizedName.includes('apple')) {
      return this.getAppleData()
    } else if (normalizedName.includes('talan')) {
      // Si la recherche spécifie la Tunisie ou si c'est "talan tunisie"
      if (normalizedName.includes('tunisie') || normalizedRegion.includes('tunisie') || normalizedName.includes('tunisia')) {
        return this.getTalanTunisieData()
      }
      return this.getTalanData()
    }

    // Données par défaut pour d'autres entreprises
    return {
      name: companyName,
      region: region,
      founded: 2000,
      employees: 1000,
      revenue: "€100 millions",
      industry: "Services",
      website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      description: `${companyName} est une entreprise leader dans son secteur, basée en ${region}.`,
      headquarters: region,
      structure: {
        ceo: {
          id: "ceo-default",
          name: "CEO",
          fullName: "Chief Executive Officer",
          position: "Président Directeur Général",
          department: "Direction Générale",
          email: "ceo@company.com",
          phone: "+33-1-00-00-00-00",
          location: region,
          photo: "/placeholder.svg?height=200&width=200&text=CEO",
          linkedinUrl: "https://www.linkedin.com/in/ceo/",
          experience: "Plus de 15 ans d'expérience dans le secteur",
          education: "MBA, École de Commerce",
          skills: ["Leadership", "Stratégie", "Management", "Innovation"],
          bio: "Leader expérimenté avec une vision stratégique pour l'entreprise.",
          achievements: [
            "Croissance significative de l'entreprise",
            "Expansion internationale",
            "Innovation produit"
          ],
          previousRoles: [
            { company: "Entreprise Précédente", position: "Directeur", duration: "2015-2020" }
          ],
          children: [
            {
              id: "cto-default",
              name: "CTO",
              fullName: "Chief Technology Officer",
              position: "Directeur Technique",
              department: "Technologie",
              email: "cto@company.com",
              phone: "+33-1-00-00-00-01",
              location: region,
              photo: "/placeholder.svg?height=200&width=200&text=CTO",
              linkedinUrl: "https://www.linkedin.com/in/cto/",
              experience: "Expert technique avec 12 ans d'expérience",
              education: "Ingénieur, École d'Ingénieurs",
              skills: ["Technologie", "Innovation", "Architecture", "Équipes"],
              bio: "Expert technique responsable de la stratégie technologique.",
              achievements: [
                "Modernisation de l'infrastructure IT",
                "Innovation technologique",
                "Leadership technique"
              ],
              previousRoles: [
                { company: "Tech Company", position: "Architecte", duration: "2018-2022" }
              ],
              children: []
            }
          ]
        }
      }
    }
  }
}
