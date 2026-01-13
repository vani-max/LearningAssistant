import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

export const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);
        res.status(201).json({ user, token , message: 'User registered successfully'});
    } catch (error) {
        console.log(error)
        next(error);
    }
}
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      user,
      token,
      message: "User logged in successfully"
    });

  } catch (error) {
    next(error);
  }
};



export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ user });
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    const { username, email, profileImage } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.username = username;
        user.email = email;
        user.profileImage = profileImage;
        await user.save();
        res.json({ user, message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req, res, next) => {
    const { currPassword, newPassword } = req.body;
    if(!currPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
    }
    try {
        const user = await User.findById(req.user._id).select('+password');
        if (!(await user.matchPassword(currPassword))) {
            return res.status(401).json({ message: 'Invalid current password' });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
}

