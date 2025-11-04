// src/Home.jsx (updated)
import { useMemo, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
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
import PlannerPremium from "../components/PlannerPremium.jsx";
import Loader from "../components/Loader.jsx"; // ✅ Import Loader

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
  const [loading, setLoading] = useState(false); // ✅ Loading state add kiya
  const navigate = useNavigate();

  const interestsList = [
    "Adventure", "Beaches", "Culture", "Food", "Shopping", "Nature",
    "History", "Nightlife", "Wellness", "Photography", "Family", "Romance",
    "Budget", "Luxury", "Solo", "Business"
  ];
  
  const allDestinations = useMemo(
    () => ["Paris", "Bali", "Tokyo", "New York", "Dubai", "Singapore", "London", "Bangkok", "Istanbul", "Rome", "Phuket", "Barcelona", "Goa", "Jaipur", "Manali", "Kerala"],
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
    { name: "Priya", role: "Solo Traveler", text: "Tokyo itinerary balanced food, culture, and hidden gems in neighborhoods I'd never reach.", rating: 5 },
    { name: "Rohit", role: "Weekend Explorer", text: "Plugged in budget and time, got routes that actually saved commute and money.", rating: 4 },
  ];

  const faqs = [
    { q: "How accurate are the itineraries?", a: "Plans combine heuristics with real-world travel pacing and can be edited anytime." },
    { q: "Can I plan multi-city routes?", a: "Yes, add multiple cities and the planner sequences them to minimize travel time." },
    { q: "Is there an offline option?", a: "Export to PDF and share with your group for offline access." },
  ];

  const handleSubmit = async () => {
    
    // ✅ Loading start karo
    setLoading(true);

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
      
      // ✅ Thoda delay dekar user ko loader dikhane do
      setTimeout(() => {
        setLoading(false);
        
        navigate("/plan");
      }, 1000);
      
    } catch (error) {
      console.error("🔴 API Error:", error);
      setLoading(false); // ✅ Error aaye toh loading stop karo
      alert("Error generating trip plan: " + error.message);
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        
        {/* ✅ Loader conditionally render karo */}
        {loading && <Loader />}

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

        {/* Planner Section */}
        <div id="planner" className="mt-10 mx-auto max-w-4xl">
          <PlannerPremium
            showPlanner={showPlanner}
            setShowPlanner={setShowPlanner}
            destination={destination}
            setDestination={setDestination}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            travelers={travelers}
            setTravelers={setTravelers}
            budget={budget}
            setBudget={setBudget}
            interestsList={interestsList}
            selectedInterests={selectedInterests}
            setSelectedInterests={setSelectedInterests}
            filteredSuggestions={filteredSuggestions}
            suggestOpen={suggestOpen}
            setSuggestOpen={setSuggestOpen}
            handleSubmit={handleSubmit}
            loading={loading} // ✅ Loading prop pass karo
          />
        </div>

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
                  onClick={() => !loading && setDestination(d.name)}
                  disabled={loading}
                  className={`text-left bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm transition ${
                    loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:-translate-y-0.5"
                  }`}
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