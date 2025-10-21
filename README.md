# Local Service Business IDE

A web-based IDE that helps local service business owners create, customize, and publish simple, SEO-friendly static websites. The IDE is powered by free/open-source LLMs and features a chat-driven workflow.

## Features

- **Chat Interface:** Users interact with an LLM-powered chat to answer questions about their business and receive guidance.
- **Static Site Generation:** The IDE generates static HTML/CSS websites (with optional JS for widgets) based on user input.
- **Live Preview:** Real-time website preview as users interact with the chat.
- **Publishing Workflow:** Guides users through connecting a domain and deploying their site.
- **User Experience:** Clean, white-themed UI inspired by bolt.new, with a focus on simplicity and accessibility.

## Tech Stack

- **Backend:** Node.js (Express), LLM integration
- **Frontend:** React (for the IDE/chat UI)
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

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   node app.js
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Provide information about your business including:
   - Name of business
   - Main services
   - Locations
   - Operating hours
   - Contact information

2. The AI will generate a preview of your website in real-time
3. Use the Save, Download, or Publish buttons to manage your site

## Future Enhancements

- More templates and customization options
- Analytics and content suggestions
- Integration with review widgets and other business tools
- User authentication and project management

## Inspiration

This project's user flow and interface are inspired by the onboarding and IDE layout of bolt.new.

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.