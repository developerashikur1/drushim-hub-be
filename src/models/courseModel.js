const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['frontal', 'digital'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  instructor: {
    name: String,
    title: String,
    image: String
  },
  duration: String,
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  location: {
    he: String,
    en: String
  },
  startDate: Date,
  meetingsCount: Number,
  availableSeats: Number,
  videosCount: Number,
  totalHours: Number,
  certificateIncluded: Boolean,
  rating: {
    type: Number,
    default: 0
  },
  studentsCount: {
    type: Number,
    default: 0
  },
  prerequisites: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
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

    const existingCourse = await mongoose.model('Course').findOne(query);
    if (!existingCourse) {
      exists = false;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
}

// Pre-save middleware
courseSchema.pre('save', async function(next) {
  if (this.isModified('title')) {
    try {
      this.slug = await generateUniqueSlug(this.title, this._id);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Pre-update middleware
courseSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.title) {
    try {
      update.slug = await generateUniqueSlug(update.title, this._conditions._id);
      this.setUpdate(update);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);