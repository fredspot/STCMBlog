import React, { useState, useEffect } from 'react';

const Article = ({ id }) => {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await fetch(`http://localhost:8080/api/articles/${id}`);
      const data = await response.json();
      setArticle(data);
    };
    fetchArticle();
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
};

export default Article;
