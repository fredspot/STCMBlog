import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Article from './Article';
import CreateArticle from './CreateArticle';
import EditArticle from './EditArticle';
import NavBar from './NavBar';
import Login from './Login';
import About from './About';
import { useParams } from 'react-router-dom';

const App = () => {
  const [latestIds, setLatestIds] = useState([]);
  const ArticleWrapper = () => {
    const { id } = useParams();
    return <Article id={id} />;
  };

  const EditArticleWrapper = () => {
    const { id } = useParams();
    return <EditArticle id={id} />;
  };

  useEffect(() => {
    const fetchLatestIds = async () => {
      const response = await fetch('http://localhost:8080/api/articles/latest?count=10');
      const data = await response.json();
      setLatestIds(data);
    };
    fetchLatestIds();
  }, []);

  return (
    <>
      <NavBar />
      <div>
        <div className="main-content">
        <Routes>
          <Route path="/" element={<div>{latestIds.map(id => <Article key={id} id={id} />)}</div>} />
          <Route path="/article/:id" element={<ArticleWrapper />} />
          <Route path="/create-article" element={<CreateArticle />} />
          <Route path="/edit-article/:id" element={<EditArticleWrapper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
        </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
