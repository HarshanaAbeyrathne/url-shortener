'use client'
import React, { useState } from 'react';
import { Copy, Link, CheckCircle, AlertCircle } from 'lucide-react';

interface ApiResponse {
  code: string;
  shortUrl: string;
  longUrl: string;
}

const URLShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // API endpoint - update this to match your backend URL
  const API_ENDPOINT = 'http://localhost:3000/api/url/shorten'; // Change this to your backend endpoint

  // Simple URL validation
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    setError('');
    
    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longUrl: longUrl
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      console.error('Error shortening URL:', err);
      setError('Failed to shorten URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setLongUrl('');
    setShortUrl('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Link className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">URL Shortener</h1>
          <p className="text-gray-600 text-lg">Transform long URLs into short, shareable links</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-3">
                  Enter your long URL
                </label>
                <div className="relative">
                  <input
                    id="url-input"
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleShorten()}
                  />
                </div>
                {error && (
                  <div className="mt-3 flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}
              </div>

              {/* Shorten Button */}
              <button
                onClick={handleShorten}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Shortening...
                  </div>
                ) : (
                  'Shorten URL'
                )}
              </button>
            </div>

            {/* Result Section */}
            {shortUrl && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">URL shortened successfully!</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shortened URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={shortUrl}
                        readOnly
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono text-sm"
                      />
                      <button
                        onClick={handleCopy}
                        className="flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Shorten Another URL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLShortener;