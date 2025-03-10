import React from 'react';

interface ContentCardProps {
  title: string;
  body: string;
  imageUrl: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, body, imageUrl }) => {
  return (
    <div className="flex flex-col p-4 space-y-4 rounded-lg bg-gray-800 backdrop-blur-lg bg-opacity-40 shadow-lg">
      {/* Image Section */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-48 h-48 object-cover rounded-md"
        />
      )}

      {/* Title */}
      <h2 className="text-2xl font-bold text-white">{title}</h2>

      {/* Body */}
      <p className="text-gray-300">{body}</p>
    </div>
  );
};

export default ContentCard;
