import PageHeader from '@components/PageHeader'
import { useEffect, useState } from 'react'
import { exportReportCSV, getAdminReportData, type ReportRow } from '@services/adminMock'
import { BarChart3, Download, TrendingUp, Users, FileText, MessageSquare, Heart, Flag } from 'lucide-react'

const AdminReportsPage = () => {
  const [rows, setRows] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAdminReportData()
        setRows(data)
      } catch {
        setError('Failed to load reports')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleExportCSV = async () => {
    const blob = await exportReportCSV()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admin-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getIconForMetric = (metric: string) => {
    if (metric.includes('User')) return <Users className="w-5 h-5" />
    if (metric.includes('Post')) return <FileText className="w-5 h-5" />
    if (metric.includes('Comment')) return <MessageSquare className="w-5 h-5" />
    if (metric.includes('Like')) return <Heart className="w-5 h-5" />
    if (metric.includes('Reported')) return <Flag className="w-5 h-5" />
    if (metric.includes('Announcement')) return <TrendingUp className="w-5 h-5" />
    return <BarChart3 className="w-5 h-5" />
  }

  const getColorForMetric = (metric: string) => {
    if (metric.includes('User')) return 'bg-blue-50 text-blue-600 border-blue-200'
    if (metric.includes('Post')) return 'bg-green-50 text-green-600 border-green-200'
    if (metric.includes('Comment')) return 'bg-purple-50 text-purple-600 border-purple-200'
    if (metric.includes('Like')) return 'bg-pink-50 text-pink-600 border-pink-200'
    if (metric.includes('Reported')) return 'bg-orange-50 text-orange-600 border-orange-200'
    if (metric.includes('Announcement')) return 'bg-indigo-50 text-indigo-600 border-indigo-200'
    return 'bg-gray-50 text-gray-600 border-gray-200'
  }

  return (
    <div className="p-6">
      <PageHeader title="Admin Reports" subtitle="View real-time system usage and activity metrics" />
      
      {/* Export Buttons */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-3 items-center">
          <button 
            onClick={handleExportCSV} 
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV Report
          </button>
          <span className="text-sm text-gray-500">Download comprehensive data report</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Metrics Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {rows.map((row, index) => (
            <div 
              key={index}
              className={`bg-white rounded-lg shadow p-5 border-2 transition-all hover:shadow-lg ${getColorForMetric(row.metric)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  {getIconForMetric(row.metric)}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{row.metric}</h3>
              <p className="text-3xl font-bold mb-1">{row.value}</p>
              <p className="text-xs text-gray-500">{row.period}</p>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Detailed Metrics Report</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Metric</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Value</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Period</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getIconForMetric(row.metric)}
                        <span className="font-medium text-gray-900">{row.metric}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-semibold text-lg">{row.value}</td>
                    <td className="py-3 px-4 text-gray-600">{row.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReportsPage
