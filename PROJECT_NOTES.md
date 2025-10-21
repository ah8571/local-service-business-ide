# Local Service Business IDE - Concept Notes

## Overview
A web-based IDE that helps users (especially non-technical local service business owners) create, customize, and publish simple, SEO-friendly static websites for their businesses. The IDE is powered by a free/open-source LLM and features a chat-driven workflow.

## Key Features
- **Chat Interface:** Users interact with an LLM-powered chat to answer questions about their business and receive guidance.
- **Static Site Generation:** The IDE generates static HTML/CSS websites (with optional JS for widgets) based on user input.
- **Templates:** Provides reusable templates for common local service business types.
- **SEO Guidance:** Offers tips and best practices for SEO, such as adding case studies, location info, and photos.
- **Publishing Workflow:** Guides users through connecting a domain and deploying their site to a static hosting provider (e.g., Netlify, Vercel, GitHub Pages).
- **User Experience:** Clean, white-themed UI, similar to bolt.new, with a focus on simplicity and accessibility.

## User Journey
1. User lands on the IDE (web app) and is greeted by a chat interface.
2. The chat asks questions about their business (name, services, location, contact info, etc.).
3. The LLM generates a static website preview based on their answers.
4. The user can customize content and design using the chat.
5. When ready, the user is guided through publishing the site, including domain setup and deployment.

# UI/UX Reference & Inspiration (Screenshots Review)

This project’s user flow and interface are inspired by the onboarding and IDE layout of bolt.new. Key concepts from the screenshots provided:

- **Landing & Chat Start:**
  - Users are greeted with a clean, welcoming landing page.
  - A prominent chat box invites users to start describing their project/business.
  - No login required to begin; users can start interacting with the LLM immediately.

- **Chat-Driven Workflow:**
  - The chat interface guides users step-by-step through the process of creating and refining their site.
  - The chat is central to the experience, providing ongoing support and suggestions.

- **IDE Layout (After Project Creation):**
  - Split view: Left pane for chat, right pane for live website preview.
  - "Publish" button is available for deploying the site.
  - Option to save work, which prompts login/signup if not already authenticated.

- **Publishing & Domain Management:**
  - After previewing and refining, users can publish their site.
  - UI provides feedback on successful publishing and options to manage domains or share the site.

- **User Experience Goals:**
  - Clean, modern, and accessible design (preferably with a light/white theme).
  - Minimal distractions; focus on chat and preview.
  - Easy transition from anonymous use to account creation for saving/publishing.

---

*This project is inspired by the user flow and interface of bolt.new, as referenced in the screenshots above. If published publicly, this inspiration will be transparently acknowledged.*


## Technical Stack
- **Backend:** Node.js (Express), LLM integration
- **Frontend:** React (for the IDE/chat UI)
- **Generated Sites:** Static HTML/CSS (with optional JS)
- **Hosting Integration:** Planned for Netlify, Vercel, or GitHub Pages

## Future Enhancements
- More templates and customization options
- Analytics and content suggestions
- Integration with review widgets and other business tools

---
This file documents the core concept and vision for the Local Service Business IDE. Future contributors should review this to understand the project's goals and user experience priorities.
