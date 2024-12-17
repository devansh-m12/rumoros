'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Website {
  id: string;
  name: string;
  domain: string;
}

const WebsitePage = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [newWebsite, setNewWebsite] = useState({ name: '', domain: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch websites on component mount
  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const response = await fetch('/api/website');
      if (!response.ok) throw new Error('Failed to fetch websites');
      const data = await response.json();
      setWebsites(data);
    } catch (err) {
      setError('Failed to load websites');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWebsite),
      });

      if (!response.ok) throw new Error('Failed to create website');

      const data = await response.json();
      setWebsites([...websites, data.website]);
      setNewWebsite({ name: '', domain: '' });
      router.refresh();
    } catch (err) {
      setError('Failed to create website');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Websites</h1>

      {/* Create Website Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Website</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newWebsite.name}
              onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Domain</label>
            <input
              type="text"
              value={newWebsite.domain}
              onChange={(e) => setNewWebsite({ ...newWebsite, domain: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Creating...' : 'Create Website'}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>

      {/* Websites List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Websites</h2>
        {websites.length === 0 ? (
          <p className="text-gray-500">No websites found</p>
        ) : (
          <div className="space-y-4">
            {websites.map((website) => (
              <Link
                key={website.id}
                href={`/website/${website.id}`}
                className="border p-4 rounded-lg hover:border-blue-500 transition-colors"
              >
                <h3 className="font-medium">{website.name}</h3>
                <p className="text-gray-600">{website.domain}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsitePage;
