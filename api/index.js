const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://blog-app-rose-kappa.vercel.app',
  credentials: true
}));
app.use(express.json());

// Environment Variables
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGODB_URL;

// MongoDB connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Could not connect to MongoDB:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// User schema and model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);


// Blog schema and model
const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    externalLink: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});
const Blog = mongoose.model('Blog', BlogSchema);

// Register Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Create Blog Route
app.post('/blogs/create', async (req, res) => {
    const { title, content, author, category, externalLink } = req.body;
    if (!title || !content || !author || !category) {
        return res.status(400).json({ message: 'Please fill all the required fields' });
    }
    try {
        const newBlog = new Blog({
            title,
            content,
            author,
            category,
            externalLink,
        });
        await newBlog.save();
        res.status(200).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Error creating blog, please try again' });
    }
});

// Get Blogs Route
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({ blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Error fetching blogs' });
    }
});

// Get Latest Blogs (Top 3)
app.get('/blogs/latest', async (req, res) => {
    try {
        const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(3);
        res.status(200).json({ blogs: latestBlogs });
    } catch (error) {
        console.error('Error fetching latest blogs:', error);
        res.status(500).json({ message: 'Error fetching latest blogs' });
    }
});

// Search Blogs (based on title, content, or category)
app.get('/blogs/search', async (req, res) => {
    const query = req.query.q || '';  // Search query from the frontend
    try {
        const searchResults = await Blog.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json({ blogs: searchResults });
    } catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({ message: 'Error searching blogs' });
    }
});

// Get Blog by ID Route
app.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ blog });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog' });
    }
});

// Fetch user details (username and password) based on username
app.get('/users/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select('username password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            username: user.username,
            password: user.password,
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Blog Route
app.put('/blogs/:id', async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, 
            { title, content, category }, { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json({ message: 'Blog updated successfully', updatedBlog });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update blog' });
    }
});

// Delete Blog Route
app.delete('/blogs/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete blog' });
    }
});

    // Assuming you are using express.js:

const router = express.Router();

// Fetch user details based on username
router.get('/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Find user by username, only return the username and password
    const user = await User.findOne({ username }).select('username password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      username: user.username,
      password: user.password, // Send password, though not recommended in production
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

// Route to login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = user;
      next();
    });
  };
  
  // Route to get user details by username
  router.get('/:username', authenticateToken, async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Optionally, you can hide the password when sending the user details
      const { password, ...userDetails } = user.toObject();
      res.json(userDetails);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  module.exports = router;
  // Route to login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  const fetchPosts = async () => {
    try {
      const response = await fetch('https://react-blog-j51y.onrender.com/api/posts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts');9999    
    }
  };
  // const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');



app.use(bodyParser.json());

// Create a transporter object using SMTP transport (this example uses Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Your email address
    pass: 'your-email-password', // Your email password or app password (if 2FA enabled)
  },
});

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Add user registration logic here (e.g., save to database)

    // Send confirmation email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Welcome to Our Platform!',
      text: `Hi ${username},\n\nThank you for registering! We are excited to have you on board.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Registration successful, confirmation email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user or sending email' });
  }
});

app.listen(4000, () => {
    console.log('Server is running on port https://react-blog-j51y.onrender.com');
});