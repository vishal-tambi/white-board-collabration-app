import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import { Home } from 'lucide-react'

/**
 * NotFoundPage
 *
 * 404 error page with link back to home.
 */
export function NotFoundPage() {
  return (
    <PageLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! This page doesn&apos;t exist.
          </p>
          <Button asChild size="lg">
            <Link to="/">
              <Home className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  )
}
