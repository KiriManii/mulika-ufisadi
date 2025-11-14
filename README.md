# Mulika Ufisadi - Anonymous Corruption Reporting Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

**Mulika Ufisadi** (Swahili: "Expose Corruption") is a production-ready, anonymous corruption reporting platform designed specifically for Kenya. The platform enables citizens to safely and anonymously report corruption incidents while protecting their identity through advanced encryption and security measures.

## 🎯 Project Overview

Mulika Ufisadi addresses the critical need for transparent corruption reporting in Kenya by providing:

- **Anonymous Reporting**: Submit corruption reports without revealing your identity
- **End-to-End Encryption**: All sensitive data is encrypted using industry-standard algorithms
- **Visual Analytics**: Interactive dashboards showing corruption trends across counties and agencies
- **Interactive Maps**: Geospatial visualization of corruption hotspots using Mapbox
- **Reward System**: Incentivize quality reporting with a tiered reward mechanism
- **Machine Learning**: AI-powered clustering and anomaly detection for report analysis
- **Mobile-First Design**: Responsive interface optimized for all devices

## ✨ Key Features

### 🔒 Privacy & Security
- Client-side encryption using CryptoJS (AES-256)
- Anonymous ID generation (no personal data collected)
- Encrypted contact methods (Telegram, Signal, Email)
- Secure token-based reward claiming system
- Local storage with encryption for offline functionality

### 📊 Data Visualization
- Real-time statistics dashboard with animated counters
- Agency corruption rankings with bar charts
- Historical trend analysis (2017-2025)
- County-level breakdown with sorting and filtering
- Interactive Mapbox maps with heatmap overlays

### 📝 Reporting System
- Multi-step form with validation (React Hook Form + Zod)
- Evidence upload (images and documents with compression)
- GPS location capture with accuracy detection
- Incident categorization (Bribery, Extortion, Embezzlement, etc.)
- Agency selection (Police, Land Services, Judiciary, etc.)
- Estimated amount tracking

### 🎁 Reward Mechanism
- Four-tier reward system (Bronze to Platinum: KES 5K - 150K)
- QR code-based token generation
- Multi-factor verification questions
- M-Pesa integration for reward disbursement
- Attempt limiting to prevent fraud

### 🤖 Machine Learning
- K-means clustering for pattern detection
- Anomaly detection for unusual reports
- Natural Language Processing for description analysis
- TensorFlow.js integration for client-side ML

## 🛠️ Tech Stack

### Frontend Framework
- **React** 18.3.1 - Modern UI library with hooks
- **TypeScript** 5.6.3 - Type-safe development
- **Vite** 7.2.2 - Lightning-fast build tool
- **React Router** 6.28.0 - Client-side routing with lazy loading

### UI & Styling
- **Tailwind CSS** 3.4.15 - Utility-first CSS framework
- **Framer Motion** 11.15.0 - Production-ready animations
- **Lucide React** - Beautiful icon library
- **Onest** & **JetBrains Mono** - Custom fonts

### State Management & Forms
- **Zustand** 5.0.2 - Lightweight state management
- **React Hook Form** 7.66.0 - Performant form handling
- **Zod** 3.25.76 - TypeScript-first schema validation
- **TanStack Query** 5.59.20 - Async state management

### Data Visualization
- **Recharts** 2.15.0 - Composable charting library
- **Mapbox GL JS** 3.8.0 - Interactive vector maps
- **React Map GL** 7.1.7 - React wrapper for Mapbox

### Utilities
- **TensorFlow.js** 4.22.0 - Machine learning in the browser
- **CryptoJS** 4.2.0 - Encryption and hashing
- **nanoid** 5.0.8 - Unique ID generation
- **browser-image-compression** 2.0.2 - Client-side image optimization
- **date-fns** 4.1.0 - Modern date utility library

### Development Tools
- **ESLint** 9.15.0 - Code linting with TypeScript support
- **Prettier** 3.4.1 - Code formatting
- **Autoprefixer** 10.4.20 - CSS vendor prefixing
- **Vite PWA Plugin** 1.1.0 - Progressive Web App support

## 📁 Project Structure

```
mulika-ufisadi/
├── public/
│   ├── images/          # Hero images and assets
│   └── data/            # GeoJSON county boundaries
├── src/
│   ├── components/
│   │   ├── dashboard/   # Analytics components
│   │   │   ├── StatsCard.tsx
│   │   │   ├── AgencyRanking.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   └── CountyBreakdown.tsx
│   │   ├── hero/        # Landing page components
│   │   │   ├── HeroSection.tsx
│   │   │   └── ImageCarousel.tsx
│   │   ├── layout/      # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── map/         # Mapbox integration
│   │   │   ├── CountyMap.tsx
│   │   │   ├── Heatmap.tsx
│   │   │   └── MapControls.tsx
│   │   ├── report/      # Reporting system
│   │   │   ├── ReportForm.tsx
│   │   │   ├── TokenDisplay.tsx
│   │   │   └── EvidenceUpload.tsx
│   │   ├── rewards/     # Reward claiming
│   │   │   ├── RewardClaim.tsx
│   │   │   └── VerificationForm.tsx
│   │   └── ui/          # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── AnimatedCounter.tsx
│   │       └── SkeletonLoader.tsx
│   ├── constants/
│   │   ├── agencies.ts      # Agency definitions
│   │   ├── counties.ts      # 47 Kenyan counties
│   │   └── statistics.ts    # Sample data
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useGeolocation.ts
│   │   ├── useEncryption.ts
│   │   └── useAnimation.ts
│   ├── lib/
│   │   ├── encryption.ts    # AES-256 encryption
│   │   ├── storage.ts       # LocalStorage wrapper
│   │   ├── utils.ts         # Helper functions
│   │   └── ml/              # Machine learning
│   │       ├── clustering.ts
│   │       ├── anomalyDetection.ts
│   │       └── nlp.ts
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   ├── Report.tsx       # Report submission
│   │   ├── Dashboard.tsx    # Statistics dashboard
│   │   ├── Map.tsx          # Interactive map
│   │   ├── Rewards.tsx      # Reward claiming
│   │   ├── About.tsx        # About page
│   │   └── Contact.tsx      # Contact page
│   ├── store/
│   │   ├── reportStore.ts   # Report state
│   │   ├── uiStore.ts       # UI state
│   │   └── authStore.ts     # Auth state (future)
│   ├── types/
│   │   ├── report.ts        # Report interfaces
│   │   ├── reward.ts        # Reward interfaces
│   │   ├── county.ts        # County interfaces
│   │   └── index.ts         # UI types
│   ├── App.tsx
│   └── main.tsx
├── CLAUDE.md            # Complete specification document
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Mapbox Access Token** (free tier available)
- Modern browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KiriManii/mulika-ufisadi.git
   cd mulika-ufisadi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   VITE_ENCRYPTION_KEY=mulika-ufisadi-secure-key-2025
   ```

   Get your free Mapbox token at: https://account.mapbox.com/

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

   Preview the production build:
   ```bash
   npm run preview
   ```

## 📱 Usage

### Submitting a Report

1. Navigate to the **Report** page
2. Fill in the required information:
   - County where the incident occurred
   - Government agency involved
   - Type(s) of corruption (can select multiple)
   - Date of incident
   - Estimated amount (optional)
   - Detailed description (50-1000 characters)
   - Evidence files (optional, max 3)
   - Location (auto-detected or manual)
   - Contact method (optional, encrypted)
3. Review your submission
4. Click **Submit Report**
5. **Save your tracking token and encryption key** (required for reward claims)

### Viewing Statistics

1. Navigate to the **Dashboard** page
2. View live statistics:
   - Total reports submitted
   - Total bribe amounts
   - Verified cases
   - Reports by county
3. Explore interactive charts:
   - Agency corruption rankings
   - Historical trends (2017-2025)
   - County breakdown

### Exploring the Map

1. Navigate to the **Map** page
2. View the interactive county map
3. Click on any county for detailed statistics
4. Toggle the heatmap layer to see corruption hotspots
5. Use search to find specific locations

### Claiming Rewards

1. Navigate to the **Rewards** page
2. Enter your tracking token
3. Answer verification questions
4. Provide your M-Pesa number
5. Submit claim (pending EACC verification)

## 🎨 Design System

### Color Palette

- **Primary (Sky Blue)**: Trust & transparency
  - Main: `#4A90E2`
  - Variants: 50, 100, 200, 500, 600, 700, 900

- **Secondary (Soft Orange)**: Alerts & action
  - Main: `#FF9F66`
  - Variants: 100, 300, 500, 700

- **Neutral (Slate Gray)**: Base colors
  - Variants: 50, 100, 200, 300, 500, 700, 900

- **Semantic Colors**:
  - Success: `#10B981`
  - Danger: `#EF4444`
  - Warning: `#F59E0B`

### Typography

- **Primary Font**: Onest (headers, UI elements)
- **Secondary Font**: JetBrains Mono (code, data display)
- **Sizes**: 12px (xs) to 48px (5xl)
- **Weights**: Light (300) to Bold (700)

### Spacing

8px grid system:
- `space-2` (8px), `space-4` (16px), `space-6` (24px)
- `space-8` (32px), `space-12` (48px), `space-16` (64px)

## 📊 Development Phases

### Phase 1: Foundation (Sessions 1-4)
✅ Layout components (Header, Footer, Sidebar)
✅ UI component library (Button, Input, Select, Card, Modal)
✅ Hero components (HeroSection, ImageCarousel)
✅ TypeScript type definitions
✅ Constants and configuration

### Phase 2: Core Features (Sessions 1-4)
✅ Reporting system components
✅ Dashboard visualizations (Charts, Stats)
✅ Zustand store implementations
✅ Page components with routing

### Phase 3: Advanced Features (Sessions 1-4)
✅ Mapbox integration
✅ Utility and ML functions
✅ Reward system components
✅ Custom hooks (localStorage, geolocation, encryption)

### Phase 4: Polish & Optimization (Sessions 1+)
✅ App routing with lazy loading
✅ Error boundaries
✅ TypeScript error fixes
✅ Build optimization
✅ PWA configuration

## 🔧 Configuration

### Tailwind Config

The project uses a custom Tailwind configuration with:
- Custom color palette (primary, secondary, neutral)
- Custom fonts (Onest, JetBrains Mono)
- Extended spacing scale
- Responsive breakpoints
- Animation utilities

### Vite Config

Features:
- React plugin with Fast Refresh
- Path aliases (`@/` → `src/`)
- PWA plugin for offline support
- Optimized build settings
- Environment variable handling

### TypeScript Config

Strict mode enabled with:
- Path mapping for clean imports
- DOM and ES2020 library support
- Strict null checks
- No implicit any
- Module resolution: bundler

## 🧪 Testing

### Manual Testing Checklist

- [ ] All forms validate correctly
- [ ] Report submission saves to localStorage
- [ ] Encryption/decryption works properly
- [ ] Maps load with valid Mapbox token
- [ ] Charts render with data
- [ ] Responsive on mobile (375px) and desktop (1920px)
- [ ] Animations run smoothly (60fps)
- [ ] No console errors
- [ ] Lighthouse score > 90

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔐 Security Considerations

- **Client-side Encryption**: All sensitive data encrypted before storage
- **No Server Storage**: Data remains on user's device
- **Anonymous IDs**: No personal information collected
- **HTTPS Required**: Secure connection for production
- **Input Sanitization**: XSS protection via React
- **CSP Headers**: Content Security Policy recommended
- **Rate Limiting**: Consider implementing for production

## 🚀 Deployment

### Recommended Platforms

- **Vercel** (recommended): Zero-config deployment
- **Netlify**: Easy continuous deployment
- **GitHub Pages**: Free static hosting
- **Cloudflare Pages**: Global CDN distribution

### Environment Variables

Set these in your deployment platform:
```
VITE_MAPBOX_TOKEN=your_production_mapbox_token
VITE_ENCRYPTION_KEY=secure_random_key_here
```

### Build Command

```bash
npm run build
```

Output directory: `dist/`

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading for routes
- **Image Compression**: Client-side before upload
- **Tree Shaking**: Remove unused code
- **Minification**: CSS and JavaScript
- **Caching**: LocalStorage for reports
- **CDN**: Static assets via CDN
- **Prefetching**: Critical resources

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use functional components with hooks
- Write descriptive commit messages
- Add comments for complex logic
- Ensure responsive design
- Test on multiple browsers

## 📝 Documentation

- **CLAUDE.md**: Complete specification document for development
- **Type Definitions**: Comprehensive TypeScript interfaces
- **Component Examples**: Usage patterns in source code
- **Inline Comments**: Explanation of complex logic

## 🗺️ Roadmap

### Version 1.1 (Planned)
- [ ] Backend API integration
- [ ] Real-time updates via WebSocket
- [ ] User authentication (optional)
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Export reports to PDF
- [ ] Multi-language support (Swahili, English)

### Version 1.2 (Planned)
- [ ] Mobile app (React Native)
- [ ] Advanced ML models
- [ ] Blockchain integration for immutability
- [ ] SMS reporting capability
- [ ] Automated EACC filing

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ethics and Anti-Corruption Commission (EACC)** - Partnership and support
- **Transparency International Kenya** - Research and data
- **Mapbox** - Interactive mapping platform
- **Open Source Community** - Amazing tools and libraries

## 📞 Contact

**Project Maintainer**: Lewis Kimani
**Email**: info@mulikaufisadi.org
**GitHub**: [@KiriManii](https://github.com/KiriManii)

**Website**: https://mulikaufisadi.org (coming soon)
**Twitter**: @MulikaUfisadi (coming soon)

---

## 🇰🇪 For Kenya

Built with ❤️ to fight corruption and promote transparency in Kenya.

**Mulika Ufisadi** - *Expose Corruption. Protect Kenya.*

---

*Last Updated: November 14, 2025*
*Version: 1.0.0*
*Status: Production Ready*
