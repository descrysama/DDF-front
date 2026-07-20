import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, isAdmin } from '@/lib/auth'

const AZURE_ENDPOINT = process.env.AZURE_AI_ENDPOINT ?? ''
const AZURE_API_KEY = process.env.AZURE_AI_API_KEY ?? ''

const SYSTEM_PROMPT = `Tu es le rédacteur du blog de Sans Croquettes Fixes, un refuge pour chats situé à Lyon.
Tu rédiges des articles chaleureux, informatifs et accessibles pour les amoureux des chats.

Règles :
- Écris en markdown propre (titres ##, listes, gras pour les points importants)
- Ton naturel et bienveillant, comme un bénévole passionné qui parle à sa communauté
- Pas de ton corporate ni de formules trop lisses type IA
- Utilise des anecdotes concrètes du quotidien en refuge quand c'est pertinent
- Tutoie le lecteur
- Structure bien l'article avec des sous-titres clairs
- Termine par un petit mot d'encouragement ou un appel à l'action (adopter, devenir bénévole, partager)
- Ne commence JAMAIS par "Bienvenue" ou "Dans cet article"
- Longueur : environ 600-900 mots`

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { title, slug, excerpt } = await req.json()
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Titre requis' }, { status: 400 })
  }

  if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
    return NextResponse.json({ error: 'Configuration Azure manquante' }, { status: 500 })
  }

  const url = 'https://little-ai-test.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview'

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AZURE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-5.4-2',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: [
          `Rédige un article de blog avec le titre suivant : "${title}"`,
          slug ? `Le slug de l'article est : ${slug}` : '',
          excerpt ? `Voici le brief / résumé souhaité pour orienter le contenu :\n"${excerpt}"` : '',
        ].filter(Boolean).join('\n\n') },
      ],
      temperature: 0.7,
      max_completion_tokens: 2000,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Azure AI Foundry error:', res.status, err)
    return NextResponse.json({ error: `Erreur IA: ${res.status}` }, { status: 502 })
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? ''

  return NextResponse.json({ content })
}
