# Quick Start Guide - Local Service Business IDE

## 🚀 Getting Started

This guide will help you get the Local Service Business IDE running on your machine.

### Step 1: Install Prerequisites

1. **Install Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Verify installation: Open PowerShell and run `node --version`

2. **Install Ollama** (for AI functionality)
   - Download from: https://ollama.ai/
   - Run the installer
   - Ollama will start automatically in the background

### Step 2: Setup the Model

Open PowerShell and run:
```powershell
ollama pull llama3.1:8b
```

This downloads the AI model (about 4.7GB). Alternative smaller models:
```powershell
ollama pull mistral:7b      # Smaller, faster
ollama pull codellama:7b    # Good for code generation
```

### Step 3: Install Dependencies

Navigate to your project folder and install dependencies:

```powershell
# Backend dependencies
cd backend
npm install

# Frontend dependencies  
cd ../frontend
npm install
```

### Step 4: Start the Application

**Terminal 1 - Start Ollama (if not running):**
```powershell
ollama serve
```

**Terminal 2 - Start Backend:**
```powershell
cd backend
npm start
```

**Terminal 3 - Start Frontend:**
```powershell
cd frontend
npm start
```

### Step 5: Open the Application

1. Open your browser
2. Go to: http://localhost:3000
3. Start building contractor websites! 🏗️

## 🎯 How to Use

1. **Click "Let's Get Started!"** on the welcome screen
2. **Answer the guided questions** about the contractor's business:
   - Business name
   - Services offered
   - Service areas
   - Contact information
   - Business hours
   - Experience/credentials

3. **Watch the website generate** in real-time on the right panel
4. **Get SEO tips** throughout the process
5. **Download or publish** the finished website

## 🛠️ Features

- **Guided Chat Flow**: Step-by-step questions make it easy for non-technical contractors
- **Real-time Preview**: See the website build as you answer questions
- **SEO Optimization**: Built-in SEO best practices and tips
- **Mobile Responsive**: All websites work perfectly on phones and tablets
- **Completely Free**: No API costs, runs entirely on your hardware
- **Professional Design**: Clean, modern websites that build trust

## 🔧 Troubleshooting

### "npm is not recognized"
- Node.js isn't installed or not in PATH
- Download and install Node.js from nodejs.org
- Restart PowerShell after installation

### "Model not found" error
- Run: `ollama list` to see installed models
- Install a model: `ollama pull llama3.1:8b`
- Make sure Ollama is running: `ollama serve`

### Website generation is slow
- Try a smaller model: `mistral:7b` or `codellama:7b`
- Ensure adequate RAM (8GB+ recommended)
- Close other memory-intensive applications

### Port conflicts
- Backend uses port 5000, Frontend uses port 3000
- Change ports in `.env` file if needed

## 🎨 Customization

- **Edit prompts**: Modify `frontend/src/components/GuidedChatBox.js`
- **Change styling**: Update the CSS in the component files
- **Add new features**: Extend the guided flow with more questions
- **Different models**: Change `OLLAMA_MODEL` in `backend/.env`

## 📞 Support

If you run into issues:
1. Check that all prerequisites are installed
2. Verify Ollama is running with the model downloaded
3. Ensure ports 3000 and 5000 are available
4. Check the browser console for any error messages

Happy building! 🏗️✨