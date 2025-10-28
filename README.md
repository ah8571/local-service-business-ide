# Local Service Business IDE

A **free website generator for contractors** that empowers local service businesses to create professional websites independently, without relying on expensive platforms or third-party services. This tool is part of the Connectionism ecosystem - a larger web app designed to help contractors connect with clients for free. 

## 🎯 Vision & Concept

## 🎯 **Why Contractor Independence Matters**

Too many contractors rely on expensive website builders, costly marketing platforms, or get locked into restrictive service agreements. This tool breaks that cycle by providing:

- **Complete ownership** - Your website, your content, your control
- **No monthly fees** - Generate, download, and host anywhere you want  
- **Platform independence** - No vendor lock-in or recurring subscription traps
- **Professional results** - High-quality websites without hiring expensive developers

## 🛠️ **Core Features**

### 🌐 **AI-Powered Website Generator**
- **Free HTML/CSS website creation** specifically tailored for contractors
- **Chat-driven interface** powered by open-source LLMs (Gemini, Ollama support planned)
- **Industry-specific content** for electrical, plumbing, HVAC, landscaping, and more
- **Professional results** in minutes, not hours - no technical skills required

### 📊 **SEO & Business Intelligence** (Coming Soon)
- **Automated SEO audits** similar to Screaming Frog or Otto  
- **Contractor-focused recommendations** for local search optimization
- **Free performance assessments** to improve website visibility
- **Business development insights** based on local market analysis

### 🔓 **True Independence**
- **Download and own** your complete website (HTML, CSS, images)
- **Host anywhere** - your choice of hosting provider or domain
- **No recurring fees** - generate unlimited websites at no cost
- **No platform dependency** - works with any hosting service

## 🚀 Current Features (Phase 1)

### Website Generator
- **Contractor-Specific Chat Interface:** AI understands contractor businesses (electrical, plumbing, HVAC, etc.)
- **Dynamic HTML/CSS Generation:** Creates unique websites with appropriate hero images and content
- **Industry Templates:** Pre-built layouts optimized for local service businesses
- **Live Preview:** Real-time website preview as contractors interact with the AI
- **Mobile-Responsive:** All generated sites work perfectly on phones and tablets

### User Experience
- **bolt.new-inspired Interface:** Clean, modern chat-driven workflow
- **Zero Learning Curve:** Contractors describe their business, AI builds the website
- **Instant Results:** Professional websites generated in under 5 minutes
- **No Technical Skills Required:** Pure conversation-based website creation

## Tech Stack

- **Backend:** Node.js (Express), LLM integration
- **Frontend:** Vanilla HTML/CSS/JavaScript (modern, lightweight UI)
- **Generated Sites:** Static HTML/CSS (with optional JS)
- **Hosting Integration:** Planned for Netlify, Vercel, or GitHub Pages

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ah8571/local-service-business-ide.git
   cd local-service-business-ide
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Running the Application

1. Start the backend server (serves both API and frontend):
   ```bash
   cd backend
   node app-working.js
   ```

2. Open your browser and navigate to `http://localhost:5000`

## � Project Structure

```
local-service-business-ide/
├── README.md                 # Main project documentation
├── backend/                  # Node.js server and API
├── frontend/                 # Vanilla HTML/CSS/JS interface
├── docs/                     # Detailed documentation
│   ├── API_KEYS_SETUP.md     # API configuration guide
│   ├── API_TESTING_GUIDE.md  # Testing endpoints
│   ├── LLM_ARCHITECTURE.md   # AI integration details
│   ├── OLLAMA_SETUP.md       # Local LLM setup
│   ├── PROJECT_NOTES.md      # Development notes
│   ├── QUICK_START.md        # Fast setup guide
│   └── USER_EXPERIENCE_DEMO.md # UX documentation
├── scripts/                  # Utility scripts and tools
├── generated_sites/          # AI-generated contractor websites
├── templates/                # Base templates for site generation
└── deprecated/               # Legacy React version (archived)
```

## �💬 How It Works (Current)

### For Contractors:
1. **Chat with AI:** "I run an electrical contracting business in Phoenix called 'Bright Spark Electric'..."
2. **Describe Your Services:** AI asks targeted questions about your specialty areas
3. **Get Your Website:** Professional HTML/CSS site generated with:
   - Industry-appropriate hero images
   - Service descriptions optimized for local search
   - Contact forms and call-to-action buttons
   - Mobile-responsive design
   - Local business schema markup

### Example Contractor Types Supported:
- ⚡ **Electrical Contractors** - residential wiring, commercial electrical, emergency repairs
- 🔧 **Plumbing Services** - leak repair, installation, drain cleaning, emergency plumbing  
- 🏠 **HVAC Companies** - AC repair, heating installation, ductwork, maintenance contracts
- 🌿 **Landscaping** - lawn care, design, hardscaping, seasonal cleanup
- 🏗️ **General Contractors** - remodeling, home additions, commercial construction
- 🎨 **Painting Contractors** - interior, exterior, commercial painting
- 🛠️ **Handyman Services** - repairs, installations, maintenance, odd jobs

## 🛣️ Development Roadmap

### Phase 2: SEO & Business Intelligence
- **Automated SEO Auditing** (inspired by Screaming Frog/Otto methodology)
  - Technical SEO analysis for contractor websites
  - Local search optimization recommendations
  - Mobile performance and page speed insights
  - Schema markup suggestions for local businesses
  
- **Business Development Intelligence**
  - **Free SEO assessments** as lead generation tool
  - Content strategy recommendations based on local market analysis
  - Competitor analysis for local service areas
  - Keyword research and content gap identification
  - Google My Business optimization suggestions

### Phase 3: Advanced Features
- **Multi-location contractor support** for growing businesses
- **Integration APIs** for CRM systems and scheduling tools
- **Advanced analytics dashboard** with conversion tracking
- **White-label solutions** for contractor associations
- **Automated content updates** based on seasonal service trends

## 💡 Platform Philosophy

### 🆓 **Always Free Core Features**
- **Website Generator:** Complete HTML/CSS site creation - always free
- **AI Chat Interface:** Unlimited conversations with the AI assistant
- **Basic SEO Tools:** Essential optimization recommendations at no cost

### 💰 **Sustainable Funding**
- **Minimal Google Display Ads:** Unobtrusive advertising to cover hosting and development costs
- **Open Source:** Community-driven development keeps costs low
- **No Premium Walls:** All core functionality remains accessible to everyone

### 🎯 **Mission**
1. **Empower:** Remove technology barriers for small contractors
2. **Connect:** Build genuine community between contractors and customers  
3. **Educate:** Provide professional-grade SEO tools to help contractors grow
4. **Sustain:** Maintain the platform through ethical, minimal advertising

This creates a **contractor-focused ecosystem** where small businesses get professional tools typically available only to larger companies, fostering economic opportunity in local communities.

## Inspiration

This project's user flow and interface are inspired by the onboarding and IDE layout of bolt.new; it's free website concept nature is influenced by silex.me. This is an attempt to make a website-generator project for contractors.  

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.