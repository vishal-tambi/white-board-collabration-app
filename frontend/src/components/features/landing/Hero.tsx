import { motion } from 'framer-motion'
import { PenLine, Users, Sparkles } from 'lucide-react'

/**
 * Hero Component
 *
 * Main hero section for the landing page.
 * Features animated heading, subtitle, and visual elements.
 */
export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="text-center px-4">
        {/* Animated icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl">
              <PenLine className="size-10 text-primary-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4"
        >
          Collaborative <span className="text-primary">Whiteboard</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          Draw, sketch, and brainstorm together in real-time. No signup required
          — just create a room and start collaborating.
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
            <Users className="size-4 text-primary" />
            <span>Real-time collaboration</span>
          </div>
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
            <Sparkles className="size-4 text-primary" />
            <span>Smooth drawing</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
