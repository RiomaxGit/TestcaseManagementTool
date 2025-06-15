import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Heart, 
  Network, 
  Database, 
  Brain,
  Calendar,
  CheckSquare,
  Users,
  FileText,
  UserCheck,
  FolderOpen,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  User,
  Type,
  Hash,
  Calendar as CalendarIcon,
  List,
  Image,
  Edit3,
  Table,
  DollarSign,
  Percent,
  Thermometer,
  Clock,
  Camera,
  Video,
  Paperclip,
  Signature,
  Plus,
  Trash2,
  Copy,
  Move,
  Eye,
  Save,
  Download
} from 'lucide-react';

const FormBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [draggedElement, setDraggedElement] = useState(null);

  const fieldTypes = [
    {
      category: 'Text',
      items: [
        { type: 'short-text', label: 'Short Text', icon: Type },
        { type: 'paragraph', label: 'Paragraph', icon: FileText },
      ]
    },
    {
      category: 'Numeric',
      items: [
        { type: 'number', label: 'Number', icon: Hash },
        { type: 'currency', label: 'Currency', icon: DollarSign },
        { type: 'percentage', label: 'Percentage', icon: Percent },
        { type: 'decimal', label: 'Decimal', icon: Hash },
        { type: 'temperature', label: 'Temperature', icon: Thermometer },
      ]
    },
    {
      category: 'Date & Time',
      items: [
        { type: 'date', label: 'Date', icon: CalendarIcon },
        { type: 'time', label: 'Time', icon: Clock },
        { type: 'datetime', label: 'Date & Time', icon: CalendarIcon },
        { type: 'timestamp', label: 'Timestamp', icon: Clock },
      ]
    },
    {
      category: 'Lists',
      items: [
        { type: 'dropdown', label: 'Dropdown', icon: List },
        { type: 'radio', label: 'Radio Buttons', icon: List },
        { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
        { type: 'multi-select', label: 'Multi-Select', icon: List },
      ]
    },
    {
      category: 'Media',
      items: [
        { type: 'image', label: 'Image Upload', icon: Image },
        { type: 'document', label: 'Document Upload', icon: Paperclip },
        { type: 'video', label: 'Video Upload', icon: Video },
        { type: 'camera', label: 'Camera Capture', icon: Camera },
      ]
    },
    {
      category: 'Scribble',
      items: [
        { type: 'signature', label: 'Signature', icon: Signature },
        { type: 'canvas', label: 'Canvas/Drawing', icon: Edit3 },
      ]
    },
    {
      category: 'Advanced',
      items: [
        { type: 'table', label: 'Table', icon: Table },
      ]
    }
  ];

  const addFormElement = (fieldType) => {
    const newElement = {
      id: Date.now(),
      type: fieldType.type,
      label: fieldType.label,
      required: false,
      width: '100%',
      height: 'auto',
      options: fieldType.type.includes('dropdown') || fieldType.type.includes('radio') || fieldType.type.includes('checkbox') ? ['Option 1', 'Option 2'] : [],
      placeholder: '',
      validation: {},
    };
    
    setFormElements([...formElements, newElement]);
  };

  const updateElement = (id, updates) => {
    setFormElements(formElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id) => {
    setFormElements(formElements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const duplicateElement = (id) => {
    const element = formElements.find(el => el.id === id);
    if (element) {
      const newElement = { ...element, id: Date.now() };
      setFormElements([...formElements, newElement]);
    }
  };

  const renderFormElement = (element) => {
    const commonProps = {
      style: { width: element.width, height: element.height },
      className: `border border-gray-300 rounded-md p-2 ${selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''}`,
      onClick: () => setSelectedElement(element)
    };

    switch (element.type) {
      case 'short-text':
        return <input type="text" placeholder={element.placeholder || 'Enter text...'} {...commonProps} />;
      case 'paragraph':
        return <textarea placeholder={element.placeholder || 'Enter paragraph...'} rows="4" {...commonProps} />;
      case 'number':
      case 'decimal':
        return <input type="number" placeholder={element.placeholder || '0'} {...commonProps} />;
      case 'currency':
        return (
          <div className="relative" style={{ width: element.width }}>
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input type="number" placeholder="0.00" className="pl-8 border border-gray-300 rounded-md p-2 w-full" />
          </div>
        );
      case 'percentage':
        return (
          <div className="relative" style={{ width: element.width }}>
            <input type="number" placeholder="0" className="pr-8 border border-gray-300 rounded-md p-2 w-full" />
            <span className="absolute right-3 top-2 text-gray-500">%</span>
          </div>
        );
      case 'temperature':
        return (
          <div className="relative" style={{ width: element.width }}>
            <input type="number" placeholder="0" className="pr-12 border border-gray-300 rounded-md p-2 w-full" />
            <span className="absolute right-3 top-2 text-gray-500">°C</span>
          </div>
        );
      case 'date':
        return <input type="date" {...commonProps} />;
      case 'time':
        return <input type="time" {...commonProps} />;
      case 'datetime':
        return <input type="datetime-local" {...commonProps} />;
      case 'dropdown':
        return (
          <select {...commonProps}>
            <option>Select an option...</option>
            {element.options.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div style={{ width: element.width }} className={selectedElement?.id === element.id ? 'ring-2 ring-blue-500 rounded-md p-2' : 'p-2'} onClick={() => setSelectedElement(element)}>
            {element.options.map((option, idx) => (
              <label key={idx} className="flex items-center mb-2">
                <input type="radio" name={`radio-${element.id}`} className="mr-2" />
                {option}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div style={{ width: element.width }} className={selectedElement?.id === element.id ? 'ring-2 ring-blue-500 rounded-md p-2' : 'p-2'} onClick={() => setSelectedElement(element)}>
            {element.options.map((option, idx) => (
              <label key={idx} className="flex items-center mb-2">
                <input type="checkbox" className="mr-2" />
                {option}
              </label>
            ))}
          </div>
        );
      case 'image':
      case 'document':
      case 'video':
        return (
          <div {...commonProps} className={`border-2 border-dashed border-gray-300 rounded-md p-8 text-center ${selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="text-gray-500">
              <Image className="w-8 h-8 mx-auto mb-2" />
              <p>Click to upload {element.type}</p>
            </div>
          </div>
        );
      case 'signature':
        return (
          <div {...commonProps} className={`border-2 border-gray-300 rounded-md p-4 text-center bg-gray-50 ${selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''}`}>
            <Signature className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500 text-sm">Signature Area</p>
          </div>
        );
      case 'canvas':
        return (
          <div {...commonProps} className={`border-2 border-gray-300 rounded-md p-4 text-center bg-gray-50 ${selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''}`}>
            <Edit3 className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500 text-sm">Drawing Canvas</p>
          </div>
        );
      case 'table':
        return (
          <div style={{ width: element.width }} className={selectedElement?.id === element.id ? 'ring-2 ring-blue-500 rounded-md' : ''} onClick={() => setSelectedElement(element)}>
            <table className="w-full border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2">Column 1</th>
                  <th className="border border-gray-300 p-2">Column 2</th>
                  <th className="border border-gray-300 p-2">Column 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Sample data</td>
                  <td className="border border-gray-300 p-2">Sample data</td>
                  <td className="border border-gray-300 p-2">Sample data</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return <div {...commonProps}>Unknown field type</div>;
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar - Field Types */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Form Elements</h2>
          <p className="text-sm text-gray-500">Drag elements to build your form</p>
        </div>
        
        <div className="p-4 space-y-6">
          {fieldTypes.map((category) => (
            <div key={category.category}>
              <h3 className="text-sm font-medium text-gray-700 mb-3">{category.category}</h3>
              <div className="grid grid-cols-2 gap-2">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => addFormElement(item)}
                      className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
                      draggable
                      onDragStart={() => setDraggedElement(item)}
                    >
                      <Icon className="w-5 h-5 text-gray-600 mb-1" />
                      <span className="text-xs text-gray-700 text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Form Canvas */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Form Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-2xl font-semibold text-gray-900 border-none outline-none bg-transparent"
                placeholder="Form Title"
              />
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
                <button className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Form
                </button>
              </div>
            </div>
          </div>

          {/* Form Canvas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
            {formElements.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Start building your form</p>
                  <p className="text-sm">Drag elements from the sidebar or click to add</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {formElements.map((element) => (
                  <div key={element.id} className="relative group">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {element.label}
                          {element.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {renderFormElement(element)}
                      </div>
                      
                      {/* Element Controls */}
                      <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => duplicateElement(element.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteElement(element.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties Panel */}
      {selectedElement && (
        <div className="w-80 bg-white shadow-lg border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Element Properties</h2>
            <p className="text-sm text-gray-500">{selectedElement.label}</p>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
              <input
                type="text"
                value={selectedElement.label}
                onChange={(e) => updateElement(selectedElement.id, { label: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Required */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={selectedElement.required}
                onChange={(e) => updateElement(selectedElement.id, { required: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="required" className="text-sm text-gray-700">Required field</label>
            </div>

            {/* Placeholder */}
            {(['short-text', 'paragraph', 'number', 'decimal'].includes(selectedElement.type)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
                <input
                  type="text"
                  value={selectedElement.placeholder}
                  onChange={(e) => updateElement(selectedElement.id, { placeholder: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            )}

            {/* Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
              <select
                value={selectedElement.width}
                onChange={(e) => updateElement(selectedElement.id, { width: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="25%">25%</option>
                <option value="50%">50%</option>
                <option value="75%">75%</option>
                <option value="100%">100%</option>
              </select>
            </div>

            {/* Options for list types */}
            {(['dropdown', 'radio', 'checkbox', 'multi-select'].includes(selectedElement.type)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                <div className="space-y-2">
                  {selectedElement.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...selectedElement.options];
                          newOptions[idx] = e.target.value;
                          updateElement(selectedElement.id, { options: newOptions });
                        }}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-1"
                      />
                      <button
                        onClick={() => {
                          const newOptions = selectedElement.options.filter((_, i) => i !== idx);
                          updateElement(selectedElement.id, { options: newOptions });
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [...selectedElement.options, `Option ${selectedElement.options.length + 1}`];
                      updateElement(selectedElement.id, { options: newOptions });
                    }}
                    className="w-full py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const mainMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Builder', icon: Heart },
    { name: 'Network', icon: Network },
    { name: 'Storage', icon: Database },
    { name: 'AI Engine', icon: Brain },
  ];

  const featuredPages = [
    { name: 'Page 1', icon: FileText },
    { name: 'Calendar', icon: Calendar },
    { name: 'To-Do', icon: CheckSquare },
    { name: 'Contact', icon: Users },
    { name: 'Page 2', icon: FileText },
    { name: 'Reports', icon: BarChart3 },
    { name: 'User Access', icon: UserCheck },
    { name: 'Repositories', icon: FolderOpen },
  ];

  const bottomMenuItems = [
    { name: 'Settings', icon: Settings },
    { name: 'Logout', icon: LogOut },
  ];

  const handleMenuClick = (menuName) => {
    setActiveMenuItem(menuName);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'Dashboard':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to GenSys</h3>
                <p className="text-gray-600">Your comprehensive management platform</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Quick Stats</h3>
                <p className="text-blue-700">System is running smoothly</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-medium text-green-900 mb-2">Recent Activity</h3>
                <p className="text-green-700">All systems operational</p>
              </div>
            </div>
          </div>
        );
      case 'Builder':
        return <FormBuilder />;
      case 'Analytics':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">Analytics dashboard content would go here...</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">{activeMenuItem}</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600">{activeMenuItem} content would be displayed here...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            {!sidebarCollapsed && (
              <span className="ml-3 text-xl font-semibold text-blue-600">GENSYS</span>
            )}
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenuItem === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item.name)}
                  className={`w-full flex items-center p-3 rounded-lg mb-1 transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
                </button>
              );
            })}
          </nav>

          {/* Featured Pages */}
          {!sidebarCollapsed && (
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Featured Pages
              </h3>
              <nav className="space-y-1">
                {featuredPages.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleMenuClick(item.name)}
                      className="w-full flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="ml-3">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Bottom Menu */}
        <div className="border-t border-gray-200 p-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isSettings = item.name === 'Settings';
            return (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                className={`w-full flex items-center p-3 rounded-lg mb-1 transition-colors ${
                  isSettings && activeMenuItem === 'Settings'
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-3 text-sm font-medium">{item.name}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="ml-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-blue-700 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">🇬🇧</span>
                </div>
                <span className="text-sm text-gray-700">English</span>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Test User</div>
                  <div className="text-gray-500">Admin</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;