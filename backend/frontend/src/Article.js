import React, { useState, useEffect, useContext, useRef } from 'react'; // Add useRef to imports
import { withRouter, useNavigate  } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { AuthContext } from './AuthProvider';
import ShareButton from './ShareButton';

const Article = ({ id, history }) => {
  const [article, setArticle] = useState(null);
  const { username } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await fetch(`http://localhost:8080/api/articles/${id}`);
      const data = await response.json();
      setArticle(data);
    };
    fetchArticle();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-article/${id}`);
  };

  const handleDelete = async () => {
    await fetch(`http://localhost:8080/api/articles/${id}`, {
      method: 'DELETE',
    });
    navigate('/');
  };

  // Add the following useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!article) {
    return <div></div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '740px', width: '100%', padding: '40px 20px' }}>
        <h1 style={{ fontWeight: 'bold', fontSize: '48px', lineHeight: '56px', marginBottom: '10px' }}>{article.title}</h1>
        <p style={{ fontSize: '18px', lineHeight: '24px', color: 'gray', marginBottom: '20px' }}>Written by {article.author} on {article.created.substring(0, 10)}</p>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', marginRight: '10px' }}>{article.category}</div>
            {article.tags.map((tag, index) => (
              <div key={index} style={{ fontSize: '14px', backgroundColor: '#f3f3f3', borderRadius: '4px', padding: '4px 8px', marginRight: '6px' }}>{tag}</div>
            ))}
          </div>
          <ShareButton id={id} />
        </div>
        <div className="dropdown-container">
          {username && article.author === username && (
            <div className="dropdown" ref={dropdownRef}>
              <button className="dropdown-button" onClick={() => setShowDropdown(!showDropdown)}>⋮</button>
              {showDropdown && (
                <div className="dropdown-content">
                  <button onClick={handleEdit}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          )}
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
            img: ({ node, ...props }) => <img {...props} style={{ maxWidth: '100%', height: 'auto' }} />,
          }}
          >
            {article.content}
          </ReactMarkdown>
          <hr style={{ marginTop: '40px', marginBottom: '40px' }} />
        </div>
      </div>
    );
  };
  
  export default Article;
  
