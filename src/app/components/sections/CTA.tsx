// components/sections/CTA.tsx
import React from "react";
import { motion } from "framer-motion";

interface CTAProps {
  email: string;
  setEmail: (email: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CTA: React.FC<CTAProps> = ({ email, setEmail, handleSubmit }) => {
  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-hidden bg-black">
      {/* Simplified Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black/70 to-indigo-950/40"></div>

        {/* Subtle background elements */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full mix-blend-soft-light filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-600/10 rounded-full mix-blend-soft-light filter blur-3xl opacity-30"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Heading section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 block">
              Ready to Transform
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
              Your Career?
            </span>
          </h2>

          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join ambitious professionals accelerating their careers. Be among
            the first to access our exclusive platform.
          </motion.p>
        </motion.div>

        {/* Form section */}
        <motion.div
          className="relative max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="relative flex flex-col sm:flex-row gap-3 p-1 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50"
          >
            <div className="flex-grow relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your professional email"
                className="w-full px-6 py-4 rounded-lg bg-black/60 border border-gray-700/50 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder-gray-400 transition-all duration-300 shadow-inner text-base backdrop-blur-sm"
              />
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="relative px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium transition-all duration-300 whitespace-nowrap text-base overflow-hidden"
            >
              Get Early Access
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Stats section */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap items-center justify-center gap-5 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>8,500+ professionals joined</span>
            </div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>No spam guarantee</span>
            </div>
          </div>

          {/* Testimonial */}
          <motion.div
            className="max-w-md mx-auto pt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-500 text-sm italic">
              Changed how I approach my career development.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              - Sarah K., Senior Developer
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
