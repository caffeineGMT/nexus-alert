export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">NEXUS Alert</span>
          <a
            href="https://github.com/caffeineGMT/nexus-alert"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-semibold hover:bg-[#2563eb] transition"
          >
            Install Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#333] text-sm text-[#888] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            Free Chrome Extension
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Never miss a{" "}
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#22c55e] bg-clip-text text-transparent">
              NEXUS appointment
            </span>{" "}
            again
          </h1>
          <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-10">
            NEXUS Alert watches for appointment openings 24/7 and notifies you
            the instant a slot appears — so you can book it before anyone else.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/caffeineGMT/nexus-alert"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl bg-[#3b82f6] text-white font-semibold text-base hover:bg-[#2563eb] transition"
            >
              Add to Chrome — Free
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-xl border border-[#333] text-[#ccc] font-semibold text-base hover:border-[#3b82f6] transition"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Appointment slots disappear in minutes
          </h2>
          <p className="text-[#888] text-center max-w-2xl mx-auto mb-14">
            NEXUS and Global Entry slots are released when someone cancels.
            They show up randomly and get booked almost instantly. Refreshing
            the website over and over is exhausting — and you still miss most
            of them.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <ProblemCard
              icon="clock"
              title="Slots vanish fast"
              description="Cancelled appointments get snapped up within minutes. If you're not looking at the exact right moment, you lose it."
            />
            <ProblemCard
              icon="refresh"
              title="Manual checking is painful"
              description="There's no official notification system. You have to keep refreshing the GOES website yourself, hoping to get lucky."
            />
            <ProblemCard
              icon="calendar"
              title="Wait times are months"
              description="The next available slot might be 3-6 months away. But cancellations create openings much sooner — if you catch them."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">
            How NEXUS Alert works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              title="Pick your locations"
              description="Select which enrollment centers you want to monitor. Choose NEXUS, Global Entry, or SENTRI."
            />
            <StepCard
              step={2}
              title="Set your preferences"
              description="Filter by date range and time of day. Set how often to check — every 1, 3, 5, or 10 minutes."
            />
            <StepCard
              step={3}
              title="Get notified instantly"
              description="When a slot opens, you get a desktop notification with a sound alert. One click takes you straight to booking."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need
          </h2>
          <p className="text-[#888] text-center max-w-xl mx-auto mb-14">
            Built to make sure you never miss another opening.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <FeatureCard
              title="Real-time monitoring"
              description="Checks for new slots as often as every minute, running silently in the background while you work."
            />
            <FeatureCard
              title="Sound alerts"
              description="Hear a chime the moment a slot appears. No need to keep watching — just listen for the notification."
            />
            <FeatureCard
              title="Smart filters"
              description="Only get alerted for dates and times that work for you. Morning slots only? Weekdays? You choose."
            />
            <FeatureCard
              title="Multi-location tracking"
              description="Monitor multiple enrollment centers at once. Find the first available slot across all your preferred locations."
            />
            <FeatureCard
              title="One-click booking"
              description="Jump directly to the GOES booking page from any notification. The faster you act, the better your chances."
            />
            <FeatureCard
              title="Slot history"
              description="See every slot that's appeared over time. Track patterns and know when cancellations are most common."
            />
            <FeatureCard
              title="Auto-open booking"
              description="Optionally have the booking page open automatically when a slot is found. No clicks needed."
            />
            <FeatureCard
              title="Email notifications"
              description="With the optional backend, get email alerts even when your browser is closed. Never miss a slot."
            />
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 px-6 border-t border-[#222]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Works with all programs</h2>
          <p className="text-[#888] max-w-xl mx-auto mb-12">
            Monitor any Trusted Traveler Program managed through the GOES
            system.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ProgramBadge name="NEXUS" description="US-Canada border" />
            <ProgramBadge name="Global Entry" description="US customs fast-track" />
            <ProgramBadge name="SENTRI" description="US-Mexico border" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#222]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Stop refreshing. Start booking.
          </h2>
          <p className="text-[#888] text-lg mb-10">
            Install NEXUS Alert and let it watch for openings while you live
            your life. Completely free, no account needed.
          </p>
          <a
            href="https://github.com/caffeineGMT/nexus-alert"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-xl bg-[#3b82f6] text-white font-semibold text-lg hover:bg-[#2563eb] transition"
          >
            Install NEXUS Alert — Free
          </a>
          <p className="text-[#555] text-sm mt-6">
            Works on Chrome, Edge, Brave, and all Chromium browsers.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#222] text-center text-sm text-[#555]">
        <p>
          NEXUS Alert is free and open source. Not affiliated with CBP or DHS.
        </p>
        <p className="mt-2">
          <a
            href="https://github.com/caffeineGMT/nexus-alert"
            className="text-[#888] hover:text-[#3b82f6] transition"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

function ProblemCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const icons: Record<string, string> = {
    clock: "M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z",
    refresh:
      "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    calendar:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  };
  return (
    <div className="p-6 rounded-xl border border-[#222] bg-[#111]">
      <svg
        className="w-8 h-8 text-[#ef4444] mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={icons[icon]} />
      </svg>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[#888] text-sm">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[#888] text-sm">{description}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-[#222] bg-[#111] hover:border-[#3b82f6] transition">
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-[#888] text-sm">{description}</p>
    </div>
  );
}

function ProgramBadge({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="px-6 py-4 rounded-xl border border-[#222] bg-[#111] min-w-[180px]">
      <div className="font-bold text-lg">{name}</div>
      <div className="text-[#888] text-sm">{description}</div>
    </div>
  );
}
