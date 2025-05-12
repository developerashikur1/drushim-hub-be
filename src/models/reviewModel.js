import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    minlength: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to prevent duplicate reviews
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(courseId) {
  const stats = await this.aggregate([
    {
      $match: { course: courseId }
    },
    {
      $group: {
        _id: '$course',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Course').findByIdAndUpdate(courseId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      studentsCount: stats[0].totalReviews
    });
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.course);
});

// Call calculateAverageRating after delete
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.course);
});

// module.exports = mongoose.model('Review', reviewSchema);

const Review = mongoose.model('Review', reviewSchema);
export default Review;