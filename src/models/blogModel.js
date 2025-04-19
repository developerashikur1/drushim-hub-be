const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  coverImage: {
    type: String
  },
  tags: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readTime: {
    type: Number,
    default: 5
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique slug
async function generateUniqueSlug(title, existingId = null) {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
    locale: 'en'
  });

  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const query = { slug };
    if (existingId) {
      query._id = { $ne: existingId };
    }

    const existingBlog = await mongoose.model('Blog').findOne(query);
    if (!existingBlog) {
      exists = false;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
}

// Pre-save middleware
blogSchema.pre('save', async function(next) {
  if (this.isModified('title')) {
    try {
      this.slug = await generateUniqueSlug(this.title, this._id);
    } catch (error) {
      return next(error);
    }
  }
  this.updatedAt = Date.now();
  next();
});

// Pre-update middleware
blogSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.title) {
    try {
      update.slug = await generateUniqueSlug(update.title, this._conditions._id);
    } catch (error) {
      return next(error);
    }
  }
  update.updatedAt = Date.now();
  this.setUpdate(update);
  next();
});

module.exports = mongoose.model('Blog', blogSchema);