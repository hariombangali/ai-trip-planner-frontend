// src/components/Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-8 shadow-2xl border border-white/20"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.5, repeat: Infinity }
            }}
            className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent"
          >
            Crafting Your Journey...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-600 dark:text-gray-400 text-center"
          >
            AI is designing your perfect trip itinerary
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}