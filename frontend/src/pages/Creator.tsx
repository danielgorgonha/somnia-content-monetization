import { useState } from 'react'
import { Upload, Video, Music, Settings, DollarSign, Users } from 'lucide-react'

const Creator = () => {
  const [activeTab, setActiveTab] = useState('upload')

  const tabs = [
    { id: 'upload', label: 'Upload Content', icon: Upload },
    { id: 'manage', label: 'Manage Content', icon: Video },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadContent />
      case 'manage':
        return <ManageContent />
      case 'earnings':
        return <Earnings />
      case 'settings':
        return <CreatorSettings />
      default:
        return <UploadContent />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Dashboard</h1>
          <p className="text-gray-600">Upload and manage your content, track earnings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-somnia-500 text-somnia-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

const UploadContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Content</h3>
        <p className="text-gray-600 mb-6">Upload your video or audio content to start earning micropayments</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">Upload your content</h4>
        <p className="text-gray-600 mb-4">Drag and drop your video or audio files here, or click to browse</p>
        <button className="btn-primary">
          Choose Files
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Title
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Enter content title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate per Second (SOM)
          </label>
          <input
            type="number"
            className="input-field"
            placeholder="0.001"
            step="0.001"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          className="input-field"
          rows={4}
          placeholder="Describe your content..."
        />
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">
          Upload Content
        </button>
      </div>
    </div>
  )
}

const ManageContent = () => {
  const contentItems = [
    {
      id: 1,
      title: 'Introduction to Web3',
      type: 'video',
      duration: '15:30',
      earnings: '2.45 SOM',
      views: 1247,
      status: 'active'
    },
    {
      id: 2,
      title: 'Solidity Basics',
      type: 'video',
      duration: '22:15',
      earnings: '1.87 SOM',
      views: 892,
      status: 'active'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Content</h3>
        <p className="text-gray-600">Manage and monitor your uploaded content</p>
      </div>

      <div className="space-y-4">
        {contentItems.map((item) => (
          <div key={item.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-somnia-100 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-somnia-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500">
                    {item.duration} • {item.views} views
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{item.earnings}</p>
                <p className="text-sm text-gray-500">Total earnings</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Earnings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
        <p className="text-gray-600">Track your micropayment earnings and revenue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <DollarSign className="w-8 h-8 text-somnia-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">4.32 SOM</p>
          <p className="text-gray-600">Total Earnings</p>
        </div>
        <div className="card text-center">
          <Video className="w-8 h-8 text-somnia-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">2</p>
          <p className="text-gray-600">Active Content</p>
        </div>
        <div className="card text-center">
          <Users className="w-8 h-8 text-somnia-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">2,139</p>
          <p className="text-gray-600">Total Views</p>
        </div>
      </div>
    </div>
  )
}

const CreatorSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Creator Settings</h3>
        <p className="text-gray-600">Configure your creator profile and preferences</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Creator Name
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Your creator name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Tell us about yourself..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Rate per Second (SOM)
          </label>
          <input
            type="number"
            className="input-field"
            placeholder="0.001"
            step="0.001"
            min="0"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default Creator
