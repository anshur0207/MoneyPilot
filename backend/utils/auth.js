import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

export const comparePassword = (password, hash) => {
  return bcryptjs.compare(password, hash)
}

export const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}
