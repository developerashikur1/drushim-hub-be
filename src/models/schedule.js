import mongoose from 'mongoose';


const scheduleSchema = new mongoose.Schema(
    {
        // _id: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     auto: true, 
        // },
        platform: {
            type: String,
            required: false,
        },
        date: {
            type: String,
            required: false,
        },
        content: {
            type: String,
            required: false,
        },
        groupId: {
            type: [String],
            required: false,
            // validate: [array => array.length > 2, 'At least 3 groupId is required.']
        },
        scheduleDates: {
            type: [String],
            required: false,
        },
        platforms: {
            type: [String],
            required: false,
        },
        groups: {
            type: [[String]],
            default: [],
            validate: {
                validator: function (value) {
                    return Array.isArray(value) && value.every(
                        arr => Array.isArray(arr) && arr.every(str => typeof str === 'string')
                    );
                },
                
                message: 'groups must be a 2D array of strings'
            }
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
