// Для хеширования паролей
const bcrypt = require('bcryptjs')
// Для создания токенов
const jwt = require('jsonwebtoken')
const { secret, expiresIn } = require('../config/auth.config')
const prisma = require('../config/prisma');

const register = async (req, res) => {
  console.log('prisma in register:', prisma);
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      secret,
      {expiresIn}
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    })
  } catch (err) {
    console.log('Register error:', err)
    res.status(500).json({error: err.message})
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({error: 'Email and password required'})
    }

    const user = await prisma.user.findUnique({
      where: {email}
    })

    if (!user) {
      return res.status(401).json({error: 'Invalid credentials'})
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({error: 'Invalid credentials'})
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      secret,
      {expiresIn}
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    })
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
}

// Получение информации о текущем пользователе
const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        tasks: {
          select: {
            id: true,
            title: true,
            completed: true
          }
        }
      }
    });

    res.json(user);
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  me
}
