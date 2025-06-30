import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email address!`,
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
            select: false, // Don't include password in queries by default
        },
        avatar: {
            type: String,
            default: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        },
        // firstName: {
        //   type: String,
        //   trim: true,
        // },
        // lastName: {
        //   type: String,
        //   trim: true,
        // },
        fullName: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ['candidate', 'recruiter'],
            default: 'candidate',
        },
        verified: {
            type: Boolean,
            default: false,
        },
        subscription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PricingTier',
        },
        usedCreditCount: {
            type: Number,
            default: 0,
        },
        verificationToken: String,
        verificationTokenExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        image: {
            type: String,
            default: null,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
            default: null,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Remove duplicate index declaration and keep only one
userSchema.index({ verificationToken: 1 });
userSchema.index({ resetPasswordToken: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// Method to check if account is locked
userSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = async function () {
    // If lock has expired, reset attempts and remove lock
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return await this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 },
        });
    }

    // Otherwise increment attempts
    const updates = { $inc: { loginAttempts: 1 } };

    // Lock account if attempts reach 5
    if (this.loginAttempts + 1 >= 5) {
        updates.$set = { lockUntil: Date.now() + 3600000 }; // Lock for 1 hour
    }

    return await this.updateOne(updates);
};

const User = mongoose.model('User', userSchema);

export default User;
