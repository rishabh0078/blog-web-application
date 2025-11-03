import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import { Edit, Trash2, Calendar, Eye, PlusCircle } from 'lucide-react';

const MyBlogs = () => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const { data } = await API.get('/blogs/user/me');
      setBlogs(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your blogs');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        setDeleting(id);
        await API.delete(`/blogs/${id}`);
        setBlogs(blogs.filter((blog) => blog._id !== id));
        setDeleting(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete blog');
        setDeleting(null);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Blogs</h1>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
              <p className="mt-4 text-gray-600">
                Manage all your published blogs in one place
              </p>
            </div>
            <Link
              to="/create"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
            >
              <PlusCircle className="h-5 w-5" />
              <span>New Blog</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Blogs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{blogs.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Author</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{user?.name}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Edit className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Latest Post</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {blogs.length > 0 ? formatDate(blogs[0].createdAt) : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-r-lg shadow-sm mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Blogs List */}
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Edit className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No blogs yet</h3>
            <p className="text-gray-600 text-lg mb-8">Start sharing your thoughts with the world!</p>
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create Your First Blog</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  {blog.image && (
                    <div className="md:w-64 h-48 md:h-auto">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link to={`/blog/${blog._id}`}>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {formatDate(blog.createdAt)}</span>
                          </div>
                          {blog.updatedAt !== blog.createdAt && (
                            <div className="flex items-center space-x-1">
                              <Edit className="h-4 w-4" />
                              <span>Updated {formatDate(blog.updatedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 mt-4">
                      <Link
                        to={`/blog/${blog._id}`}
                        className="flex items-center space-x-1.5 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                      <Link
                        to={`/edit/${blog._id}`}
                        className="flex items-center space-x-1.5 text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all font-medium"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={deleting === blog._id}
                        className="flex items-center space-x-1.5 text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-all font-medium disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{deleting === blog._id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
