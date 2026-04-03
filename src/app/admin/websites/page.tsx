'use client'
import { useEffect, useState } from 'react'

interface Website {
  domain: string
  location: string
  region: string
  url: string
}

export default function WebsitesPage() {
  useEffect(() => { document.title = 'Websites | NYC Mobile Salon' }, [])

  const [websites] = useState<Website[]>([
    { domain: 'thenycmobilesalon.com', location: 'All NYC', region: 'NYC', url: 'https://thenycmobilesalon.com' },
  ])

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1E2A4A] mb-6">Websites</h1>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Domain</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Location</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Region</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {websites.map((site) => (
              <tr key={site.domain} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{site.domain}</td>
                <td className="px-4 py-3">{site.location}</td>
                <td className="px-4 py-3">{site.region}</td>
                <td className="px-4 py-3">
                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                    Visit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-gray-400">Add more domains here as you expand your web presence.</p>
    </div>
  )
}
