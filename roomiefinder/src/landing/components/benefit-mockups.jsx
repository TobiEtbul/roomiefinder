function Card({ children }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-2xl bg-cream p-5 text-brown shadow-xl">
      {children}
    </div>
  );
}

export function MatchMock() {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream bg-orange font-display text-sm font-bold text-white">
            T
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream bg-navy font-display text-sm font-bold text-cream">
            G
          </span>
        </div>
        <div>
          <div className="font-display text-sm font-bold text-navy">Compatibilidad</div>
          <div className="text-xs text-brown/60">Tomi &amp; Geri</div>
        </div>
        <span className="ml-auto font-display text-2xl font-extrabold text-orange">100%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-navy/10">
        <div className="h-full rounded-full bg-orange" style={{ width: "100%" }} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["Mismos horarios", "No fuma", "Ordenada"].map((t) => (
          <span key={t} className="rounded-full bg-navy/8 px-2.5 py-1 text-xs text-navy">
            {t}
          </span>
        ))}
      </div>
    </Card>
  );
}

export function FiltersMock() {
  return (
    <Card>
      <div className="flex flex-wrap gap-1.5">
        {["Palermo", "Hasta $300k", "2 ambientes"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-navy/15 bg-cream px-2.5 py-1 text-xs font-medium text-navy"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="relative h-28 overflow-hidden rounded-xl bg-navy/10">
        <div className="absolute -left-6 top-4 h-20 w-28 rounded-full bg-navy/10" />
        <div className="absolute bottom-3 right-8 h-16 w-24 rounded-full bg-orange/15" />
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange ring-4 ring-orange/25" />
      </div>
      <div className="text-xs font-medium text-brown/70">24 lugares en tu zona</div>
    </Card>
  );
}

export function ForumMock() {
  return (
    <Card>
      <div className="h-24 rounded-xl bg-gradient-to-br from-orange/40 to-navy/30" />
      <div className="flex items-end justify-between">
        <div>
          <div className="font-display text-lg font-extrabold text-navy">$285.000</div>
          <div className="text-xs text-brown/60">Palermo · 2 amb · Luminoso</div>
        </div>
        <span className="rounded-full bg-orange px-3 py-1.5 text-xs font-semibold text-white">
          Postularme
        </span>
      </div>
    </Card>
  );
}

export function ChatMock() {
  return (
    <Card>
      <div className="flex flex-col gap-2 text-xs">
        <span className="max-w-[75%] self-start rounded-2xl rounded-bl-sm bg-navy/10 px-3 py-2 text-navy">
          ¡Hola! Vi tu aviso de Palermo
        </span>
        <span className="max-w-[75%] self-end rounded-2xl rounded-br-sm bg-orange px-3 py-2 text-white">
          Buenísimo, ¿cuándo la ves?
        </span>
        <span className="max-w-[75%] self-start rounded-2xl rounded-bl-sm bg-navy/10 px-3 py-2 text-navy">
          Mañana 18h me queda 👌
        </span>
        <span className="flex gap-1 self-start rounded-full bg-navy/10 px-3 py-2">
          <i className="h-1.5 w-1.5 rounded-full bg-navy/40" />
          <i className="h-1.5 w-1.5 rounded-full bg-navy/40" />
          <i className="h-1.5 w-1.5 rounded-full bg-navy/40" />
        </span>
      </div>
    </Card>
  );
}

export const MOCKS = [MatchMock, FiltersMock, ForumMock, ChatMock];
