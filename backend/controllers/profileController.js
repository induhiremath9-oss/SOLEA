const User = require("../models/User");

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user: user
        });

    } catch (error) {
        console.error("Get Profile Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, college, branch, skills, bio } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update only fields that are provided
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (college !== undefined) user.college = college;
        if (branch !== undefined) user.branch = branch;
        if (skills !== undefined) user.skills = skills;
        if (bio !== undefined) user.bio = bio;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                college: user.college,
                branch: user.branch,
                skills: user.skills,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getProfile,
    updateProfile
};