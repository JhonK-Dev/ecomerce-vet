"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Main IMG */}
      <div className="mb-6">
        <Image
          src="/paw-print.webp"
          alt="Huella de mascota"
          width={70}
          height={70}
          className="opacity-90"
        />
      </div>

      {/* Texto + animacion */}
      <div className="flex items-center space-x-3">
        <span className="text-xl font-semibold text-gray-700">Cargando</span>

        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              <Image
                src="/paw-print.webp"
                alt={`Huella ${i}`}
                width={18}
                height={18}
                className="opacity-80"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
