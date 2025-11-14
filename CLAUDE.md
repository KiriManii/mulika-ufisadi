# CLAUDE.md - Mulika Ufisadi Project Context

**Version:** 1.0.0  
**Last Updated:** November 14, 2025  
**Purpose:** Complete specification document for generating production-ready code

---

## 🎯 Project Overview

**Mulika Ufisadi** (Swahili: "Expose Corruption") is an anonymous corruption reporting platform for Kenya. This document contains ALL specifications needed to write complete, production-ready code for every component.

### Tech Stack
- React 18.3.1 + TypeScript 5.6.3
- Tailwind CSS 3.4.15
- Zustand 5.0.2 (state management)
- React Hook Form 7.54.0 + Zod 3.23.8 (forms)
- Recharts 2.15.0 (charts)
- Mapbox GL JS 3.8.0 (maps)
- TensorFlow.js 4.22.0 (ML)
- Framer Motion 11.15.0 (animations)

---

## 🎨 Design System

### Colors

```typescript
// Primary - Sky Blue (Trust, Transparency)
const primary = {
  50: '#E8F4FD',
  100: '#D0E9FB',
  200: '#A1D3F7',
  500: '#4A90E2',  // Main brand color
  600: '#3A7BC8',
  700: '#2B5A94',
  900: '#1A3A5C',
};

// Secondary - Soft Orange (Alerts, Action)
const secondary = {
  100: '#FFE5D0',
  300: '#FFD1A1',
  500: '#FF9F66',  // Accent color
  700: '#E67A3D',
};

// Neutral - Slate Gray
const neutral = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  500: '#64748B',
  700: '#334155',
  900: '#0F172A',
};

// Semantic
const semantic = {
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
};
```

**Usage in Tailwind:**
- `bg-primary-500`, `text-primary-900`, `border-primary-200`
- `bg-secondary-500`, `text-secondary-700`
- `bg-neutral-50`, `text-neutral-700`
- `text-success`, `text-danger`, `text-warning`

### Typography

**Fonts:**
- Primary: `font-primary` → Onest (headers, UI)
- Secondary: `font-secondary` → JetBrains Mono (code, data)

**Sizes:**
- `text-xs` (12px), `text-sm` (14px), `text-base` (16px)
- `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px)
- `text-3xl` (30px), `text-4xl` (36px), `text-5xl` (48px)

**Weights:**
- `font-light` (300), `font-normal` (400), `font-medium` (500)
- `font-semibold` (600), `font-bold` (700)

### Spacing

Based on 8px grid:
- `space-2` (8px), `space-4` (16px), `space-6` (24px)
- `space-8` (32px), `space-12` (48px), `space-16` (64px)

### Animations

```typescript
// Framer Motion variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 100 }
};

const scaleUp = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};
```

---

## 📐 Complete Type Definitions

### Report Types (`src/types/report.ts`)

```typescript
export interface Report {
  id: string;
  anonymousId: string;
  county: string;
  agency: Agency;
  categories: Category[];
  incidentDate: Date;
  estimatedAmount?: number;
  description: string;
  evidence?: Evidence[];
  location?: Coordinates;
  contactMethod?: ContactMethod;
  submittedAt: Date;
  status: ReportStatus;
  verificationScore?: number;
}

export enum Agency {
  Police = 'police',
  LandServices = 'land_services',
  CivilRegistration = 'civil_registration',
  Judiciary = 'judiciary',
  MotorVehicle = 'motor_vehicle',
  BusinessLicensing = 'business_licensing',
  Education = 'education',
  Health = 'health',
  Tax = 'tax',
  HudumaCenter = 'huduma_center',
  Other = 'other',
}

export enum Category {
  Bribery = 'bribery',
  Extortion = 'extortion',
  Embezzlement = 'embezzlement',
  Nepotism = 'nepotism',
  ProcurementFraud = 'procurement_fraud',
  LandGrabbing = 'land_grabbing',
  Other = 'other',
}

export enum ReportStatus {
  Submitted = 'submitted',
  Verified = 'verified',
  UnderReview = 'under_review',
  FiledWithEACC = 'filed_with_eacc',
  Resolved = 'resolved',
}

export interface Evidence {
  type: 'image' | 'document';
  data: string;  // Base64
  filename: string;
  size: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ContactMethod {
  type: 'email' | 'telegram' | 'signal';
  value: string;
  encrypted: boolean;
}
```

### County Types (`src/types/county.ts`)

```typescript
export interface County {
  code: number;
  name: string;
  capital: string;
  region: string;
}

export interface CountyMapData {
  countyCode: number;
  countyName: string;
  reportCount: number;
  totalBribeAmount: number;
  topAgency: string;
  riskScore: number;  // 0-100
}

export interface CountyGeoJSON {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      COUNTY: string;
      CODE: number;
    };
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: number[][][] | number[][][][];
    };
  }>;
}
```

### Reward Types (`src/types/reward.ts`)

```typescript
export interface RewardToken {
  id: string;  // Format: MLK-2025-XXXXX
  reportId: string;
  encryptionKey: string;
  qrCode: string;  // Base64 QR code
  createdAt: Date;
  claimed: boolean;
  verificationQuestions: VerificationQuestion[];
}

export interface VerificationQuestion {
  question: string;
  hashedAnswer: string;  // SHA-256
  attempts: number;
  maxAttempts: number;
}

export interface Reward {
  tokenId: string;
  tier: RewardTier;
  amount: number;
  status: RewardStatus;
  eligibleFrom: Date;
  claimedAt?: Date;
  mpesaNumber?: string;
}

export enum RewardTier {
  Bronze = 'bronze',    // KES 5,000
  Silver = 'silver',    // KES 15,000
  Gold = 'gold',        // KES 50,000
  Platinum = 'platinum', // KES 150,000
}

export enum RewardStatus {
  Pending = 'pending',
  Eligible = 'eligible',
  Claimed = 'claimed',
  Paid = 'paid',
}
```

### UI Types (`src/types/index.ts`)

```typescript
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel';
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export interface SelectProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

---

## 🧱 Component Specifications

### Layout Components

#### Header Component (`src/components/layout/Header.tsx`)

**Purpose:** Top navigation bar with logo, menu, and CTA

**Features:**
- Sticky position
- Logo on left (links to home)
- Navigation links: Home, Report, Statistics, Map, About, Contact
- "Report Corruption" CTA button (secondary-500)
- Mobile hamburger menu
- Responsive breakpoint: 768px

**State:**
- `isMobileMenuOpen` (boolean)

**Styling:**
- Background: `bg-white shadow-sm`
- Height: `h-16` (64px)
- Logo text: `text-primary-700 text-2xl font-bold`
- Nav links: `text-neutral-700 hover:text-primary-500`
- CTA button: `bg-secondary-500 hover:bg-secondary-700 text-white`

**Example Structure:**
```tsx
<header className="sticky top-0 z-50 bg-white shadow-sm">
  <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
    <Link to="/" className="text-primary-700 text-2xl font-bold">
      Mulika Ufisadi
    </Link>
    
    {/* Desktop Nav */}
    <div className="hidden md:flex items-center space-x-8">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/report">Report</NavLink>
      <NavLink to="/statistics">Statistics</NavLink>
      <NavLink to="/map">Map</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </div>
    
    {/* CTA */}
    <Button variant="secondary">Report Corruption</Button>
    
    {/* Mobile Menu Button */}
    <button className="md:hidden" onClick={toggleMenu}>
      {/* Hamburger icon */}
    </button>
  </nav>
  
  {/* Mobile Menu */}
  {isMobileMenuOpen && (
    <div className="md:hidden">
      {/* Mobile nav links */}
    </div>
  )}
</header>
```

#### Footer Component (`src/components/layout/Footer.tsx`)

**Purpose:** Site footer with links and contact info

**Structure:**
- 3 columns on desktop, stacked on mobile
- Column 1: Logo + tagline
- Column 2: Quick links
- Column 3: Contact info + social icons
- Bottom: Copyright notice

**Styling:**
- Background: `bg-neutral-900 text-neutral-300`
- Padding: `py-12`
- Links: `hover:text-primary-500`

**Content:**
```tsx
Column 1:
- Logo: "Mulika Ufisadi"
- Tagline: "Expose Corruption. Protect Kenya."

Column 2:
- About Us
- How It Works
- Report Corruption
- Statistics
- Contact

Column 3:
- Email: info@mulikaufisadi.org
- Phone: +254 700 123 456
- WhatsApp: +254 700 123 456
- Social: Twitter, Facebook, Instagram

Bottom:
- © 2025 Mulika Ufisadi. All rights reserved.
```

#### Sidebar Component (`src/components/layout/Sidebar.tsx`)

**Purpose:** Side navigation for dashboard pages (optional, can be integrated into Header)

**Features:**
- Collapsible on mobile
- Active link highlighting
- Icon + text labels

**Styling:**
- Background: `bg-white border-r border-neutral-200`
- Width: `w-64` (desktop), full width (mobile)
- Active link: `bg-primary-50 text-primary-700`

#### Layout Component (`src/components/layout/Layout.tsx`)

**Purpose:** Wrapper component with Header and Footer

```tsx
interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

---

### UI Components

#### Button Component (`src/components/ui/Button.tsx`)

**Variants:**
```typescript
const buttonVariants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-secondary-500 hover:bg-secondary-700 text-white',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
  ghost: 'text-neutral-700 hover:bg-neutral-100',
  danger: 'bg-danger hover:bg-red-600 text-white',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

**Features:**
- Loading state (spinner)
- Disabled state
- Icon support
- Full width option
- Hover animations (scale 1.05)

**Example:**
```tsx
<Button 
  variant="primary" 
  size="lg" 
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Submit Report
</Button>
```

#### Input Component (`src/components/ui/Input.tsx`)

**Features:**
- Floating label (optional)
- Error state with message
- Icon prefix/suffix
- Disabled state
- Required indicator

**Styling:**
```css
Base: border border-neutral-300 rounded-lg px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100
Error: border-danger focus:border-danger focus:ring-danger/20
Disabled: bg-neutral-100 cursor-not-allowed
```

**Example:**
```tsx
<Input
  label="County"
  type="text"
  value={county}
  onChange={(e) => setCounty(e.target.value)}
  error={errors.county}
  required
/>
```

#### Select Component (`src/components/ui/Select.tsx`)

**Features:**
- Dropdown with search (for long lists like counties)
- Error state
- Disabled state
- Placeholder

**Styling:** Same as Input

**Example:**
```tsx
<Select
  label="Select County"
  options={COUNTIES}
  value={selectedCounty}
  onChange={setSelectedCounty}
  placeholder="Choose a county..."
  required
/>
```

#### Card Component (`src/components/ui/Card.tsx`)

**Features:**
- Optional title and subtitle
- Optional footer
- Hoverable (lift effect)
- Clickable

**Styling:**
```css
Base: bg-white rounded-xl p-6 shadow-sm
Hoverable: hover:shadow-md transition-shadow duration-300
```

**Example:**
```tsx
<Card 
  title="Total Reports"
  subtitle="Last 30 days"
  hoverable
>
  <div className="text-4xl font-bold text-primary-500">5,847</div>
</Card>
```

#### Modal Component (`src/components/ui/Modal.tsx`)

**Features:**
- Overlay backdrop
- Close on outside click
- Close button (X)
- Scrollable content
- Sizes: sm, md, lg, xl

**Styling:**
```css
Backdrop: fixed inset-0 bg-black/50 backdrop-blur-sm z-50
Container: bg-white rounded-xl shadow-2xl max-w-[size] mx-auto my-8
```

**Animation:** Fade in + scale up using Framer Motion

**Example:**
```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirm Submission"
  size="md"
>
  <p>Are you sure you want to submit this report?</p>
</Modal>
```

#### SkeletonLoader Component (`src/components/ui/SkeletonLoader.tsx`)

**Purpose:** Loading placeholders

**Variants:**
- Text lines (different widths)
- Card skeleton
- Chart skeleton
- Map skeleton

**Styling:**
```css
Base: bg-neutral-200 animate-pulse rounded
```

**Example:**
```tsx
<SkeletonLoader variant="card" count={3} />
```

#### AnimatedCounter Component (`src/components/ui/AnimatedCounter.tsx`)

**Purpose:** Animate numbers counting up

**Props:**
- `end`: final number
- `duration`: animation duration (ms)
- `prefix`: e.g., "KES "
- `suffix`: e.g., "M"
- `decimals`: number of decimal places

**Animation:** Use `requestAnimationFrame` for smooth counting

**Example:**
```tsx
<AnimatedCounter 
  end={5847} 
  duration={2000}
  suffix=" Reports"
/>
// Displays: 0 → 5,847 Reports (over 2 seconds)
```

---

### Report Components

#### ReportForm Component (`src/components/report/ReportForm.tsx`)

**Purpose:** Main corruption report submission form

**Dependencies:**
- React Hook Form
- Zod validation
- nanoid (for ID generation)
- browser-image-compression
- CryptoJS (for encryption)

**Fields:**
1. County (required, dropdown)
2. Agency (required, dropdown)
3. Categories (required, multi-select checkboxes)
4. Incident Date (required, date picker)
5. Estimated Amount (optional, number input with KES prefix)
6. Description (required, textarea, 50-1000 chars)
7. Evidence Upload (optional, images + PDFs)
8. Location (auto-detected GPS, can override)
9. Contact Method (optional, encrypted)

**Validation Schema (Zod):**
```typescript
const reportSchema = z.object({
  county: z.string().min(1, 'County is required'),
  agency: z.nativeEnum(Agency),
  categories: z.array(z.nativeEnum(Category)).min(1, 'Select at least one category'),
  incidentDate: z.date().max(new Date(), 'Date cannot be in the future'),
  estimatedAmount: z.number().positive().optional(),
  description: z.string().min(50, 'Too short').max(1000, 'Too long'),
  evidence: z.array(evidenceSchema).max(3, 'Max 3 files').optional(),
  location: coordinatesSchema.optional(),
  contactMethod: contactMethodSchema.optional(),
});
```

**On Submit:**
1. Validate form
2. Compress images (max 1MB each)
3. Generate anonymous ID (if first report)
4. Generate report token (MLK-2025-XXXXX)
5. Encrypt report data
6. Save to localStorage
7. Show TokenDisplay modal

**Styling:**
- Form container: `max-w-3xl mx-auto p-6`
- Sections separated by `space-y-6`
- Submit button: large, secondary-500

#### TokenDisplay Component (`src/components/report/TokenDisplay.tsx`)

**Purpose:** Show tracking token after submission

**Display:**
- Token ID (large, bold)
- QR code (generated from token)
- Encryption key (must be saved)
- Instructions for claiming rewards
- Download/Save buttons

**Styling:**
- Modal overlay
- Center card with confetti animation (optional)
- Token: `text-3xl font-bold text-primary-700 font-secondary`
- QR code: 200x200px
- Warning text: `text-danger` for "Save this key!"

#### EvidenceUpload Component (`src/components/report/EvidenceUpload.tsx`)

**Purpose:** Drag-and-drop file upload

**Features:**
- Drag and drop zone
- File type validation (images: jpg/png, docs: pdf)
- Size validation (images: 5MB, docs: 10MB)
- Image preview thumbnails
- Remove uploaded files
- Auto-compress images using browser-image-compression

**Styling:**
- Drop zone: `border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center`
- Active drag: `border-primary-500 bg-primary-50`
- Thumbnails: grid layout

---

### Dashboard Components

#### StatsCard Component (`src/components/dashboard/StatsCard.tsx`)

**Purpose:** Display key statistics with icons

**Props:**
- `title`: string
- `value`: number | string
- `icon`: React.ReactNode
- `trend`: { value: number, direction: 'up' | 'down' } (optional)
- `color`: 'primary' | 'secondary' | 'success' | 'danger'

**Features:**
- Animated counter for numbers
- Trend indicator (arrow + percentage)
- Icon in colored circle
- Hover lift effect

**Styling:**
```css
Card: bg-white rounded-xl p-6 shadow-sm hover:shadow-md
Icon: w-12 h-12 rounded-full bg-[color]-100 text-[color]-700
Value: text-3xl font-bold
Trend: text-sm text-success (up) or text-danger (down)
```

#### AgencyRanking Component (`src/components/dashboard/AgencyRanking.tsx`)

**Purpose:** Bar chart showing corruption by agency

**Data Structure:**
```typescript
interface AgencyData {
  name: string;
  score: number;  // 0-100
  reportCount: number;
}
```

**Implementation:**
- Use Recharts BarChart
- Horizontal bars
- Color gradient based on score (red = high corruption)
- Tooltip shows report count

**Styling:**
- Bar colors: danger (high score) → warning → success (low score)
- Label font: `font-secondary`

#### TrendChart Component (`src/components/dashboard/TrendChart.tsx`)

**Purpose:** Line chart showing corruption trends over time

**Data Structure:**
```typescript
interface TrendData {
  year: number;
  totalReports: number;
  averageBribe: number;
  reportingRate: number;
}
```

**Implementation:**
- Use Recharts LineChart
- Multiple lines (can toggle)
- Smooth curves
- Tooltips with formatted data
- Legend

**Styling:**
- Line colors: primary-500, secondary-500, success
- Axes: `text-neutral-500 text-sm`

#### CountyBreakdown Component (`src/components/dashboard/CountyBreakdown.tsx`)

**Purpose:** Bar chart or table of reports by county

**Features:**
- Sortable (by report count, amount, etc.)
- Clickable rows (navigate to county detail)
- Color-coded by risk score
- Search/filter

**Implementation:**
- Use Recharts BarChart (stacked or grouped)
- Or use table with sorting

---

### Map Components

#### CountyMap Component (`src/components/map/CountyMap.tsx`)

**Purpose:** Interactive Mapbox map with county boundaries

**Dependencies:**
- react-map-gl
- mapbox-gl

**Features:**
- Load GeoJSON county boundaries
- Click county to show popup
- Heatmap overlay
- Zoom controls
- Search location

**Mapbox Style:** `mapbox://styles/mapbox/light-v11`

**State:**
- `viewport` (center, zoom, bearing)
- `selectedCounty` (for popup)
- `hoveredCounty` (highlight)

**Popup Content:**
- County name
- Report count
- Total bribe amount
- Top agency
- "View Details" link

#### Heatmap Component (`src/components/map/Heatmap.tsx`)

**Purpose:** Overlay heatmap showing report density

**Implementation:**
- Use Mapbox heatmap layer
- Weight by report count or bribe amount
- Color gradient: blue (low) → yellow → red (high)

**Data Format:**
```typescript
interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}
```

#### MapControls Component (`src/components/map/MapControls.tsx`)

**Purpose:** Custom controls for map

**Features:**
- Zoom in/out buttons
- Reset view button
- Toggle heatmap layer
- Toggle county boundaries
- Search box (geocoding)

**Styling:**
- Floating controls panel
- Position: top-right
- Background: white with shadow

---

### Hero Components

#### HeroSection Component (`src/components/hero/HeroSection.tsx`)

**Purpose:** Landing page hero with carousel

**Structure:**
```tsx
<section className="relative h-screen">
  <ImageCarousel images={heroImages} />
  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center text-white max-w-4xl px-4">
      <h1 className="text-6xl font-bold mb-4">Mulika Ufisadi</h1>
      <p className="text-2xl mb-8">Expose Corruption. Protect Kenya.</p>
      <Button variant="secondary" size="lg">
        Report Corruption
      </Button>
    </div>
  </div>
</section>
```

#### ImageCarousel Component (`src/components/hero/ImageCarousel.tsx`)

**Purpose:** Auto-rotating image carousel

**Features:**
- 5 images
- Auto-advance every 5 seconds
- Fade transitions
- Pause on hover
- Navigation dots

**Images:**
1. hero-report-1920x800.jpg
2. hero-kenya-map-1920x800.jpg
3. hero-community-1920x800.jpg
4. hero-justice-1920x800.jpg
5. hero-future-1920x800.jpg

**Implementation:**
- Use Framer Motion for transitions
- `AnimatePresence` for exit animations

---

### Reward Components

#### RewardClaim Component (`src/components/rewards/RewardClaim.tsx`)

**Purpose:** UI for claiming rewards

**Flow:**
1. Enter tracking token
2. Answer verification questions
3. Provide M-Pesa number
4. Submit claim

**Features:**
- Token validation
- Question-answer verification
- Attempt limiting (3 max per question)
- Success/error states

#### VerificationForm Component (`src/components/rewards/VerificationForm.tsx`)

**Purpose:** Multi-step verification form

**Questions Generated:**
1. "What county did you report in?" (dropdown)
2. "Approximate amount?" (number range)
3. "First 3 characters of description?" (text input)

**Validation:**
- Hash answers with SHA-256
- Compare with stored hashes
- Lock after 3 failed attempts

---

## 🔧 Utilities & Hooks

### Encryption (`src/lib/encryption.ts`)

```typescript
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY || 'mulika-ufisadi-2025';

export function encryptReport(report: Report): string {
  const jsonString = JSON.stringify(report);
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
}

export function decryptReport(encrypted: string): Report {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
  const jsonString = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonString);
}

export function generateHash(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

export function generateAnonymousId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `anon_${timestamp}_${random}`;
}

export function generateReportToken(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `MLK-${year}-${random}`;
}
```

### Storage (`src/lib/storage.ts`)

```typescript
const STORAGE_KEYS = {
  REPORTS: 'mulika_reports',
  ANONYMOUS_ID: 'mulika_anonymous_id',
  REWARDS_TOKENS: 'mulika_rewards_tokens',
  SETTINGS: 'mulika_settings',
};

export function saveReport(report: Report): void {
  const encrypted = encryptReport(report);
  const existing = getReports();
  existing.push({ ...report, encrypted });
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(existing));
}

export function getReports(): Report[] {
  const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
  if (!data) return [];
  return JSON.parse(data).map((item: any) => decryptReport(item.encrypted));
}

export function getAnonymousId(): string {
  let id = localStorage.getItem(STORAGE_KEYS.ANONYMOUS_ID);
  if (!id) {
    id = generateAnonymousId();
    localStorage.setItem(STORAGE_KEYS.ANONYMOUS_ID, id);
  }
  return id;
}
```

### ML Functions (`src/lib/ml/`)

**clustering.ts:**
```typescript
import * as tf from '@tensorflow/tfjs';

export async function clusterReports(reports: Report[]): Promise<Cluster[]> {
  // Convert reports to vectors
  const vectors = reports.map(reportToVector);
  
  // K-means clustering
  const tensor = tf.tensor2d(vectors);
  const k = 5; // number of clusters
  
  // Implementation here...
  
  return clusters;
}

function reportToVector(report: Report): number[] {
  // Convert county, agency, amount, date to numerical vector
  return [
    hashCounty(report.county),
    hashAgency(report.agency),
    report.estimatedAmount || 0,
    report.incidentDate.getTime(),
  ];
}
```

**anomalyDetection.ts:**
```typescript
export function detectAnomalies(reports: Report[]): Anomaly[] {
  // Detect outliers in amount, unusual patterns
  const amounts = reports.map(r => r.estimatedAmount || 0);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const stdDev = Math.sqrt(
    amounts.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / amounts.length
  );
  
  // Flag outliers (> 2 std deviations)
  return reports
    .filter(r => Math.abs((r.estimatedAmount || 0) - mean) > 2 * stdDev)
    .map(r => ({ reportId: r.id, reason: 'Unusual amount' }));
}
```

### Custom Hooks

**useLocalStorage.ts:**
```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  };

  return [storedValue, setValue];
}
```

**useGeolocation.ts:**
```typescript
export function useGeolocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  };

  return { location, error, loading, getLocation };
}
```

---

## 🗄️ State Management (Zustand)

### Report Store (`src/store/reportStore.ts`)

```typescript
import create from 'zustand';

interface ReportStore {
  reports: Report[];
  addReport: (report: Report) => void;
  getReportById: (id: string) => Report | undefined;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
}

export const useReportStore = create<ReportStore>((set, get) => ({
  reports: getReports(), // Load from localStorage

  addReport: (report) => {
    saveReport(report);
    set((state) => ({ reports: [...state.reports, report] }));
  },

  getReportById: (id) => {
    return get().reports.find((r) => r.id === id);
  },

  updateReport: (id, updates) => {
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    }));
  },

  deleteReport: (id) => {
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== id),
    }));
  },
}));
```

### UI Store (`src/store/uiStore.ts`)

```typescript
interface UIStore {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  
  notification: null,
  showNotification: (message, type) => set({ notification: { message, type } }),
  clearNotification: () => set({ notification: null }),
}));
```

---

## 📄 Pages

### Home Page (`src/pages/Home.tsx`)

**Sections:**
1. HeroSection (full viewport height)
2. Live Statistics (4 animated counters in grid)
3. How It Works (3-step infographic)
4. CTA Section
5. Partners (EACC logo)

### Report Page (`src/pages/Report.tsx`)

**Layout:**
- Centered ReportForm component
- Progress indicator (optional)
- Save draft functionality
- Success modal with TokenDisplay

### Dashboard Page (`src/pages/Dashboard.tsx`)

**Layout:**
```tsx
<div className="container mx-auto py-8">
  <h1>Corruption Statistics</h1>
  
  {/* Stats Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    <StatsCard title="Total Reports" value={stats.totalReports} />
    <StatsCard title="Total Amount" value={`KES ${stats.totalAmount}M`} />
    <StatsCard title="Verified Cases" value={stats.verifiedCases} />
    <StatsCard title="Counties" value={47} />
  </div>
  
  {/* Agency Rankings */}
  <Card title="Corruption by Agency">
    <AgencyRanking data={agencyData} />
  </Card>
  
  {/* Trend Analysis */}
  <Card title="Trends Over Time">
    <TrendChart data={trendData} />
  </Card>
  
  {/* County Breakdown */}
  <Card title="Reports by County">
    <CountyBreakdown data={countyData} />
  </Card>
</div>
```

### Map Page (`src/pages/Map.tsx`)

**Layout:**
- Full-height CountyMap
- MapControls overlay
- County details sidebar (shows on click)
- Legend for heatmap

### About Page (`src/pages/About.tsx`)

**Sections:**
1. Mission statement
2. How it works (infographic)
3. Data sources
4. Privacy & security
5. Partnership with EACC
6. Team/Credits

### Contact Page (`src/pages/Contact.tsx`)

**Content:**
- Organization details
- Email form
- Phone/WhatsApp
- Social media links
- EACC referral info

### Rewards Page (`src/pages/Rewards.tsx`)

**Layout:**
- RewardClaim component
- FAQ section
- Reward tiers explanation
- Track claim status

---

## 🎨 Coding Patterns & Conventions

### Import Order
```typescript
// 1. External libraries
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// 2. Internal components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// 3. Utilities
import { encryptReport } from '@/lib/encryption';

// 4. Types
import type { Report } from '@/types/report';

// 5. Styles (if any)
import './Component.css';
```

### Component Structure
```typescript
// Types/Interfaces first
interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

// Component definition
export function MyComponent({ title, onSubmit }: MyComponentProps) {
  // State
  const [value, setValue] = useState('');
  
  // Hooks
  const { data, isLoading } = useQuery(...);
  
  // Handlers
  const handleClick = () => {
    // Implementation
  };
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

### Tailwind Usage
- Use Tailwind classes directly (no CSS modules)
- Responsive: `md:`, `lg:`, `xl:`
- Dark mode: `dark:` (if implementing)
- Hover: `hover:`, `focus:`, `active:`
- Combine classes with template literals for dynamic styling

### Error Handling
```typescript
try {
  const result = await riskyOperation();
} catch (error) {
  console.error('Error:', error);
  showNotification('Operation failed', 'error');
}
```

### Accessibility
- All buttons have `aria-label`
- Forms use proper `label` elements
- Images have `alt` text
- Keyboard navigation support
- Focus states visible

---

## 🧪 Testing Considerations

### Unit Tests (Jest + React Testing Library)
```typescript
describe('Button', () => {
  it('renders with correct variant', () => {
    const { getByText } = render(<Button variant="primary">Click</Button>);
    expect(getByText('Click')).toHaveClass('bg-primary-500');
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Manual Testing Checklist
- [ ] All forms validate correctly
- [ ] Report submission saves to localStorage
- [ ] Encryption/decryption works
- [ ] Maps load with Mapbox token
- [ ] Charts render with data
- [ ] Responsive on mobile (375px) and desktop (1920px)
- [ ] Animations smooth (60fps)
- [ ] No console errors
- [ ] Lighthouse score > 90

---

## 🚀 Constants Data

### Counties (`src/constants/counties.ts`)

```typescript
export const COUNTIES = [
  { code: 1, name: 'Mombasa', capital: 'Mombasa City', region: 'Coast' },
  { code: 2, name: 'Kwale', capital: 'Kwale', region: 'Coast' },
  { code: 3, name: 'Kilifi', capital: 'Kilifi', region: 'Coast' },
  // ... all 47 counties
  { code: 47, name: 'Nairobi', capital: 'Nairobi City', region: 'Nairobi' },
];
```

### Agencies (`src/constants/agencies.ts`)

```typescript
export const AGENCIES = [
  { value: Agency.Police, label: 'Police' },
  { value: Agency.LandServices, label: 'Land Services' },
  { value: Agency.CivilRegistration, label: 'Civil Registration' },
  { value: Agency.Judiciary, label: 'Judiciary' },
  { value: Agency.MotorVehicle, label: 'Motor Vehicle Licensing' },
  { value: Agency.BusinessLicensing, label: 'Business Licensing' },
  { value: Agency.Education, label: 'Education Services' },
  { value: Agency.Health, label: 'Health Services' },
  { value: Agency.Tax, label: 'Tax Services' },
  { value: Agency.HudumaCenter, label: 'Huduma Centres' },
  { value: Agency.Other, label: 'Other' },
];
```

### Statistics (Sample Data) (`src/constants/statistics.ts`)

```typescript
export const SAMPLE_STATS = {
  totalReports: 5847,
  totalBribesAmount: 127000000, // KES 127M
  verifiedCases: 1203,
  countyCount: 47,
};

export const AGENCY_RANKINGS = [
  { name: 'Police', score: 84.0, reportCount: 2341 },
  { name: 'Land Services', score: 45.0, reportCount: 987 },
  { name: 'Motor Vehicle', score: 43.7, reportCount: 654 },
  { name: 'Judiciary', score: 40.8, reportCount: 432 },
  { name: 'Civil Registration', score: 34.7, reportCount: 321 },
];

export const TREND_DATA = [
  { year: 2017, totalReports: 3200, averageBribe: 15000 },
  { year: 2018, totalReports: 3800, averageBribe: 16200 },
  { year: 2019, totalReports: 4200, averageBribe: 17500 },
  { year: 2020, totalReports: 3900, averageBribe: 16800 },
  { year: 2021, totalReports: 4500, averageBribe: 18200 },
  { year: 2022, totalReports: 5100, averageBribe: 19500 },
  { year: 2023, totalReports: 5600, averageBribe: 20100 },
  { year: 2024, totalReports: 6200, averageBribe: 21300 },
  { year: 2025, totalReports: 5847, averageBribe: 18800 },
];
```

---

## 📦 Environment Variables

Create `.env.local`:
```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_ENCRYPTION_KEY=mulika-ufisadi-secure-key-2025
```

Get Mapbox token: https://account.mapbox.com/

---

## ✅ Code Quality Checklist

When generating code, ensure:

- [ ] All imports are correct and used
- [ ] TypeScript types are complete (no `any`)
- [ ] No TODO comments or placeholders
- [ ] All props are properly typed
- [ ] Error handling is in place
- [ ] Accessibility attributes included
- [ ] Responsive classes added
- [ ] Comments explain complex logic
- [ ] Consistent naming (camelCase for variables, PascalCase for components)
- [ ] No hardcoded strings (use constants)
- [ ] Animations use Framer Motion
- [ ] Forms use React Hook Form + Zod
- [ ] State uses Zustand stores
- [ ] Data persists to localStorage (encrypted)

---

## 🎯 Production-Ready Criteria

Code is production-ready when:

1. **Functionality:** All features work as specified
2. **Type Safety:** No TypeScript errors
3. **Performance:** Lighthouse score > 90
4. **Accessibility:** WCAG AA compliance
5. **Responsive:** Works on mobile, tablet, desktop
6. **Error Handling:** Graceful failures with user feedback
7. **Security:** Data encrypted, input sanitized
8. **Code Quality:** Clean, maintainable, well-documented
9. **Testing:** Manual testing passes all scenarios
10. **Deployment:** Builds successfully and deploys to Vercel

---

## 📚 Key Documentation Links

- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Tailwind CSS: https://tailwindcss.com/
- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/
- Recharts: https://recharts.org/
- Mapbox: https://docs.mapbox.com/mapbox-gl-js/
- TensorFlow.js: https://www.tensorflow.org/js
- Zustand: https://github.com/pmndrs/zustand

---

## 🎯 Final Notes for Claude

When asked to generate code:

1. **Read this entire document first**
2. **Reference specific sections** for the file being created
3. **Write COMPLETE code** - no placeholders or TODOs
4. **Include all imports** at the top
5. **Add proper TypeScript types** for everything
6. **Follow the design system** exactly
7. **Use the specified libraries** and patterns
8. **Add error handling** where needed
9. **Include accessibility features**
10. **Make it responsive** with Tailwind classes
11. **Test mentally** - does this code actually work?
12. **Format properly** - use Prettier-style formatting

**Remember:** The goal is production-ready code that can be copied directly into the project and work immediately without modifications.

---

**END OF CLAUDE.MD**

This file should be saved in the project root and referenced in every chat session.
