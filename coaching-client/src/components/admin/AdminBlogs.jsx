import React from 'react';

const AdminBlogs = ({
  blogs,
  blogForm,
  setBlogForm,
  editingBlogId,
  setEditingBlogId,
  handleBlogSubmit,
  handleEditBlog,
  cancelEditBlog,
  handleDelete,
  loading,
  handleInputChange,
  blogImage,
  setBlogImage,
  existingBlogImage,
  setExistingBlogImage,
  API_BASE_URL
}) => (
  <div className="space-y-8">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {editingBlogId ? 'Edit Blog' : 'Add New Blog'}
      </h3>
      <form onSubmit={handleBlogSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Blog Title"
          value={blogForm.title}
          onChange={(e) => handleInputChange(e, setBlogForm)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <textarea
          name="content"
          placeholder="Blog Content"
          value={blogForm.content}
          onChange={(e) => handleInputChange(e, setBlogForm)}
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          name="author"
          placeholder="Author Name"
          value={blogForm.author}
          onChange={(e) => handleInputChange(e, setBlogForm)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div>
          <label htmlFor="blogImage" className="block text-sm font-medium text-gray-700 mb-1">
            Blog Image
          </label>
          <input
            id="blogImage"
            type="file"
            accept="image/*"
            onChange={(e) => setBlogImage(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {(blogImage || existingBlogImage) && (
            <p className="text-xs text-gray-500 mt-1">
              {blogImage ? `Selected: ${blogImage.name}` : `Current: ${existingBlogImage}`}
            </p>
          )}
          {(blogImage || existingBlogImage) && (
            <img
              src={
                blogImage
                  ? URL.createObjectURL(blogImage)
                  : existingBlogImage
              }
              alt="Blog Preview"
              className="mt-2 h-24 rounded object-cover"
            />
          )}
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-yellow-400 text-gray-900 py-2 px-4 rounded-md hover:bg-[#473391] hover:text-white disabled:opacity-50"
          >
            {loading ? 'Processing...' : (editingBlogId ? 'Update Blog' : 'Add Blog')}
          </button>
          {editingBlogId && (
            <button
              type="button"
              onClick={cancelEditBlog}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Blogs List ({blogs.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length === 0 ? (
          <p className="text-gray-500 col-span-full">No blogs added yet.</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h4>
              <p className="text-gray-600 mb-2">{blog.content?.slice(0, 100)}...</p>
              <p className="text-sm text-gray-500 mb-1">Author: {blog.author}</p>
              {blog.image_url && (
                <img
                  src={`${API_BASE_URL}${blog.image_url}`}
                  alt={blog.title}
                  className="h-24 w-full object-cover rounded mb-2"
                />
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditBlog(blog)}
                  className="flex-1 bg-yellow-400 text-gray-900 py-1 px-3 rounded text-sm hover:bg-[#473391] hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id, 'blogs')}
                  className="flex-1 bg-red-600 text-white py-1 px-3 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default AdminBlogs;
