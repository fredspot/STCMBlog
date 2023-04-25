import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const EditArticle = ({ id }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('Investing');
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, username } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await fetch(`http://localhost:8080/api/articles/${id}`); //`/api/articles/${id}`
      const data = await response.json();

      setTitle(data.title);
      setContent(data.content);
      setTags(data.tags.join(', '));
      setCategory(data.category);
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const response = await fetch(`http://localhost:8080/api/articles/${id}`, { //`/api/articles/${id}`
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        author: username,
        category,
        tags: tags.split(',').map((tag) => tag.trim()).join(','),
      }),
    });

    if (response.ok) {
      navigate(`/article/${id}`);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5">
            <div className="card-header">Create a new article</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    rows="10"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="Investing">Investing</option>
                    <option value="Macro">Macro</option>
                    <option value="DD">DD</option>
                    <option value="Misc">Misc</option>
                  </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="tags" className="form-label">
                        Tags
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      value={tags}
                      placeholder="tag1, tag2, tag3"
                      onChange={(e) => setTags(e.target.value)}
                    />
                    <small className="form-text text-muted">
                        Separate tags with commas.
                    </small>
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;
