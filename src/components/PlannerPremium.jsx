// src/components/PlannerPremium.jsx
import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch,
  FaArrowRight, FaArrowLeft, FaStar, FaRocket
} from "react-icons/fa";

/* ============ Utility & Variants ============ */
const spring = { type: "spring", stiffness: 220, damping: 24 };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

/* ============ Reusable UI ============ */
function StepIndicator({ n, label, active, reduceMotion }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none">
      <motion.div
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium text-sm ${
          active ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
                 : "bg-white/80 border-gray-300 text-gray-500 dark:bg-slate-800/80 dark:border-slate-600"
        }`}
        whileHover={reduceMotion ? {} : { scale: 1.06 }}
        whileTap={reduceMotion ? {} : { scale: 0.95 }}
        transition={spring}
        aria-current={active ? "step" : undefined}
        role="listitem"
      >
        {active ? <FaStar className="text-xs" /> : n}
      </motion.div>
      <span className={`font-medium ${active ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500"} hidden xs:inline`}>
        {label}
      </span>
    </div>
  );
}

function FloatingCard({ children, className = "", reduceMotion }) {
  return (
    <motion.div
      className={`relative rounded-3xl border border-white/60 dark:border-slate-600/50 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-800/40 backdrop-blur-xl shadow-lg sm:shadow-2xl ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={reduceMotion ? false : { opacity: 1, y: 0, scale: 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-emerald-400/20 to-purple-500/20 blur-sm opacity-60 pointer-events-none" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function LabeledField({ label, icon: Icon, children }) {
  return (
    <div className="relative group">
      <label className="text-[13px] sm:text-sm font-semibold mb-2 sm:mb-3 block text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors text-base sm:text-lg pointer-events-none" />
        )}
        <div className="rounded-2xl border-2 border-gray-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-md sm:shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

function InterestChip({ active, children, onClick, disabled, reduceMotion }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled || reduceMotion ? {} : { scale: 1.05, y: -2 }}
      whileTap={disabled || reduceMotion ? {} : { scale: 0.95 }}
      animate={active && !reduceMotion ? { scale: 1.06, y: -2 } : { scale: 1, y: 0 }}
      transition={spring}
      className={`px-4 py-3 sm:px-6 sm:py-3.5 rounded-2xl text-[13px] sm:text-sm font-semibold transition-all duration-300 shadow-md ${
        active
          ? "text-white shadow-emerald-500/25 bg-gradient-to-r from-emerald-500 to-purple-600"
          : disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
          : "bg-white/80 text-gray-700 hover:bg-gray-50 border-2 border-gray-200/60 dark:bg-slate-800/80 dark:text-gray-300 dark:border-slate-600"
      }`}
      aria-pressed={active}
      aria-disabled={disabled}
    >
      {children}
      {active && " ✨"}
    </motion.button>
  );
}

/* ============ Main Component ============ */
export default function PlannerPremium(props) {
  const {
    showPlanner, setShowPlanner,
    destination, setDestination,
    startDate, setStartDate,
    endDate, setEndDate,
    travelers, setTravelers,
    budget, setBudget,
    interestsList, selectedInterests, setSelectedInterests,
    filteredSuggestions, suggestOpen, setSuggestOpen,
    handleSubmit,
    loading = false
  } = props;

  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [hoverCTA, setHoverCTA] = useState(false);

  const headerGradient =
    "bg-[radial-gradient(900px_480px_at_10%_-10%,rgba(16,185,129,0.18),transparent),radial-gradient(700px_420px_at_90%_0%,rgba(147,51,234,0.16),transparent)]";

  const onPickInterest = (interest) => {
    if (loading) return;
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const canContinueStep1 = useMemo(() => {
    if (loading) return false;
    if (!destination?.trim()) return false;
    if (!startDate || !endDate) return false;
    if (new Date(startDate) > new Date(endDate)) return false;
    return true;
  }, [destination, startDate, endDate, loading]);

  return (
    <div id="planner" className="mt-8 sm:mt-10 mx-auto max-w-full sm:max-w-5xl px-4">
      {!showPlanner ? (
        <motion.button
          onClick={() => !loading && setShowPlanner(true)}
          disabled={loading}
          className="relative group w-full sm:w-auto"
          whileHover={loading || reduceMotion ? {} : { scale: 1.02 }}
          whileTap={loading || reduceMotion ? {} : { scale: 0.98 }}
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300" />
          <div className={`relative bg-gradient-to-r from-emerald-500 to-purple-600 text-white px-6 py-4 sm:px-10 sm:py-5 rounded-2xl shadow-xl sm:shadow-2xl font-semibold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:from-emerald-600 hover:to-purple-700"
          }`}>
            <FaRocket className="text-lg sm:text-xl" />
            {loading ? "Processing..." : "Craft Your Dream Journey"}
          </div>
        </motion.button>
      ) : (
        <FloatingCard reduceMotion={reduceMotion}>
          <div className="p-1">
            {/* Header */}
            <div className={`px-4 sm:px-8 pt-5 sm:pt-6 ${headerGradient}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <motion.h3
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent"
                  initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                  animate={reduceMotion ? false : { opacity: 1, x: 0 }}
                  transition={reduceMotion ? { duration: 0 } : undefined}
                >
                  Journey Architect
                </motion.h3>

                <div className="flex items-center gap-4 sm:gap-6" role="list">
                  <StepIndicator n={1} label="Destination & Dates" active={step === 1} reduceMotion={reduceMotion} />
                  <div className="hidden sm:block w-12 h-px bg-gradient-to-r from-emerald-400 to-purple-400" aria-hidden />
                  <StepIndicator n={2} label="Interests & Style" active={step === 2} reduceMotion={reduceMotion} />
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4 sm:mt-6 h-2.5 sm:h-3 rounded-full bg-gray-100 dark:bg-slate-800/60 overflow-hidden shadow-inner" aria-hidden>
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-purple-500 shadow-lg"
                  initial={false}
                  animate={{ width: step === 1 ? "50%" : "100%" }}
                  transition={reduceMotion ? { duration: 0 } : spring}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-8">
              {step === 1 && (
                <motion.div
                  initial={reduceMotion ? false : fadeUp.initial}
                  animate={reduceMotion ? false : fadeUp.animate}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
                  className="space-y-6 sm:space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Destination */}
                    <div className="space-y-5 sm:space-y-6">
                      <LabeledField label="🌍 Dream Destination" icon={FaMapMarkerAlt}>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => { setDestination(e.target.value); setSuggestOpen(true); }}
                          onFocus={() => setSuggestOpen(true)}
                          onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                          placeholder="Where to next? e.g., Bali, Paris, Tokyo..."
                          className="w-full rounded-2xl bg-transparent outline-none placeholder:text-gray-400 px-10 sm:px-12 py-3 sm:py-4 text-[14px] sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Destination"
                          disabled={loading}
                        />
                        {suggestOpen && filteredSuggestions.length > 0 && !loading && (
                          <motion.ul
                            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                            animate={reduceMotion ? false : { opacity: 1, y: 0, scale: 1 }}
                            className="absolute z-20 mt-2 sm:mt-3 w-full rounded-2xl overflow-auto max-h-56 sm:max-h-72 border border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-xl sm:shadow-2xl"
                            role="listbox"
                          >
                            {filteredSuggestions.map((s) => (
                              <li
                                key={s}
                                onMouseDown={(e) => { e.preventDefault(); setDestination(s); setSuggestOpen(false); }}
                                className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer border-b border-gray-100 dark:border-slate-700 last:border-0 transition-colors group"
                                role="option"
                                aria-selected={destination === s}
                              >
                                <span className="text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                  {s}
                                </span>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </LabeledField>

                      {/* Travelers */}
                      <LabeledField label="👥 Travel Companions" icon={FaUsers}>
                        <input
                          type="number"
                          min={1}
                          value={travelers}
                          onChange={(e) => setTravelers(Math.max(1, Number(e.target.value)))}
                          className="w-full rounded-2xl bg-transparent outline-none px-10 sm:px-12 py-3 sm:py-4 text-[14px] sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Travelers"
                          disabled={loading}
                        />
                      </LabeledField>
                    </div>

                    {/* Dates & Budget */}
                    <div className="space-y-5 sm:space-y-6">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <LabeledField label="📅 Start Journey" icon={FaCalendarAlt}>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-2xl bg-transparent outline-none px-10 sm:px-12 py-3 sm:py-4 text-[14px] sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Start date"
                            disabled={loading}
                          />
                        </LabeledField>

                        <LabeledField label="📅 Return Home" icon={FaCalendarAlt}>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-2xl bg-transparent outline-none px-10 sm:px-12 py-3 sm:py-4 text-[14px] sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="End date"
                            disabled={loading}
                          />
                        </LabeledField>
                      </div>

                      {/* Budget */}
                      <div className="rounded-2xl border-2 border-gray-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-4 sm:p-6 shadow-md sm:shadow-lg">
                        <label className="text-[13px] sm:text-sm font-semibold mb-2 sm:mb-3 block text-gray-700 dark:text-gray-300">
                          💰 Budget Range
                        </label>
                        <input
                          type="range"
                          min={200}
                          max={3000}
                          step={50}
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="w-full accent-emerald-500 disabled:opacity-50"
                          aria-label="Budget range"
                          disabled={loading}
                        />
                        <div className="mt-3 sm:mt-4 flex items-center justify-between text-[12px] sm:text-sm">
                          <span className="text-gray-500">Economy</span>
                          <motion.span
                            key={budget}
                            initial={reduceMotion ? false : { scale: 1.05, opacity: 0 }}
                            animate={reduceMotion ? false : { scale: 1, opacity: 1 }}
                            className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent"
                          >
                            ₹{budget} / person
                          </motion.span>
                          <span className="text-gray-500">Luxury</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-1 sm:pt-2">
                    <motion.button
                      onClick={() => !loading && setStep(2)}
                      disabled={!canContinueStep1 || loading}
                      className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold shadow-lg sm:shadow-2xl flex items-center justify-center gap-3 group transition-all duration-300 text-white ${
                        canContinueStep1 && !loading
                          ? "bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600"
                          : "bg-gray-300 dark:bg-slate-700 cursor-not-allowed"
                      }`}
                      whileHover={canContinueStep1 && !loading && !reduceMotion ? { scale: 1.02, y: -2 } : {}}
                      whileTap={canContinueStep1 && !loading && !reduceMotion ? { scale: 0.98 } : {}}
                      aria-disabled={!canContinueStep1 || loading}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={reduceMotion ? {} : { rotate: 360 }}
                            transition={reduceMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          Continue to Interests
                          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={reduceMotion ? false : fadeUp.initial}
                  animate={reduceMotion ? false : fadeUp.animate}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
                  className="space-y-6 sm:space-y-8"
                >
                  <div>
                    <label className="text-base sm:text-lg font-bold mb-4 sm:mb-6 block text-gray-800 dark:text-gray-200">
                      🎯 What Sparks Your Wanderlust?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {interestsList.map((interest) => {
                        const active = selectedInterests.includes(interest);
                        return (
                          <InterestChip
                            key={interest}
                            active={active}
                            onClick={() => onPickInterest(interest)}
                            disabled={loading}
                            reduceMotion={reduceMotion}
                          >
                            {interest}
                          </InterestChip>
                        );
                      })}
                    </div>

                    {selectedInterests.length > 0 && (
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                        className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                      >
                        <p className="text-[13px] sm:text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                          🎉 Perfect! We'll craft experiences around: <span className="font-bold">{selectedInterests.join(", ")}</span>
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 sm:pt-4">
                    <motion.button
                      onClick={() => !loading && setStep(1)}
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={loading || reduceMotion ? {} : { scale: 1.02, x: -2 }}
                      whileTap={loading || reduceMotion ? {} : { scale: 0.98 }}
                    >
                      <FaArrowLeft />
                      Back
                    </motion.button>

                    <motion.button
                      onClick={handleSubmit}
                      disabled={loading}
                      whileHover={loading || reduceMotion ? {} : { scale: 1.04, y: -2 }}
                      whileTap={loading || reduceMotion ? {} : { scale: 0.98 }}
                      onHoverStart={() => !loading && !reduceMotion && setHoverCTA(true)}
                      onHoverEnd={() => !loading && !reduceMotion && setHoverCTA(false)}
                      className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold shadow-xl sm:shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden transition-all ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 text-white"
                      }`}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={reduceMotion ? {} : { rotate: 360 }}
                            transition={reduceMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Generating Plan...
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <FaRocket className={`text-base sm:text-lg ${hoverCTA ? "animate-bounce" : ""}`} />
                          Create My Journey Plan
                          <FaSearch className="group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </FloatingCard>
      )}
    </div>
  );
}
