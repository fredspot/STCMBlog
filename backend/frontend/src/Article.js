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
      <div style={{ maxWidth: '740px', width: '100%', padding: '40px 20px' }}>
        <h1 style={{ fontWeight: 'bold', fontSize: '48px', lineHeight: '56px', marginBottom: '10px' }}>{article.title}</h1>
        <p style={{ fontSize: '18px', lineHeight: '24px', color: 'gray', marginBottom: '20px' }}>Written by {article.author} on {article.created.substring(0, 10)}</p>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px', marginRight: '10px' }}>{article.category}</div>
          {article.tags.map((tag, index) => (
            <div key={index} style={{ fontSize: '14px', backgroundColor: '#f3f3f3', borderRadius: '4px', padding: '4px 8px', marginRight: '6px' }}>{tag}</div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '10px' }}>Likes: {article.likes}</div>
        </div>
        <hr style={{ marginBottom: '20px' }} />
        <ReactMarkdown
          components={{
            p: ({ children }) => <p style={{ fontSize: '21px', lineHeight: '32px', marginBottom: '20px' }}>{children}</p>,
            h1: ({ children }) => <h1 style={{ fontWeight: 'bold', fontSize: '36px', lineHeight: '40px', marginBottom: '20px' }}>{children}</h1>,
            h2: ({ children }) => <h2 style={{ fontWeight: 'bold', fontSize: '32px', lineHeight: '36px', marginBottom: '20px' }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ fontWeight: 'bold', fontSize: '28px', lineHeight: '32px', marginBottom: '20px' }}>{children}</h3>,
            h4: ({ children }) => <h4 style={{ fontWeight: 'bold', fontSize: '24px', lineHeight: '28px', marginBottom: '20px' }}>{children}</h4>,
            h5: ({ children }) => <h5 style={{ fontWeight: 'bold', fontSize: '20px', lineHeight: '24px', marginBottom: '20px' }}>{children}</h5>,
            h6: ({ children }) => <h6 style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '20px', marginBottom: '20px' }}>{children}</h6>,
          }}
          >
            {article.content}
          </ReactMarkdown>
          <hr style={{ marginTop: '40px', marginBottom: '40px' }} />
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginRight: '10px' }}>{article.category}</div>
              {article.tags.map((tag, index) => (
                <div key={index} style={{ fontSize: '14px', backgroundColor: '#f3f3f3', borderRadius: '4px', padding: '4px 8px', marginRight: '6px' }}>{tag}</div>
              ))}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Likes: {article.likes}</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Article;
  
