const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

class ImageService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads');
    this.processedDir = path.join(__dirname, '../uploads/processed');
    this.ensureDirectories();
  }

  /**
   * Ensure upload directories exist
   */
  async ensureDirectories() {
    try {
      await fs.ensureDir(this.uploadsDir);
      await fs.ensureDir(this.processedDir);
      console.log('📁 Upload directories ready');
    } catch (error) {
      console.error('❌ Error creating directories:', error);
    }
  }

  /**
   * Process uploaded image for web optimization
   */
  async processImage(inputPath, filename) {
    try {
      console.log(`🖼️ Processing image: ${filename}`);
      
      const originalName = path.parse(filename).name;
      const results = {};

      // Generate multiple optimized versions
      const sizes = [
        { width: 400, suffix: '-small' },
        { width: 800, suffix: '-medium' },
        { width: 1200, suffix: '-large' },
        { width: 1920, suffix: '-xlarge' }
      ];

      for (const size of sizes) {
        const webpPath = path.join(this.processedDir, `${originalName}${size.suffix}.webp`);
        const jpegPath = path.join(this.processedDir, `${originalName}${size.suffix}.jpg`);

        // Generate WebP version (modern browsers)
        await sharp(inputPath)
          .resize(size.width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ 
            quality: 85,
            effort: 4
          })
          .toFile(webpPath);

        // Generate JPEG fallback (older browsers)
        await sharp(inputPath)
          .resize(size.width, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ 
            quality: 85,
            progressive: true,
            mozjpeg: true
          })
          .toFile(jpegPath);

        results[size.suffix] = {
          webp: `processed/${originalName}${size.suffix}.webp`,
          jpeg: `processed/${originalName}${size.suffix}.jpg`,
          width: size.width
        };
      }

      // Generate thumbnail
      const thumbPath = path.join(this.processedDir, `${originalName}-thumb.webp`);
      await sharp(inputPath)
        .resize(150, 150, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(thumbPath);

      results.thumbnail = `processed/${originalName}-thumb.webp`;

      // Get original image metadata
      const metadata = await sharp(inputPath).metadata();
      results.original = {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size
      };

      console.log(`✅ Image processed successfully: ${filename}`);
      return results;

    } catch (error) {
      console.error(`❌ Error processing image ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Generate responsive HTML for an image
   */
  generateResponsiveImageHTML(imageData, alt = 'Image', className = '') {
    const { original } = imageData;
    const baseName = Object.keys(imageData).find(key => key !== 'original' && key !== 'thumbnail');
    
    if (!baseName) return '';

    const srcSet = Object.entries(imageData)
      .filter(([key]) => key !== 'original' && key !== 'thumbnail')
      .map(([suffix, data]) => `${data.webp} ${data.width}w`)
      .join(', ');

    const fallbackSrcSet = Object.entries(imageData)
      .filter(([key]) => key !== 'original' && key !== 'thumbnail')
      .map(([suffix, data]) => `${data.jpeg} ${data.width}w`)
      .join(', ');

    return `
      <picture class="${className}">
        <source 
          srcset="${srcSet}" 
          sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1920px"
          type="image/webp">
        <img 
          src="${imageData[Object.keys(imageData)[0]]?.jpeg || ''}" 
          srcset="${fallbackSrcSet}"
          sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, (max-width: 1200px) 1200px, 1920px"
          alt="${alt}" 
          loading="lazy"
          decoding="async"
          style="width: 100%; height: auto; object-fit: cover;">
      </picture>
    `;
  }

  /**
   * Generate CSS for responsive images
   */
  generateImageCSS() {
    return `
      /* Responsive Image Styles */
      .responsive-image {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .responsive-image:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .gallery-image {
        aspect-ratio: 4/3;
        object-fit: cover;
        cursor: pointer;
      }

      .hero-image {
        aspect-ratio: 16/9;
        object-fit: cover;
      }

      .before-after-image {
        aspect-ratio: 1/1;
        object-fit: cover;
      }

      /* Image loading states */
      .image-loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }

      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .responsive-image {
          border-radius: 4px;
        }
      }
    `;
  }

  /**
   * Clean up old files (run periodically)
   */
  async cleanup() {
    try {
      const files = await fs.readdir(this.uploadsDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      for (const file of files) {
        const filePath = path.join(this.uploadsDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.remove(filePath);
          console.log(`🗑️ Cleaned up old file: ${file}`);
        }
      }
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }

  /**
   * Analyze image for AI description
   */
  async analyzeImage(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      
      // Basic analysis based on image properties
      let description = 'Professional image';
      
      if (metadata.width > metadata.height) {
        description = 'Landscape orientation image suitable for headers or galleries';
      } else if (metadata.height > metadata.width) {
        description = 'Portrait orientation image perfect for team photos or before/after comparisons';
      } else {
        description = 'Square format image ideal for social media or portfolio display';
      }

      // Add size context
      if (metadata.width >= 1920) {
        description += ', high resolution';
      } else if (metadata.width >= 800) {
        description += ', good web resolution';
      }

      return {
        description,
        dimensions: `${metadata.width}x${metadata.height}`,
        aspectRatio: metadata.width / metadata.height,
        format: metadata.format,
        suitableFor: this.getSuitableUseCases(metadata)
      };

    } catch (error) {
      console.error('❌ Error analyzing image:', error);
      return {
        description: 'Image uploaded for website use',
        dimensions: 'unknown',
        aspectRatio: 1,
        format: 'unknown',
        suitableFor: ['general']
      };
    }
  }

  /**
   * Determine suitable use cases based on image properties
   */
  getSuitableUseCases(metadata) {
    const aspectRatio = metadata.width / metadata.height;
    const useCases = [];

    if (aspectRatio > 1.5) {
      useCases.push('hero-banner', 'header-background');
    }
    
    if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
      useCases.push('gallery', 'portfolio', 'before-after');
    }
    
    if (aspectRatio < 0.8) {
      useCases.push('team-photo', 'testimonial-photo');
    }

    if (metadata.width >= 1200) {
      useCases.push('background-image');
    }

    return useCases.length > 0 ? useCases : ['general'];
  }
}

module.exports = ImageService;