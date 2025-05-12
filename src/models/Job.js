import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     auto: true, // Automatically generated if not provided
    //   },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    benefits: [String],
    skills: [String],
    experience: String,
    education: String,
    startDate: String,
    remote: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
