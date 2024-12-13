# Rumoros 

## 🚀 Open-Source Web Analytics Platform

### Overview

Rumoros is a lightweight, privacy-focused, and easy-to-implement web analytics solution designed to be a robust alternative to Google Analytics. With simple script integration and powerful insights, Rumoros empowers developers and businesses to understand their web traffic without compromising user privacy.

### 🌟 Key Features

#### Current Features
- One-line script integration
- Privacy-first tracking
- Real-time analytics dashboard
- GDPR and CCPA compliant
- Self-hostable infrastructure
- Minimal performance impact

#### Upcoming Features
- [ ] Custom event tracking
- [ ] Audience segmentation
- [ ] Funnel and conversion tracking
- [ ] Geolocation insights
- [ ] Advanced bot detection
- [ ] Export and reporting capabilities
- [ ] Machine learning-powered insights

### 🛠 Tech Stack
- **Frontend**: Next.js
- **Backend**: PostgreSQL
- **Deployment**: Docker-compatible
- **Language**: TypeScript

### 📦 Installation

#### Prerequisites
- Node.js (v18+)
- PostgreSQL (v13+)
- Docker (optional)

#### Quick Setup

1. Clone the repository
```bash
git clone https://github.com/devansh-m12/rumoros
cd rumoros
```

2. Install dependencies
```bash
npm install
```

3. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

4. Initialize database
```bash
npm run db:migrate
```

5. Run development server
```bash
npm run dev
```

### 🔍 Script Integration

expected script to your website:
```html
<script 
  src="https://cdn.rumoros.com/tracker.js" 
  web-id="YOUR_UNIQUE_WEB_ID">
</script>
```

### 🔒 Privacy & Compliance
- No personally identifiable information (PII) collected
- Anonymous tracking
- User consent management
- GDPR and CCPA compliant by design

### 📊 Analytics Captured
- Page views
- Referral sources
- Device types
- Browser information
- Session duration
- Bounce rates

### 🚀 Deployment Options
- Self-hosted (recommended)
- Cloud deployment
- Docker container
- Kubernetes support

### 🤝 Contributing
We welcome contributions! Please see `CONTRIBUTING.md` for details.

### 📄 License
MIT License


---

**Created with ❤️ by the Devansh**