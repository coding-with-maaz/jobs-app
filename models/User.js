const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Make sure to install: npm install bcrypt

const userSchema = new mongoose.Schema(
    {
        // Password field (hashed before saving to the DB)
        password: {
            type: String,
            required: true,
            select: false, // 'select: false' ensures this field isn't returned by default in queries
        },

        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },

        // 1. Profile Picture (store as a URL or file path)
        profilePicture: {
            type: String,
            default: '',
        },

        // 2. Personal Information
        personalInformation: {
            firstName: {
                type: String,
                required: true,
                trim: true,
            },
            lastName: {
                type: String,
                required: true,
                trim: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
                trim: true,
                lowercase: true,
            },
            phone: {
                type: String,
                required: false,
                trim: true,
            },
            location: {
                type: String,
                required: false,
                trim: true,
            },
        },

        // 3. Bio (Short Description)
        bio: {
            type: String,
            default: '',
            trim: true,
            maxlength: 500,
        },

        // 4. Job Preferences
        jobPreferences: {
            preferredLocation: {
                type: String,
                default: '',
                trim: true,
            },
            minSalary: {
                type: Number,
                default: 0,
            },
            maxSalary: {
                type: Number,
                default: 0,
            },
            openToRemote: {
                type: Boolean,
                default: false,
            },
        },

        // 5. Skills (Array of strings)
        skills: {
            type: [String],
            default: [],
        },

        // 6. Privacy Settings
        privacySettings: {
            profileVisibleToEmployers: {
                type: Boolean,
                default: true,
            },
            showEmail: {
                type: Boolean,
                default: false,
            },
            showPhoneNumber: {
                type: Boolean,
                default: false,
            },
        },

        // 7. Notifications
        notifications: {
            jobAlerts: {
                type: Boolean,
                default: true,
            },
            applicationUpdates: {
                type: Boolean,
                default: true,
            },
            messages: {
                type: Boolean,
                default: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Pre-save hook to hash the password before saving
 */
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Hash password with a salt round of 10 (adjust if needed)
        const hashed = await bcrypt.hash(this.password, 10);
        this.password = hashed;
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Instance method to compare raw password with the hashed password
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
