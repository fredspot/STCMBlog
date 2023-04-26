import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Article from './Article';
import CreateArticle from './CreateArticle';
import EditArticle from './EditArticle';
import NavBar from './NavBar';
import Login from './Login';
import About from './About';
import Search from './Search';
import TagsFilter from './TagsFilter';
import { useParams } from 'react-router-dom';

const App = () => {
  const [latestIds, setLatestIds] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const location = useLocation();
  const ArticleWrapper = () => {
    const { id } = useParams();
    return <Article id={id} />;
  };

  const EditArticleWrapper = () => {
    const { id } = useParams();
    return <EditArticle id={id} />;
  };

  const handleTagClick = async (tag) => {
    const response = await fetch(`/api/articles?tag=${tag}`); // `http://localhost:8080/api/articles?tag=${tag}`
    const data = await response.json();
    setFilteredArticles(data.map(article => article.id)); // Extract the article IDs from the fetched data
  };
  

  useEffect(() => {
    const fetchLatestIds = async () => {
      const response = await fetch('/api/articles/latest?count=10'); //'http://localhost:8080/api/articles/latest?count=10'
      const data = await response.json();
      setLatestIds(data);
    };
    fetchLatestIds();
  }, []);

  return (
    <>
      <NavBar />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
        }}
      >
        <div
          className="main-content"
          style={{
            flex: '1',
            maxWidth: '80%',
            display: 'flex',
          }}
        >
          <div
            className="content-wrapper"
            style={{
              flex: '1',
            }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    {(filteredArticles.length > 0 ? filteredArticles : latestIds).map((id) => (
                      <Article key={id} id={id} />
                    ))}
                  </div>
                }
              />
              <Route path="/articles/:id" element={<ArticleWrapper />} />
              <Route path="/create-article" element={<CreateArticle />} />
              <Route path="/edit-article/:id" element={<EditArticleWrapper />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </div>
          {location.pathname === '/' && (
            <div
              className="tags-filter"
              style={{
                marginLeft: '20px',
              }}
            >
              <TagsFilter onTagClick={handleTagClick} />
            </div>
          )}
        </div>
      </div>
    </>
  );
  
  
};

export default App;
