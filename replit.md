# AIIA - AI Institute Africa

## Overview

AIIA (AI Institute Africa) is a full-stack web application designed to serve the AI Institute Africa organization. The platform combines a React TypeScript frontend with an Express.js backend, featuring membership management, content management, event handling, and educational resources focused on AI education and research in Africa.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom theming
- **Animations**: Framer Motion and Lottie animations
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful APIs with structured route organization
- **Session Management**: Express sessions with PostgreSQL store
- **File Handling**: Multer for document uploads
- **Email Service**: Multiple providers (SendGrid, SMTP2GO, Nodemailer)

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migration Strategy**: Custom migration system for data seeding
- **Connection Pool**: Neon serverless pool with connection management

## Key Components

### Authentication System
- **User Authentication**: Session-based authentication for members
- **Admin Authentication**: Separate admin authentication system
- **Password Management**: Secure password hashing with scrypt
- **Password Reset**: Email-based password reset functionality

### Membership Management
- **Membership Types**: Student, Full, Institutional, and Free memberships
- **Payment Integration**: PayNow payment gateway for Zimbabwe market
- **Document Verification**: AI-powered ID verification using Python OCR
- **Member Key Generation**: Automated unique key generation system

### Content Management
- **Articles**: External news articles with AI-enhanced descriptions
- **Local Articles**: Institute-authored articles with membership restrictions
- **Events**: Event management with registration capabilities
- **Media Handling**: Local and external image management

### AI Integration
- **Document Verification**: EasyOCR with OpenCV for ID document processing
- **Content Enhancement**: OpenAI GPT-4 for news description enhancement
- **Chat Assistant**: AI-powered customer support chatbot

### External Services
- **Computer Vision**: Azure Cognitive Services integration
- **Email Services**: Multi-provider email system with fallback
- **News API**: External news aggregation with AI filtering
- **Payment Processing**: PayNow integration for local payments

## Data Flow

### User Registration Flow
1. User selects membership plan and fills registration form
2. Document upload and AI verification (Python service)
3. Payment processing through PayNow gateway
4. Email confirmation and member key generation
5. Account activation and session creation

### Content Management Flow
1. Admin creates/edits content through protected routes
2. Content stored in PostgreSQL with proper validation
3. Media files stored locally with organized directory structure
4. Content served with membership-based access controls

### News Aggregation Flow
1. External news fetched from News API
2. AI filtering for relevant AI/technology content
3. OpenAI enhancement of article descriptions
4. Cached results served to frontend with query management

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL for managed database hosting
- **Email**: SendGrid and SMTP2GO for reliable email delivery
- **Payment**: PayNow for Zimbabwe-specific payment processing
- **AI Services**: OpenAI GPT-4 and Azure Cognitive Services
- **News**: News API for external content aggregation

### Python Dependencies
- **OCR**: EasyOCR for document text extraction
- **Computer Vision**: OpenCV for image processing
- **ML Framework**: PyTorch for deep learning capabilities

### Development Tools
- **Build System**: Vite for fast frontend development
- **Type Safety**: TypeScript throughout the stack
- **Validation**: Zod for runtime type validation
- **Package Manager**: npm with lock file for reproducible builds

## Deployment Strategy

### Environment Configuration
- **Platform**: Replit with Cloud Run deployment target
- **Port Configuration**: Multi-port setup for development and production
- **Environment Variables**: Comprehensive environment variable management
- **Database**: Automatic PostgreSQL provisioning and migration

### Build Process
- **Frontend**: Vite build with static asset optimization
- **Backend**: esbuild for server-side bundling
- **Assets**: Organized media file structure with proper serving
- **Migrations**: Automated database schema and data migrations

### Production Considerations
- **Session Store**: PostgreSQL-backed session management
- **File Storage**: Local file system with organized directory structure
- **Error Handling**: Comprehensive error logging and user feedback
- **Performance**: Query optimization and caching strategies

## Changelog

```
Changelog:
- June 18, 2025. Initial setup
- June 18, 2025. Added AI for Business Leadership Conference 2025 promotion features:
  * Conference section on landing page with countdown timer and animations
  * Auto-popup modal with conference details and registration contacts
  * Integrated contact information from flyer (phone numbers and email)
  * Responsive design with professional styling and call-to-action buttons
- January 16, 2026. Added Program Application Management System:
  * Database table for program applications with status tracking
  * Application submission endpoint with file upload support
  * Automated email confirmation to applicants upon submission
  * Admin notification emails for new applications
  * Admin page (/admin/applications) for reviewing and managing applications
  * Accept/reject functionality with email notifications to applicants
  * Dashboard link to program applications page
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```