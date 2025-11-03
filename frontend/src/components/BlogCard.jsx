import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogCard = ({ blog }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Strip HTML tags for preview
  const getTextPreview = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > 120 ? text.substring(0, 120) + '...' : text;
  };

  return (
    <Link to={`/blog/${blog._id}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col transform hover:-translate-y-1">
        {blog.image && (
          <div className="relative overflow-hidden h-56">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="font-medium">{blog.authorName}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center space-x-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {blog.title}
          </h2>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {getTextPreview(blog.content)}
          </p>

          <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
            <span>Read Article</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
