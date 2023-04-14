import React, { useState } from 'react';

const ShareButton = ({ id }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const articleUrl = `${window.location.origin}/articles/${id}`;
    navigator.clipboard.writeText(articleUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Failed to copy text: ', err);
      }
    );
  };

  return (
    <button
      onClick={copyToClipboard}
      style={{
        margin: '10px',
        backgroundColor: '#f3f3f3',
        borderRadius: '4px',
        padding: '4px 8px',
        border: 'none',
        fontSize: '14px',
        cursor: 'pointer',
      }}
    >
      {copied ? 'Copied!' : <>&#60;&#47;&#62;</>}
    </button>
  );
};

export default ShareButton;
