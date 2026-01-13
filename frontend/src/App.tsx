import { BrowserRouter, Routes, Route } from 'react-router'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/components/common/ToastProvider'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LandingPage } from '@/pages/LandingPage'
import { WhiteboardPage } from '@/pages/WhiteboardPage'
import { JoinPage } from '@/pages/JoinPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/join" element={<JoinPage />} />
              <Route path="/room/:roomId" element={<WhiteboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
