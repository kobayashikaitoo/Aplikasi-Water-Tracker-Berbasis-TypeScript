"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Coffee, GlassWater, Milk, Beer, Wine, CupSoda, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CupSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize: number;
  onSelect: (size: number) => void;
}

const cups = [
  { size: 100, icon: Coffee, label: "100 ml" },
  { size: 125, icon: Coffee, label: "125 ml" }, // visual variant if possible
  { size: 150, icon: Coffee, label: "150 ml" },
  { size: 175, icon: GlassWater, label: "175 ml" },
  { size: 200, icon: GlassWater, label: "200 ml" },
  { size: 300, icon: Beer, label: "300 ml" },
  { size: 400, icon: Milk, label: "400 ml" },
  // Custom placeholder handled separately
];

export default function CupSelector({ isOpen, onClose, selectedSize, onSelect }: CupSelectorProps) {
  const [customSize, setCustomSize] = useState(selectedSize);
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neutral-800">Ganti cangkir</h2>
                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-y-8 gap-x-4 mb-8">
                {cups.map((cup) => {
                  const Icon = cup.icon;
                  const isSelected = selectedSize === cup.size;

                  return (
                    <motion.button
                      key={cup.size}
                      onClick={() => {
                        onSelect(cup.size);
                      }}
                      whileHover={{ y: -5 }} // Lift effect on hover
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-3 group relative"
                    >
                      <div className={cn(
                        "w-12 h-12 flex items-center justify-center transition-all",
                        isSelected ? "text-blue-500 scale-110" : "text-neutral-800"
                      )}>
                        {/* Simulated "Fill" could go here with a masked div */}
                        <Icon strokeWidth={1.5} className="w-8 h-8" />
                      </div>

                      {isSelected && (
                        <motion.div
                          layoutId="activeCup"
                          className="absolute -bottom-2 w-12 h-1 bg-blue-500/20 rounded-full blur-sm"
                        />
                      )}

                      <span className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-blue-500 font-bold" : "text-neutral-500 group-hover:text-neutral-700"
                      )}>
                        {cup.label}
                      </span>
                    </motion.button>
                  )
                })}

                {/* Custom Size Option */}
                <div className="flex flex-col items-center gap-3">
                  {!isEditingCustom ? (
                    <button
                      onClick={() => setIsEditingCustom(true)}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                        <Plus className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-neutral-500 group-hover:text-blue-500">Sesuaikan</span>
                    </button>
                  ) : (
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-200">
                      <div className="relative w-16 mb-1">
                        <input
                          autoFocus
                          type="number"
                          value={customSize}
                          onChange={(e) => setCustomSize(Number(e.target.value))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onSelect(customSize);
                              setIsEditingCustom(false);
                            }
                          }}
                          className="w-full bg-blue-50 border-2 border-blue-500 rounded-lg px-1 py-2 text-center font-bold text-blue-600 outline-none text-sm"
                        />
                        <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-bold">ml</span>
                      </div>
                      <button
                        onClick={() => {
                          onSelect(customSize);
                          setIsEditingCustom(false);
                        }}
                        className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded-md font-bold"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button onClick={onClose} className="px-5 py-2 text-neutral-500 font-medium hover:bg-neutral-50 rounded-lg">BATAL</button>
                <button onClick={onClose} className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">OK</button>
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
