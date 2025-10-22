// Express server for Local Service Business IDE
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const LLMService = require('./services/llmService');
const ImageService = require('./services/imageService');

const app = express();
const llmService = new LLMService();
const imageService = new ImageService();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    await fs.ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});


// Photo upload endpoint
app.post('/api/upload-photos', upload.array('photos', 10), async (req, res) => {
  console.log('📸 Photo upload request received');
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No photos uploaded' });
    }

    console.log(`🖼️ Processing ${req.files.length} photos...`);
    const processedImages = [];

    for (const file of req.files) {
      try {
        // Process the image for web optimization
        const processedData = await imageService.processImage(file.path, file.filename);
        
        // Analyze the image
        const analysis = await imageService.analyzeImage(file.path);
        
        processedImages.push({
          originalName: file.originalname,
          filename: file.filename,
          processed: processedData,
          analysis: analysis,
          uploadedAt: new Date().toISOString()
        });

        console.log(`✅ Processed: ${file.originalname}`);
      } catch (error) {
        console.error(`❌ Error processing ${file.originalname}:`, error);
        processedImages.push({
          originalName: file.originalname,
          filename: file.filename,
          error: 'Failed to process image',
          uploadedAt: new Date().toISOString()
        });
      }
    }

    console.log(`🎉 Photo processing complete: ${processedImages.length} images`);
    res.json({
      success: true,
      images: processedImages,
      message: `Successfully uploaded and processed ${processedImages.length} photos`
    });

  } catch (error) {
    console.error('❌ Photo upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload photos',
      message: error.message 
    });
  }
});

// Get uploaded photos for a session
app.get('/api/photos', (req, res) => {
  // In a real app, you'd track photos per session/user
  // For now, return recent uploads
  res.json({ 
    success: true, 
    photos: [] // Placeholder - would implement session tracking
  });
});

// LLM-powered chat endpoint to generate contractor websites
app.post('/api/chat', async (req, res) => {
  console.log('📨 Chat request received');
  try {
    const { message } = req.body;
    console.log('💬 Message:', message);
    
    if (!message) {
      console.log('❌ No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('🚀 Calling LLM service...');
    // Use LLM service to generate website
    const result = await llmService.generateContractorWebsite(message);
    
    console.log('✅ LLM service returned result');
    res.json(result);
  } catch (error) {
    console.error('❌ Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to generate website',
      reply: 'Sorry, I encountered an error while generating your website. Please try again.',
      siteHtml: llmService.generateFallbackHtml(req.body.message || '')
    });
  }
});

// Health check endpoint for LLM service
app.get('/api/health', async (req, res) => {
  try {
    const health = await llmService.checkHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({ healthy: false, error: error.message });
  }
});

// Endpoint to generate static site (HTML/CSS)
app.post('/api/generate-site', async (req, res) => {
  try {
    const { businessInfo } = req.body;
    const result = await llmService.generateContractorWebsite(businessInfo);
    
    // In a real implementation, you might save the HTML to a file
    // and return a URL to access it
    res.json({ 
      success: true, 
      html: result.siteHtml,
      message: result.reply
    });
  } catch (error) {
    console.error('Generate site error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
