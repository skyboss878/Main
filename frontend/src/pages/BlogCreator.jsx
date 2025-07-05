import React, { useState } from 'react';

const BlogCreator = () => {
  const [topic, setTopic] = useState('');
  const [blog, setBlog] = useState('');

  const generateBlog = async () => {
    // Call backend (connect to OpenAI or Claude)
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    const data = await response.json();
    setBlog(data.blog);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Blog Creator</h1>
      <input
        type="text"
        className="border p-2 w-full rounded mb-4"
        placeholder="Enter a topic (e.g. 'Best AI tools for restaurants')"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button onClick={generateBlog} className="bg-purple-600 text-white px-4 py-2 rounded">
        Generate Blog
      </button>
      <div className="mt-6 bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Generated Blog:</h2>
        <p>{blog}</p>
      </div>
    </div>
  );
};

export default BlogCreator;
