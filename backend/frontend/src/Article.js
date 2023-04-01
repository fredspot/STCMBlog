import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
          components={{
            h1: ({ children }) => <h1 style={{ fontWeight: 'bold' }}>{children}</h1>,
            h2: ({ children }) => <h2 style={{ fontWeight: 'bold' }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ fontWeight: 'bold' }}>{children}</h3>,
            h4: ({ children }) => <h4 style={{ fontWeight: 'bold' }}>{children}</h4>,
            h5: ({ children }) => <h5 style={{ fontWeight: 'bold' }}>{children}</h5>,
            h6: ({ children }) => <h6 style={{ fontWeight: 'bold' }}>{children}</h6>,
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
