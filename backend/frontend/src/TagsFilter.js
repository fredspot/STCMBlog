import React, { useState, useEffect } from 'react';

const TagsFilter = ({ onTagClick }) => {
  const [tags, setTags] = useState([]);

  const fetchTags = async () => {
    const response = await fetch('http://localhost:8080/api/tags');
    const data = await response.json();
    setTags(data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleClick = (tag) => {
    onTagClick(tag);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '25%',
      }}
    >
      {tags
        .sort((a, b) => a.localeCompare(b)) // Sort the tags array in alphabetical order
        .map((tag, index) => (
          <div
            key={index}
            onClick={() => handleClick(tag)}
            style={{
              fontSize: '14px',
              backgroundColor: '#f3f3f3',
              borderRadius: '4px',
              padding: '4px 8px',
              marginRight: '6px',
              marginBottom: '6px',
              cursor: 'pointer',
            }}
          >
            {tag}
          </div>
        ))}
    </div>
  );
};

export default TagsFilter;
