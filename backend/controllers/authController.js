import User from '../models/User.js'
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id, user.email)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Generate token
    const token = generateToken(user._id, user.email)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body

    // Verify Google token (this is simplified - implement proper verification)
    // In production, use google-auth-library to verify the token

    // For now, assume token is valid and contains user info
    // You would extract user info from the token in production

    let user = await User.findOne({ googleId: token })

    if (!user) {
      // Create new user (in production, extract info from Google token)
      user = new User({
        name: 'Google User',
        email: `google-${token}@example.com`,
        password: 'google-oauth',
        googleId: token,
      })
      await user.save()
    }

    const jwtToken = generateToken(user._id, user.email)

    res.json({
      message: 'Google login successful',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res) => {
  res.json({ message: 'Logout successful' })
}

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { name, monthlySalary, preferences } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, monthlySalary, preferences },
      { new: true }
    ).select('-password')

    res.json({
      message: 'Profile updated successfully',
      user,
    })
  } catch (error) {
    next(error)
  }
}
