import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [searchInput, setSearchInput] = useState('');
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const searchArticles = async (query) => {
    if (query) {
      const response = await fetch(`/api/search?q=${query}`); //`http://localhost:8080/api/search?q=${query}`
      const data = await response.json();
      setArticles(data);
    } else {
      setArticles([]);
    }
  };

  const debouncedSearchArticles = debounce(searchArticles, 300);

  useEffect(() => {
    debouncedSearchArticles(searchInput);
  }, [searchInput]);

  const handleArticleClick = (articleId) => {
    setSearchInput('');
    setArticles([]);
    navigate(`/articles/${articleId}`);
  };

  return (
    <div style={{ position: 'relative', marginRight: '20px', width: '400px' }}> {/* Increase the width of the parent container */}
      <input
        type="text"
        placeholder="Search for articles..."
        value={searchInput}
        onChange={handleSearchInput}
        style={{
          width: '100%',
          maxWidth: '400px', // Increase the maxWidth for a longer search bar
          padding: '6px', // Reduce the padding for a smaller height
          borderRadius: '10px', // Increase the borderRadius for a less squarish shape
          border: '1px solid #ccc',
        }}
      />
      {searchInput && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            zIndex: 10,
          }}
        >
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => handleArticleClick(article.id)}
              style={{
                padding: '12px',
                cursor: 'pointer',
              }}
            >
              <h4 style={{ margin: 0 }}>{article.title}</h4>
              <p style={{ margin: 0 }}>{article.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
