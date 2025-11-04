import { useMemo, useState } from "react";
import API from "../services/api"; 
import {
  FaMapMarkerAlt,
  FaPlane,
  FaDollarSign,
  FaClock,
  FaSearch,
  FaUsers,
  FaCalendarAlt,
  FaBolt,
  FaShieldAlt,
  FaGlobe,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaSun,
  FaMoon,
} from "react-icons/fa";


export default function Home() {
  const [dark, setDark] = useState(false);
  const [showPlanner, setShowPlanner] = useState(true);
  const [destination, setDestination] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(800);
  const [faqOpen, setFaqOpen] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [plannerStep, setPlannerStep] = useState(1);


  const interestsList = [
    "Adventure","Beaches","Culture","Food","Shopping","Nature",
    "History","Nightlife","Wellness","Photography","Family","Romance",
    "Budget","Luxury","Solo","Business"
  ];
  const allDestinations = useMemo(
    () => ["Paris","Bali","Tokyo","New York","Dubai","Singapore","London","Bangkok","Istanbul","Rome","Phuket","Barcelona","Goa","Jaipur","Manali","Kerala"],
    []
  );

  const filteredSuggestions = useMemo(() => {
    if (!destination.trim()) return [];
    return allDestinations.filter((d) => d.toLowerCase().includes(destination.toLowerCase())).slice(0, 8);
  }, [destination, allDestinations]);

  const features = [
    { icon: FaPlane, title: "AI Trip Planning", desc: "Personalized, day-wise itineraries aligned to your vibe." },
    { icon: FaMapMarkerAlt, title: "Multi-destination", desc: "Chain cities and optimize routes with ease." },
    { icon: FaDollarSign, title: "Budget Friendly", desc: "Plans tuned to stay within your budget." },
    { icon: FaClock, title: "Time Saver", desc: "Generate complete plans instantly." },
    { icon: FaShieldAlt, title: "Trust & Safety", desc: "Built-in tips and safety notes for each stop." },
    { icon: FaGlobe, title: "Global Coverage", desc: "From city breaks to nature getaways worldwide." },
  ];

  const stats = [
    { value: "80+", label: "Destinations" },
    { value: "25k+", label: "Trips Planned" },
    { value: "98%", label: "Satisfaction" },
    { value: "2s", label: "Avg Gen Time" },
  ];

  const popularDestinations = [
    { name: "Paris", img: "/images/Paris.jpg", tag: "Romance" },
    { name: "Bali", img: "/images/Bali.jpg", tag: "Beaches" },
    { name: "Tokyo", img: "/images/Tokyo.jpg", tag: "Culture" },
    { name: "New York", img: "/images/New York.jpg", tag: "City Life" },
    { name: "Dubai", img: "/images/Dubai.jpg", tag: "Luxury" },
    { name: "Goa", img: "/images/Goa.jpg", tag: "Coastal" },
  ];

  const steps = [
    { icon: FaSearch, title: "Tell preferences", desc: "Destinations, dates, budget, interests." },
    { icon: FaBolt, title: "AI generates", desc: "Smart, day-wise plans with travel times." },
    { icon: FaCheckCircle, title: "Customize & go", desc: "Edit stops, lock must-dos, export." },
  ];

  const testimonials = [
    { name: "Aarav", role: "Backpacker", text: "Got a 5-day Bali plan with perfect pacing, cafes, and waterfalls—zero stress.", rating: 5 },
    { name: "Priya", role: "Solo Traveler", text: "Tokyo itinerary balanced food, culture, and hidden gems in neighborhoods I’d never reach.", rating: 5 },
    { name: "Rohit", role: "Weekend Explorer", text: "Plugged in budget and time, got routes that actually saved commute and money.", rating: 4 },
  ];

  const faqs = [
    { q: "How accurate are the itineraries?", a: "Plans combine heuristics with real-world travel pacing and can be edited anytime." },
    { q: "Can I plan multi-city routes?", a: "Yes, add multiple cities and the planner sequences them to minimize travel time." },
    { q: "Is there an offline option?", a: "Export to PDF and share with your group for offline access." },
  ];


const handleSubmit = async () => {
  console.log("🟡 Starting AI trip generation...");

  const data = {
    destination,
    startDate,
    endDate,
    travelers: Number(travelers),
    budget: Number(budget),
    interests: selectedInterests,
  };

  console.log("📦 Sending data:", data);

  try {
    const response = await API.post("/trip/generate", data);
    console.log("🟢 API Response:", response.data);

    localStorage.setItem("tripPlan", JSON.stringify(response.data));
    alert("🤖 AI Trip Plan Generated! Redirecting...");
    window.location.href = "/plan";
  } catch (error) {
    console.error("🔴 API Error:", error);
    alert("Error generating trip plan: " + error.message);
  }
};


  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border-b border-white/20 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaPlane className="text-blue-600 dark:text-indigo-400" />
              <span className="font-semibold tracking-tight">TripGenie</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#destinations" className="hover:text-blue-600 transition-colors">Destinations</a>
              <a href="#how" className="hover:text-blue-600 transition-colors">How it works</a>
              <a href="#faqs" className="hover:text-blue-600 transition-colors">FAQs</a>
            </nav>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDark((v) => !v)}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                aria-label="Toggle theme"
              >
                {dark ? <FaSun /> : <FaMoon />}
              </button>
              <a
                href="#planner"
                className="hidden sm:inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition"
              >
                Start Planning
              </a>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Aura blobs */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="w-96 h-96 bg-sky-400/25 dark:bg-indigo-500/20 blur-3xl rounded-full absolute -top-10 -left-10" />
            <div className="w-96 h-96 bg-fuchsia-400/25 dark:bg-fuchsia-500/20 blur-3xl rounded-full absolute bottom-0 right-0" />
          </div>

          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600">
                Plan your perfect trip with AI
              </span>
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Adventure, food, nature, and more in a few clicks with itineraries tailored to your time and budget.
            </p>

            {/* Planner Card */}
<div id="planner" className="mt-10 mx-auto max-w-4xl">
  {showPlanner ? (
    <div className="relative rounded-[28px] border border-white/40 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl shadow-2xl">
      {/* Gradient edge */}
      <div className="absolute -inset-[1px] rounded-[28px] pointer-events-none bg-gradient-to-br from-white/10 to-black/5 dark:from-white/5" />
      <div className="relative p-0">
        {/* Stepper header */}
        <div className="px-6 pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">Plan your trip</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded-full ${plannerStep === 1 ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 dark:bg-indigo-900/40 dark:text-indigo-300"}`}>1. Basics</span>
              <span className={`px-2 py-1 rounded-full ${plannerStep === 2 ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 dark:bg-indigo-900/40 dark:text-indigo-300"}`}>2. Interests</span>
              <span className={`px-2 py-1 rounded-full ${plannerStep === 3 ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 dark:bg-indigo-900/40 dark:text-indigo-300"}`}>3. Review</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 rounded-full bg-gray-100 dark:bg-slate-900/60 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ${plannerStep === 1 ? "w-1/3" : plannerStep === 2 ? "w-2/3" : "w-full"}`}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {plannerStep === 1 && (
            <div className="space-y-6">
              {/* Grid: Destination (6) | Start (3) | End (3) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <label className="text-xs mb-1 block">Destination</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => { setDestination(e.target.value); setSuggestOpen(true); }}
                      onFocus={() => setSuggestOpen(true)}
                      onBlur={() => setTimeout(() => setSuggestOpen(false), 120)}
                      placeholder="e.g., Tokyo"
                      className="w-full rounded-[14px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-10 py-3 outline-none focus:ring-2 ring-blue-500"
                    />
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    {suggestOpen && filteredSuggestions.length > 0 && (
                      <ul className="absolute z-20 mt-2 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
                        {filteredSuggestions.map((s) => (
                          <li
                            key={s}
                            onMouseDown={() => { setDestination(s); setSuggestOpen(false); }}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs mb-1 block">Start date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-[14px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-10 py-3 outline-none focus:ring-2 ring-blue-500"
                    />
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs mb-1 block">End date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-[14px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-10 py-3 outline-none focus:ring-2 ring-blue-500"
                    />
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Grid: Travelers (3) | Budget (9) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3">
                  <label className="text-xs mb-1 block">Travelers</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={travelers}
                      onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-[14px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-10 py-3 outline-none focus:ring-2 ring-blue-500"
                    />
                    <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="md:col-span-9">
                  <label className="text-xs mb-1 block">Budget (₹)</label>
                  <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                    <input
                      type="range"
                      min={200}
                      max={3000}
                      step={50}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                      <span>₹200</span>
                      <span className="text-sm font-semibold">Approx: ₹{budget} per person</span>
                      <span>₹3000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setPlannerStep(2)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {plannerStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Pick your interests</label>
                <div className="flex flex-wrap gap-2">
                  {interestsList.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() =>
                        setSelectedInterests((prev) =>
                          prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
                        )
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedInterests.includes(interest)
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      {interest}{selectedInterests.includes(interest) ? " ✓" : ""}
                    </button>
                  ))}
                </div>
                {selectedInterests.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">Selected: {selectedInterests.join(", ")}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setPlannerStep(1)}
                  className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 border dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setPlannerStep(3)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {plannerStep === 3 && (
            <div className="space-y-6">
              {/* Review summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-4">
                  <div className="text-xs text-gray-500">Destination</div>
                  <div className="font-semibold">{destination || "—"}</div>
                </div>
                <div className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-4">
                  <div className="text-xs text-gray-500">Dates</div>
                  <div className="font-semibold">{startDate || "—"} → {endDate || "—"}</div>
                </div>
                <div className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-4">
                  <div className="text-xs text-gray-500">Travelers</div>
                  <div className="font-semibold">{travelers}</div>
                </div>
                <div className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-4">
                  <div className="text-xs text-gray-500">Budget (pp)</div>
                  <div className="font-semibold">₹{budget}</div>
                </div>
              </div>

              {selectedInterests.length > 0 && (
                <div className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-4">
                  <div className="text-xs text-gray-500 mb-2">Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setPlannerStep(2)}
                  className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 border dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl transition-transform active:scale-[0.98] flex items-center gap-2"
                >
                  <FaSearch /> Generate Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <button
      onClick={() => setShowPlanner(true)}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl shadow-xl"
    >
      Start Trip Plan
    </button>
  )}
</div>



            {/* Stats Bento */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    {s.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center">Why choose our planner</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            Built with conversion-focused sections like hero, features, stats, testimonials, and FAQs for clarity and trust.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                <f.icon className="text-3xl text-blue-600 dark:text-indigo-400 mb-3" />
                <h3 className="text-xl font-semibold mb-1">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2"><FaShieldAlt /> Trusted by travelers</div>
            <div className="flex items-center gap-2"><FaBolt /> Fast results</div>
            <div className="flex items-center gap-2"><FaGlobe /> Global coverage</div>
          </div>
        </section>

        {/* Destinations */}
        <section id="destinations" className="py-16 px-4 bg-gray-50 dark:bg-slate-950/40">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center">Popular destinations</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mt-2">Tap a card to prefill the planner with a city.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularDestinations.map((d) => (
                <button
                  key={d.name}
                  onClick={() => setDestination(d.name)}
                  className="text-left bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  <img src={d.img} alt={d.name} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{d.name}</h4>
                      <span className="text-xs bg-blue-100 text-blue-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-1 rounded-full">
                        {d.tag}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Quick-start an itinerary with local highlights.</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center">How it works</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm"
              >
                <s.icon className="text-3xl text-blue-600 dark:text-indigo-400 mb-3" />
                <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-slate-950/40">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center">What travelers say</h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
                  <div className="flex items-center gap-1 text-yellow-400 mb-2">
                    {Array.from({ length: t.rating }).map((_, idx) => <FaStar key={idx} />)}
                  </div>
                  <p className="text-gray-700 dark:text-gray-200">{t.text}</p>
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">— {t.name}, {t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="py-16 px-4 bg-gray-50 dark:bg-slate-950/40">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center">FAQs</h2>
            <div className="mt-8 space-y-3">
              {faqs.map((f, i) => (
                <div key={f.q} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl">
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3">
                    <span className="text-left font-medium">{f.q}</span>
                    {faqOpen === i ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {faqOpen === i && <div className="px-4 pb-4 text-gray-600 dark:text-gray-300">{f.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FaPlane className="text-blue-600 dark:text-indigo-400" />
              <span className="font-semibold">TripGenie</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} TripGenie. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
