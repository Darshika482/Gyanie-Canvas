import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Click to edit',
  multiline = false,
  tag = 'span'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        (inputRef.current as HTMLTextAreaElement).setSelectionRange(
          editValue.length,
          editValue.length
        );
      } else {
        (inputRef.current as HTMLInputElement).setSelectionRange(
          editValue.length,
          editValue.length
        );
      }
    }
  }, [isEditing, editValue.length]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };

  if (isEditing) {
    // Check if the component is in a dark context by looking for dark text classes
    const isDarkContext = className.includes('text-slate-') || className.includes('text-gray-') || className.includes('text-white');

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${className} border-2 border-teal-500 rounded px-2 py-1 resize-none min-h-[100px] ${isDarkContext ? 'bg-slate-700 text-slate-200' : 'bg-white text-gray-900'} shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
          placeholder={placeholder}
          rows={4}
        />
      );
    } else {
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${className} border-2 border-teal-500 rounded px-2 py-1 ${isDarkContext ? 'bg-slate-700 text-slate-200' : 'bg-white text-gray-900'} shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-w-0`}
          placeholder={placeholder}
        />
      );
    }
  }

  const Tag = tag;
  return (
    <Tag
      onClick={handleClick}
      className={`${className} cursor-text hover:bg-gray-50 rounded px-1 py-0.5 transition-colors ${!value ? 'text-gray-400' : ''
        }`}
      title="Click to edit"
    >
      {value || placeholder}
    </Tag>
  );
};

export default EditableText;