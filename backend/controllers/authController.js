const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, department, rollNumber, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "student",
            department: department || "",
            rollNumber: rollNumber || "",
            phone: phone || "",
            status: "Active"
        });

        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createStaffCoordinator = async (req, res) => {
    try {
        const { name, email, password, department, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "organizer",
            department: department || "",
            rollNumber: "",
            phone: phone || "",
            status: "Active"
        });

        res.status(201).json({
            message: "Staff coordinator created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                phone: user.phone,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        if (user.status === "Suspended") {
            return res.status(403).json({ message: "Your account is suspended. Please contact the administrator." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                rollNumber: user.rollNumber,
                phone: user.phone,
                volunteerHours: user.volunteerHours,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, department, rollNumber } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, department, rollNumber },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile Updated Successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin only: Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const { role, department } = req.query;
        let query = {};
        if (role) query.role = role;
        if (department) query.department = department;

        const users = await User.find(query).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin only: Manage user status
exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, role } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (role) updateData.role = role;

        const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User status updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
