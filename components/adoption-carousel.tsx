"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Home as HomeIcon, Stethoscope } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Liste des chats à afficher dans le carrousel.
// Ces données seront remplacées par des données Strapi à terme.
const CATS = [1, 2, 3]

export function AdoptionCarousel() {
  // Index de la card actuellement visible (0 = premier chat)
  const [index, setIndex] = useState(0)

  // Navigue vers la card précédente (boucle sur le dernier si on est au début)
  const prev = () => setIndex((i) => (i - 1 + CATS.length) % CATS.length)

  // Navigue vers la card suivante (boucle sur le premier si on est à la fin)
  const next = () => setIndex((i) => (i + 1) % CATS.length)

  return (
    <div className="relative">
      {/*
        Conteneur principal du carrousel.
        - overflow-x-hidden  → masque les cards hors écran à gauche/droite
        - pt-3               → espace vertical pour que l'animation hover de
                               la Card (translateY) ne soit pas coupée en haut
        - pb-1               → idem côté bas
      */}
      <div className="relative overflow-x-hidden pt-3 pb-1">

        {/* Fondu gauche : simule un effet de flou/profondeur sur le bord gauche */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-white to-transparent" />

        {/* Fondu droite : idem pour le bord droit */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-white to-transparent" />

        {/*
          Track du carrousel.
          Chaque slide occupe 100% de la largeur du conteneur.
          On translate le track de -index * 100% pour centrer la bonne slide.
          La transition CSS assure l'animation fluide.
        */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {CATS.map((i) => (
            /*
              Chaque slide = 100% de largeur, avec un padding horizontal (px-10)
              pour que la card soit plus étroite que le conteneur.
              L'effet visuel : on aperçoit les bords des cards adjacentes
              derrière les fondus gauche/droite.
            */
            <div key={i} className="flex-none w-full px-10">
              <Card className="overflow-hidden">

                {/* Image placeholder — sera remplacée par une vraie photo depuis Strapi */}
                <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/30 relative">
                  {/* Badge statut (Adulte / Chaton / etc.) */}
                  <div className="absolute top-3 left-3 bg-primary text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                    Adulte
                  </div>
                </div>

                {/* Nom et description courts du chat */}
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-sm">Chat {i}</CardTitle>
                  <CardDescription className="text-xs">Description à venir depuis Strapi</CardDescription>
                </CardHeader>

                {/* Caractéristiques clés du chat */}
                <CardContent className="pt-0">
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <HomeIcon className="w-3 h-3 text-primary shrink-0" />
                      <span>Habitué à l&apos;appartement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-3 h-3 text-primary shrink-0" />
                      <span>Vacciné, stérilisé</span>
                    </div>
                  </div>
                </CardContent>

              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Barre de navigation : flèche gauche — dots — flèche droite */}
      <div className="flex items-center justify-between mt-3 px-1">

        {/* Bouton "précédent" */}
        <button
          onClick={prev}
          className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Chat précédent"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        {/*
          Dots de pagination.
          Le dot actif s'élargit (w-5) et prend la couleur primaire.
        */}
        <div className="flex gap-1.5 items-center">
          {CATS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-primary w-5" : "bg-gray-300 w-2"
              }`}
              aria-label={`Chat ${i + 1}`}
            />
          ))}
        </div>

        {/* Bouton "suivant" */}
        <button
          onClick={next}
          className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Chat suivant"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>

      </div>
    </div>
  )
}
