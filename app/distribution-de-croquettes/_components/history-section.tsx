const DISTRIBUTION_EMAIL = 'distribution@sanscroquettesfixes.fr'

export function HistorySection() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pt-14 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10">
        <div>
          <div className="text-sm text-coral font-semibold mb-2">
            Notre histoire
          </div>
          <h2 className="text-h2 leading-[1.05] tracking-tight font-semibold m-0 text-ink">
            Née pour aider les sans-abris et leurs animaux.
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-[1.6] text-ink-muted m-0">
            L&apos;association Sans Croquettes Fixes a été créée, à l&apos;origine, pour aider les
            sans-abris dans la prise en charge de leurs animaux. Nous avons notamment commencé
            en accompagnant des associations de maraudes. Nous nous rendions toutes les semaines
            dans les rues de Lyon (69) afin de distribuer des plats chauds et de la nourriture
            pour leurs animaux.
          </p>
          <p className="text-sm leading-[1.6] text-ink-muted m-0">
            Avec le temps, nous avons élargi nos actions. Nous continuons toutefois à assurer une
            distribution gratuite de croquettes, pour chiens et pour chats, tous les vendredis.
            Cette distribution se destine à toutes les personnes en situation de précarité. Merci
            de nous contacter à l&apos;adresse{' '}
            <a
              href={`mailto:${DISTRIBUTION_EMAIL}`}
              className="text-coral font-semibold underline underline-offset-2"
            >
              {DISTRIBUTION_EMAIL}
            </a>{' '}
            si vous n&apos;êtes encore jamais venu.
          </p>
        </div>
      </div>
    </section>
  )
}
