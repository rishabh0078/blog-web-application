import Blog from '../models/Blog.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'name email');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    let imageUrl = '';
    let imagePublicId = '';

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'blog-images',
          resource_type: 'auto',
        });

        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
      authorName: req.user.name,
      image: imageUrl,
      imagePublicId: imagePublicId,
    });

    const populatedBlog = await Blog.findById(blog._id).populate('author', 'name email');
    res.status(201).json(populatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    const { title, content } = req.body;

    // Update fields
    blog.title = title || blog.title;
    blog.content = content || blog.content;

    // Handle image update
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (blog.imagePublicId) {
          await cloudinary.uploader.destroy(blog.imagePublicId);
        }

        // Upload new image
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'blog-images',
          resource_type: 'auto',
        });

        blog.image = result.secure_url;
        blog.imagePublicId = result.public_id;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    }

    const updatedBlog = await blog.save();
    const populatedBlog = await Blog.findById(updatedBlog._id).populate('author', 'name email');
    
    res.json(populatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    // Delete image from Cloudinary if exists
    if (blog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's blogs
// @route   GET /api/blogs/user/me
// @access  Private
export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
