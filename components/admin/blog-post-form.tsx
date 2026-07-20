'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Link2, ImageIcon, Quote, Code, Minus, Sparkles, Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import SubmitButton from '@/components/admin/submit-button'
import { useServerFormAction } from '@/lib/hooks/use-server-form-action'
import { AD } from '@/lib/admin-tokens'

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type MarkdownAction =
  | { type: 'wrap'; before: string; after: string }
  | { type: 'prefix'; prefix: string }

const MD_ACTIONS: { label: string; icon: React.ElementType; action: MarkdownAction }[] = [
  { label: 'Gras',        icon: Bold,        action: { type: 'wrap', before: '**', after: '**' } },
  { label: 'Italique',    icon: Italic,      action: { type: 'wrap', before: '_', after: '_' } },
  { label: 'Titre H2',    icon: Heading2,    action: { type: 'prefix', prefix: '## ' } },
  { label: 'Titre H3',    icon: Heading3,    action: { type: 'prefix', prefix: '### ' } },
  { label: 'Liste',       icon: List,        action: { type: 'prefix', prefix: '- ' } },
  { label: 'Liste num.',  icon: ListOrdered, action: { type: 'prefix', prefix: '1. ' } },
  { label: 'Citation',    icon: Quote,       action: { type: 'prefix', prefix: '> ' } },
  { label: 'Code',        icon: Code,        action: { type: 'wrap', before: '`', after: '`' } },
  { label: 'Lien',        icon: Link2,       action: { type: 'wrap', before: '[', after: '](url)' } },
  { label: 'Image',       icon: ImageIcon,   action: { type: 'wrap', before: '![alt](', after: ')' } },
  { label: 'Séparateur',  icon: Minus,       action: { type: 'prefix', prefix: '\n---\n' } },
]

function applyMarkdown(
  textarea: HTMLTextAreaElement,
  action: MarkdownAction,
  setContent: (v: string) => void,
) {
  const { selectionStart: start, selectionEnd: end, value } = textarea
  const selected = value.slice(start, end)

  let newText: string
  let cursorPos: number

  if (action.type === 'wrap') {
    newText = value.slice(0, start) + action.before + selected + action.after + value.slice(end)
    cursorPos = selected.length > 0
      ? start + action.before.length + selected.length + action.after.length
      : start + action.before.length
  } else {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    newText = value.slice(0, lineStart) + action.prefix + value.slice(lineStart)
    cursorPos = start + action.prefix.length
  }

  setContent(newText)
  requestAnimationFrame(() => {
    textarea.focus()
    textarea.setSelectionRange(cursorPos, cursorPos)
  })
}

interface BlogPostFormData {
  title?: string
  slug?: string
  content?: string
  excerpt?: string | null
  author_name?: string | null
  published_date?: string | null
  coverUrl?: string | null
}

interface BlogPostFormProps {
  defaultValues?: BlogPostFormData
  action: (formData: FormData) => Promise<void>
}

export default function BlogPostForm({ defaultValues = {}, action }: BlogPostFormProps) {
  const { error, isPending, handleSubmit } = useServerFormAction(action)
  const [title, setTitle] = useState(defaultValues.title ?? '')
  const [slug, setSlug] = useState(defaultValues.slug ?? '')
  const slugTouched = useRef(!!defaultValues.slug)
  const [coverPreview, setCoverPreview] = useState<string | null>(defaultValues.coverUrl ?? null)
  const [content, setContent] = useState(defaultValues.content ?? '')
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiInstructions, setAiInstructions] = useState('')

  const handleToolbarAction = useCallback((mdAction: MarkdownAction) => {
    if (contentRef.current) {
      applyMarkdown(contentRef.current, mdAction, setContent)
    }
  }, [])

  async function handleGenerate() {
    if (!title.trim()) {
      setAiError('Saisis un titre avant de générer.')
      return
    }
    setAiLoading(true)
    setAiError(null)
    setContent('')
    try {
      const res = await fetch('/api/ai/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          excerpt: (document.getElementById('excerpt') as HTMLTextAreaElement)?.value?.trim() || undefined,
          instructions: aiInstructions.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Erreur ${res.status}`)
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue
          const payload = trimmed.slice(6)
          if (payload === '[DONE]') continue
          try {
            const { token } = JSON.parse(payload)
            if (token) {
              accumulated += token
              setContent(accumulated)
            }
          } catch {
            // skip
          }
        }
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Erreur lors de la génération')
    } finally {
      setAiLoading(false)
    }
  }

  useEffect(() => {
    if (!slugTouched.current) {
      setSlug(slugify(title))
    }
  }, [title])

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    slugTouched.current = true
    setSlug(e.target.value)
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Titre</FieldLabel>
          <Input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Comment nourrir votre chaton"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug (URL)</FieldLabel>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={handleSlugChange}
            placeholder="comment-nourrir-votre-chaton"
            style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', fontSize: 13 }}
          />
          <p style={{ fontSize: 11, color: AD.inkMuted, marginTop: 4 }}>
            Auto-généré depuis le titre. Modifiable manuellement.
          </p>
        </Field>

        <Field>
          <FieldLabel htmlFor="excerpt">Extrait</FieldLabel>
          <Textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={defaultValues.excerpt ?? ''}
            placeholder="Court résumé affiché dans la liste des articles..."
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field>
            <FieldLabel htmlFor="author_name">Auteur</FieldLabel>
            <Input
              id="author_name"
              name="author_name"
              defaultValue={defaultValues.author_name ?? 'Sans Croquettes Fixes'}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="published_date">Date de publication</FieldLabel>
            <Input
              id="published_date"
              name="published_date"
              type="date"
              defaultValue={defaultValues.published_date ?? ''}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="cover">Image de couverture</FieldLabel>
          {coverPreview && (
            <div style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden', position: 'relative', width: '100%', aspectRatio: '16/9', maxWidth: 400 }}>
              <Image
                src={coverPreview}
                alt="Aperçu couverture"
                fill
                unoptimized
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <Input
            id="cover"
            name="cover"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="content">Contenu (Markdown)</FieldLabel>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end',
              marginBottom: 8,
              padding: '10px 12px',
              background: 'linear-gradient(135deg, rgba(247,108,112,0.06) 0%, rgba(232,74,119,0.06) 100%)',
              border: `1px solid ${AD.border}`,
              borderRadius: 8,
            }}
          >
            <div style={{ flex: 1 }}>
              <label
                htmlFor="ai_instructions"
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: AD.ink, marginBottom: 4 }}
              >
                <Sparkles size={12} style={{ color: '#F76C70' }} />
                Instructions CroketAI
              </label>
              <Textarea
                id="ai_instructions"
                rows={2}
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                placeholder="Ex: Fais 3 parties, mentionne les croquettes Royal Canin, ton humoristique..."
                style={{ fontSize: 12.5, lineHeight: 1.5, resize: 'none' }}
              />
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={aiLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 6,
                border: 'none',
                background: 'linear-gradient(135deg, #F76C70 0%, #E84A77 100%)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: aiLoading ? 'wait' : 'pointer',
                opacity: aiLoading ? 0.7 : 1,
                transition: 'opacity 0.15s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
              {aiLoading ? 'Génération...' : 'Générer'}
            </button>
          </div>
          {aiError && (
            <p style={{ fontSize: 12, color: '#B43A3F', marginBottom: 6 }}>{aiError}</p>
          )}
          <div style={{ border: `1px solid ${AD.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                padding: '6px 8px',
                background: AD.surfaceAlt,
                borderBottom: `1px solid ${AD.border}`,
              }}
            >
              {MD_ACTIONS.map(({ label, icon: Icon, action: mdAction }) => (
                <button
                  key={label}
                  type="button"
                  title={label}
                  onClick={() => handleToolbarAction(mdAction)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 30,
                    height: 28,
                    border: 'none',
                    borderRadius: 4,
                    background: 'transparent',
                    color: AD.inkMuted,
                    cursor: 'pointer',
                    transition: 'background 0.1s, color 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = AD.border
                    e.currentTarget.style.color = AD.ink
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = AD.inkMuted
                  }}
                >
                  <Icon size={15} strokeWidth={2} />
                </button>
              ))}
            </div>
            <Textarea
              ref={contentRef}
              id="content"
              name="content"
              required
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"# Mon article\n\nÉcrivez votre contenu en **Markdown**...\n\n## Sous-titre\n\nTexte, listes, liens, images..."}
              style={{
                fontFamily: 'Geist Mono, ui-monospace, monospace',
                fontSize: 13,
                lineHeight: 1.6,
                border: 'none',
                borderRadius: 0,
                resize: 'vertical',
              }}
            />
          </div>
          <p style={{ fontSize: 11, color: AD.inkMuted, marginTop: 4 }}>
            Sélectionnez du texte puis cliquez un bouton pour appliquer le formatage.
          </p>
        </Field>

        <FormError message={error} />
        <SubmitButton label="Enregistrer" pending={isPending} />
      </FieldGroup>
    </form>
  )
}
