
import React from 'react';

interface EditableTextProps {
  text: string;
  className?: string;
  onChange: (newText: string) => void;
  // Use React.JSX to fix the "Cannot find namespace 'JSX'" error
  tag?: keyof React.JSX.IntrinsicElements;
}

export const EditableText: React.FC<EditableTextProps> = ({ text, className = "", onChange, tag = "div" }) => {
  const Tag = tag as any;
  
  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    onChange(e.currentTarget.innerText);
  };

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={handleInput}
      className={`cursor-text focus:outline-none transition-all duration-200 ${className}`}
      onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent slide advance when clicking to edit
    >
      {text}
    </Tag>
  );
};
