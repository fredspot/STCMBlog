import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

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
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 20px' }}>
        <h1 style={{ fontWeight: 'bold' }}>{article.title}</h1>
        <p>Written by {article.author} on {article.created.substring(0, 10)}</p>
        <hr />
        <ReactMarkdown
          renderers={{
            heading: ({ level, children }) => (
              React.createElement(`h${level}`, { style: { fontWeight: 'bold' } }, children)
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
        <hr style={{ marginTop: '1rem' }} />
      </div>
    </div>
  );
};

export default Article;
