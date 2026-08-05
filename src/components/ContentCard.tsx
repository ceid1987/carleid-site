import React from 'react';

interface ContentCardProps {
  title: string;
  body: string;
  imageUrl: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, body, imageUrl }) => {
  return (
    <div className="flex flex-col p-5 space-y-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
      {/* Image Section */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-48 h-48 object-cover rounded-lg"
        />
      )}

      {/* Title */}
      <h2 className="text-2xl font-medium tracking-tight text-white">{title}</h2>

      {/* Body */}
      <p className="text-dim">{body}</p>
    </div>
  );
};

export default ContentCard;
