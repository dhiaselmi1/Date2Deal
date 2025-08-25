import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate

# 🔐 Auth Gemini
os.environ["GOOGLE_API_KEY"] = "AIzaSyDDNuJYh7Ko-pQmBQIFhvjlRfiiVDGwbrA"  # Replace with your actual key

# 📄 Load .md document directly
print("📄 Chargement des documents...")
try:
    loader = TextLoader("data/rapport_final_Imen_Ayari_20250731_095306 (1).md", encoding='utf-8')
    docs = loader.load()
    print(f"✅ {len(docs)} documents chargés")
except FileNotFoundError:
    print("❌ Fichier non trouvé ! Vérifiez le chemin du fichier")
    exit()
except Exception as e:
    print(f"❌ Erreur lors du chargement du fichier : {e}")
    exit()

# ✂️ Split documents into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
split_docs = splitter.split_documents(docs)

# 🔎 Embeddings + FAISS
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(split_docs, embeddings)

# 🧠 Gemini LLM
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", temperature=0.3)

# 🔄 Retriever
retriever = vectorstore.as_retriever()

# 📝 French prompt templates
CAREER_PROMPT = """
Vous êtes un assistant en développement commercial préparant un email ou un message LinkedIn personnalisé.
Utilisez le CONTEXTE suivant pour générer un message professionnel axé sur la CARRIÈRE de la personne.

CONTEXTE :
{context}

INSTRUCTIONS :
- Concentrez-vous sur leur parcours professionnel, leurs réalisations et leur expertise
- Mentionnez des rôles spécifiques, des entreprises ou des progressions de carrière
- Faites référence à leur expérience et leur formation
- Utilisez leur nom si disponible
- Soyez amical et professionnel
- Limitez à 180 mots
- Terminez par un appel à l'action pour planifier une rencontre

Retournez uniquement le corps du message.
"""

PROJECTS_PROMPT = """
Vous êtes un assistant en développement commercial préparant un email ou un message LinkedIn personnalisé.
Utilisez le CONTEXTE suivant pour générer un message professionnel axé sur les PROJETS de la personne.

CONTEXTE :
{context}

INSTRUCTIONS :
- Concentrez-vous sur les projets spécifiques, les travaux techniques ou les initiatives mentionnées
- Mettez en avant les technologies, méthodologies ou innovations utilisées
- Mentionnez les résultats mesurables ou l'impact commercial
- Utilisez leur nom si disponible
- Soyez amical et professionnel
- Limitez à 180 mots
- Terminez par un appel à l'action pour planifier une rencontre

Retournez uniquement le corps du message.
"""

SENTIMENT_PROMPT = """
Vous êtes un assistant en développement commercial préparant un email ou un message LinkedIn personnalisé.
Utilisez le CONTEXTE suivant pour générer un message professionnel axé sur les VALEURS/INTÉRÊTS de la personne.

CONTEXTE :
{context}

INSTRUCTIONS :
- Concentrez-vous sur leurs intérêts, valeurs et motivations personnelles
- Faites référence à leurs perspectives sur l'industrie ou leur leadership intellectuel
- Créez une connexion émotionnelle via des valeurs partagées
- Utilisez leur nom si disponible
- Soyez amical et professionnel
- Limitez à 180 mots
- Terminez par un appel à l'action pour planifier une rencontre

Retournez uniquement le corps du message.
"""

RECENT_POSTS_PROMPT = """
Vous êtes un assistant en développement commercial préparant un message LinkedIn personnalisé.
Utilisez le CONTEXTE suivant pour générer un message professionnel axé sur les PUBLICATIONS RÉCENTES/ACTIVITÉS de la personne.

CONTEXTE :
{context}

INSTRUCTIONS :
- Concentrez-vous sur leurs publications récentes, activités sur les réseaux sociaux ou contenu récent
- Mentionnez des sujets, idées ou perspectives spécifiques qu'ils ont partagés
- Faites référence à des mises à jour professionnelles ou annonces récentes
- Montrez que vous suivez leur leadership intellectuel
- Reliez leur activité récente à une collaboration potentielle
- Utilisez leur nom si disponible
- Soyez amical et professionnel
- Limitez à 180 mots
- Terminez par un appel à l'action pour planifier une rencontre

Retournez uniquement le corps du message.
"""

CRITICAL_DATA_PROMPT = """
Vous êtes un assistant en développement commercial préparant un email ou un message LinkedIn personnalisé.
Utilisez le CONTEXTE suivant pour générer un message professionnel abordant les DONNÉES PERSONNELLES et CRITIQUES aussi que les Points d'attention de la personne.

CONTEXTE :
{context}

INSTRUCTIONS :
- Mentionnez de manière respectueuse les données personnelles pertinentes (par exemple, formation, localisation,choix du carriére) sans révéler d'informations sensibles
- Abordez les critiques ou défis mentionnés dans le rapport de manière constructive, en mettant l'accent sur des opportunités d'amélioration
- Reliez les critiques à des solutions ou collaborations potentielles
- Utilisez leur nom si disponible
- Soyez amical, professionnel et sensible à la confidentialité
- Limitez à 180 mots
- Terminez par un appel à l'action pour planifier une rencontre

Retournez uniquement le corps du message.
"""

# 🔍 Function to check for LinkedIn activity
def has_linkedin_activity(docs):
    """Check if the document contains LinkedIn activity with recent posts"""
    for doc in docs:
        content = doc.page_content.lower()
        if "linkedin" in content and ("post" in content or "publication" in content or "activité" in content):
            return True
    return False

# 🎯 Function to generate message based on focus area
def generate_outreach_message(focus_area):
    """Generate personalized outreach message based on focus area"""
    
    # Select prompt template
    if focus_area == "career":
        prompt_template = CAREER_PROMPT
        query = "Générez un email ou message LinkedIn personnalisé axé sur la carrière et l'expérience professionnelle de la personne."
    elif focus_area == "projects":
        prompt_template = PROJECTS_PROMPT
        query = "Générez un email ou message LinkedIn personnalisé axé sur les projets et réalisations techniques de la personne."
    elif focus_area == "sentiment":
        prompt_template = SENTIMENT_PROMPT
        query = "Générez un email ou message LinkedIn personnalisé axé sur les valeurs et intérêts de la personne."
    elif focus_area == "recent_posts":
        prompt_template = RECENT_POSTS_PROMPT
        query = "Générez un message LinkedIn personnalisé axé sur les publications récentes, activités sur les réseaux sociaux et contenu récent de la personne."
    elif focus_area=="critical data":
        prompt_template=CRITICAL_DATA_PROMPT
        query = "Générez un email ou message LinkedIn personnalisé axé sur les données personnelles et critiques de la personne."   
    else:
        raise ValueError("L'axe doit être 'career', 'projects', 'sentiment' ou 'recent_posts'")
    
    # Create prompt
    prompt = PromptTemplate(template=prompt_template, input_variables=["context"])
    
    # Create RAG chain
    rag_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt}
    )
    
    # Generate result
    result = rag_chain.invoke({"query": query})
    
    # Check for LinkedIn activity if focus is recent_posts
    if focus_area == "recent_posts" and has_linkedin_activity(split_docs):
        message_type = "Message LinkedIn"
    else:
        message_type = "Email"
    
    return {"message": result["result"], "type": message_type}

if __name__ == "__main__":
    while True:
        print("\n" + "="*50)
        print("🎯 GÉNÉRATEUR INTERACTIF DE MESSAGES")
        print("="*50)
        print("1. Message axé sur la carrière")
        print("2. Message axé sur les projets")
        print("3. Message axé sur les valeurs/intérêts")
        print("4. Message axé sur les publications récentes")
        print("5. message axé sur les données critiques")
        print("0. Quitter")
        
        choice = input("\n👉 Sélectionnez une option (0-5) : ").strip()
        if choice == "0":
            print("👋 Au revoir !")
            break
        elif choice == "1":
            result = generate_outreach_message("career")
            print(f"\n📨 {result['type']} axé sur la carrière :\n{result['message']}")
        elif choice == "2":
            result = generate_outreach_message("projects")
            print(f"\n📨 {result['type']} axé sur les projets :\n{result['message']}")
        elif choice == "3":
            result = generate_outreach_message("sentiment")
            print(f"\n📨 {result['type']} axé sur les valeurs/intérêts :\n{result['message']}")
        elif choice == "4":
            result = generate_outreach_message("recent_posts")
            print(f"\n📨 {result['type']} axé sur les publications récentes :\n{result['message']}")
        elif choice == "5":
            result = generate_outreach_message("critical data")
            print(f"\n📨 {result['type']} axé sur les données critiques :\n{result['message']}")    
        else:
            print("❌ Option invalide. Veuillez réessayer.")