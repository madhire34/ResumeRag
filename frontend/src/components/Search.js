import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, 
  Sparkles, 
  FileText, 
  Star,
  Award,
  Brain,
  Zap,
  Loader2,
  AlertCircle,
  Target
} from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://localhost:8000/api/resumes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  const exampleQueries = [
    "Find React developers with 5+ years experience",
    "Looking for senior full-stack developers",
    "Need candidates with machine learning skills",
    "Find frontend developers with TypeScript",
    "Looking for DevOps engineers with AWS experience",
    "Need data scientists with Python expertise"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl mb-6">
            <SearchIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Resume Search
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect candidates using natural language queries powered by advanced AI
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div variants={itemVariants} className="mb-12">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <SearchIcon className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your ideal candidate (e.g., 'Find React developers with 5+ years experience')"
                className="w-full pl-16 pr-32 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 focus:outline-none transition-all duration-200 bg-white shadow-lg"
                disabled={searching}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={searching || !query.trim()}
                className="absolute right-2 top-2 bottom-2 btn-primary px-8 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searching ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Search</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Example Queries */}
        <motion.div variants={itemVariants} className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Try these example searches
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {exampleQueries.map((example, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuery(example)}
                disabled={searching}
                className="px-6 py-3 bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-medium rounded-xl border border-gray-200 hover:border-primary-300 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3"
            >
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <span className="text-red-800 font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Results Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h2>
                <p className="text-xl text-gray-600">
                  Found {results.top_candidates?.length || 0} candidates matching your criteria
                </p>
              </div>

              {/* AI Analysis */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="card p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">AI Analysis</h3>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <div className="whitespace-pre-wrap">{results.summary}</div>
                </div>
              </motion.div>

              {/* Top Candidates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Top Candidates</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.top_candidates?.map((candidate, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="card-hover p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">Candidate</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {(candidate.similarity * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Match</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${candidate.similarity * 100}%` }}
                            transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                          />
                        </div>
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Retrieved Documents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="card p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Retrieved Documents</h3>
                </div>
                <div className="space-y-4">
                  {results.retrieved_documents?.map((doc, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
                    >
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span>{doc.name}</span>
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{doc.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <motion.div variants={itemVariants} className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our AI Search?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Semantic Understanding',
                description: 'Understands context and meaning, not just keywords',
                color: 'blue'
              },
              {
                icon: Target,
                title: 'Precise Matching',
                description: 'Finds candidates who truly fit your requirements',
                color: 'green'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Get results in seconds with our optimized search',
                color: 'purple'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`card-hover p-8 text-center bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100`}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 bg-${feature.color}-100 rounded-2xl flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Search;