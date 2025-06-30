import mongoose from 'mongoose';


const scheduleSchema = new mongoose.Schema(
  {
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     auto: true, 
    // },
    platform: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    groupId: {
  type: [String],
  required: true,
  validate: [array => array.length > 2, 'At least 3 groupId is required.']
},
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      required: true,
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

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
