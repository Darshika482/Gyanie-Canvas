import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  className?: string;
}

const EditableList: React.FC<EditableListProps> = ({
  items,
  onChange,
  placeholder = 'Add item',
  className = ''
}) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    onChange(updatedItems);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className={className}>
      <ul className="space-y-2 mb-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start space-x-2 group">
            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdateItem(index, e.target.value)}
              className="flex-1 text-sm text-gray-700 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-teal-500 focus:rounded px-1 py-0.5"
            />
            <button
              onClick={() => handleRemoveItem(index)}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center space-x-2">
        <Plus className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 text-sm text-gray-600 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-teal-500 focus:rounded px-1 py-0.5"
        />
        <button
          onClick={handleAddItem}
          disabled={!newItem.trim()}
          className="text-teal-500 hover:text-teal-700 disabled:text-gray-300 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default EditableList;