import React, { useState, useEffect } from 'react';
import { getWebhookPath, updateWebhookPath } from '../../services/settingsService';
import { API_BASE_URL } from '../../services/api';
import toast from 'react-hot-toast';
import { Copy, Check, Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const [webhookPath, setWebhookPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPath();
  }, []);

  const fetchPath = async () => {
    try {
      const path = await getWebhookPath();
      setWebhookPath(path);
    } catch (err: any) {
      toast.error('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWebhookPath(webhookPath);
      toast.success('Webhook path updated successfully.');
    } catch (err: any) {
      toast.error('Failed to update webhook path.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    toast.success('Copied to clipboard!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-4">Loading settings...</div>;

  const fullUrl = `${API_BASE_URL}/Sync/${webhookPath || 'hris-webhook'}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8 text-blue-600" />
            System Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure global application settings and integrations.
          </p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-1">Webhook Configuration</h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure the endpoint path where the HRIS system will send data.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Path</label>
          <div className="flex items-center">
            <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l text-gray-500">
              /api/Sync/
            </span>
            <input
              type="text"
              value={webhookPath}
              onChange={(e) => setWebhookPath(e.target.value)}
              className="flex-1 border border-gray-300 px-3 py-2 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="hris-webhook"
            />
          </div>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 font-medium mb-2">Full URL Preview:</p>
          <div className="flex items-center gap-3">
            <code className="text-sm text-blue-600 break-all">{fullUrl}</code>
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded-md focus:outline-none transition-all duration-300 ease-in-out ${
                copied 
                  ? 'bg-green-100 text-green-600 scale-110' 
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200 active:scale-95'
              }`}
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !webhookPath}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
