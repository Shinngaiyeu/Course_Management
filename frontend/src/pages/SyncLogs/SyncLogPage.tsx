import React, { useState, useEffect } from 'react';
import { SyncLog, syncLogService } from '../../services/syncLogService';
import { Eye, RefreshCw, X, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const SyncLogPage: React.FC = () => {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [selectedPayload, setSelectedPayload] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<number | null>(null);

  useEffect(() => {
    fetchLogs(page, statusFilter);
  }, [page, statusFilter]);

  const fetchLogs = async (p: number, s: string) => {
    setLoading(true);
    try {
      const result = await syncLogService.getLogs(p, pageSize, s);
      setLogs(result.items || []);
      setTotalCount(result.totalCount || 0);
    } catch (error) {
      console.error('Failed to fetch sync logs', error);
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (id: number) => {
    setRetryingId(id);
    const toastId = toast.loading('Retrying sync...');
    try {
      await syncLogService.retrySyncLog(id);
      toast.success('Retry successful!', { id: toastId });
      fetchLogs(page, statusFilter); // refresh
    } catch (error) {
      console.error('Retry failed', error);
      toast.error('Retry failed. Please check payload.', { id: toastId });
    } finally {
      setRetryingId(null);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">HRIS Sync Logs</h2>
          <p className="text-gray-500 text-sm mt-1">History of user synchronizations from HRIS</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading && logs.length === 0 ? (
          <div className="text-center py-10">Loading logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.syncDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button 
                        onClick={() => setSelectedPayload(log.payload)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        title="View Payload"
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </button>
                      
                      {log.status === 'Failed' && (
                        <button 
                          onClick={() => handleRetry(log.id)}
                          disabled={retryingId === log.id}
                          className="text-orange-600 hover:text-orange-900 inline-flex items-center disabled:opacity-50"
                          title="Retry Sync"
                        >
                          <RefreshCw className={`w-4 h-4 mr-1 ${retryingId === log.id ? 'animate-spin' : ''}`} /> 
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                      No sync logs found for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(page * pageSize, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payload Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSelectedPayload(null)}></div>
          <div className="relative w-full max-w-2xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                <h3 className="text-xl font-semibold">Payload Details</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-gray-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-800"
                  onClick={() => setSelectedPayload(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
                  {(() => {
                    try {
                      return JSON.stringify(JSON.parse(selectedPayload), null, 2);
                    } catch {
                      return selectedPayload;
                    }
                  })()}
                </pre>
              </div>
              <div className="flex items-center justify-end p-4 border-t border-solid rounded-b border-blueGray-200">
                <button
                  className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:text-gray-800"
                  type="button"
                  onClick={() => setSelectedPayload(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncLogPage;
