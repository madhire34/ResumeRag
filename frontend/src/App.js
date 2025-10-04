import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { PageLoader } from './components/LoadingSpinner';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Upload = React.lazy(() => import('./components/Upload'));
const Search = React.lazy(() => import('./components/Search'));
const ResumeList = React.lazy(() => import('./components/ResumeList'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <Header />
          <motion.main 
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/search" element={<Search />} />
                <Route path="/resumes" element={<ResumeList />} />
              </Routes>
            </Suspense>
          </motion.main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
