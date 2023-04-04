import React from 'react';

const About = () => {
  const authors = [
    {
      name: 'Minv',
      description: 'Minv is an experienced software engineer with a passion for web development and artificial intelligence.',
      imageUrl: 'https://i.imgur.com/495GE0k.png',
    },
    {
      name: 'Gok',
      description: 'Gok is a talented full-stack developer who enjoys creating innovative solutions and sharing his knowledge.',
      imageUrl: 'https://i.imgur.com/Jo0ICUj.png',
    },
    {
      name: 'Gehau',
      description: 'Gehau is a skilled programmer who loves building applications that make a difference in people\'s lives.',
      imageUrl: 'https://i.imgur.com/neExDCn.png',
    },
    {
      name: 'Psybot',
      description: 'Psybot is a dedicated developer with expertise in machine learning and a focus on user experience.',
      imageUrl: 'https://i.imgur.com/Lj0LPGg.png',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
      <h1>About the Authors</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {authors.map((author, index) => (
          <div key={index} style={{ maxWidth: '300px', width: '100%', padding: '20px', boxSizing: 'border-box' }}>
            <img src={author.imageUrl} alt={author.name} style={{ width: '100%', height: 'auto' }} />
            <h2>{author.name}</h2>
            <p>{author.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;