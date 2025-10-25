# LegalBox Frontend

A blockchain-powered document storage and verification platform built with Next.js, RainbowKit, and TypeScript.

## Features

- 🔐 **Wallet Integration**: Connect with RainbowKit and multiple wallet providers
- 📄 **Document Upload**: Secure document storage with blockchain verification
- 🔍 **Document Verification**: Verify document authenticity using file hash or upload
- 🔗 **Share Links**: Create secure, time-limited share links for documents
- 📊 **Dashboard**: Comprehensive document management interface
- 🛡️ **Authentication**: JWT-based authentication with wallet address linking
- ⚡ **Real-time Status**: BlockDAG transaction status monitoring

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Wallet**: RainbowKit + Wagmi + Viem
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Authentication**: JWT with localStorage
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- WalletConnect Project ID (get from [WalletConnect Cloud](https://cloud.walletconnect.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001

   # WalletConnect Project ID (get from https://cloud.walletconnect.com/)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

   # Polling Configuration
   NEXT_PUBLIC_POLL_INTERVAL=3000
   ```

4. **Get WalletConnect Project ID**

   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy the Project ID and add it to your `.env.local` file

5. **Start the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard pages
│   ├── login/                   # Authentication pages
│   ├── register/
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page
├── components/                  # React components
│   ├── auth/                    # Authentication components
│   ├── dashboard/           # Dashboard-specific components
│   ├── documents/           # Document management components
│   ├── wallet/              # Wallet connection components
│   └── ui/                  # Reusable UI components
├── lib/                      # Utilities and configurations
│   ├── api.ts               # API client and types
│   ├── auth-context.tsx     # Authentication context
│   └── rainbowkit.ts        # RainbowKit configuration
└── hooks/                   # Custom React hooks
```

## Key Components

### Authentication

- **LoginForm**: User login with email/password
- **RegisterForm**: User registration with optional wallet address
- **ProtectedRoute**: Route protection with authentication checks
- **AuthProvider**: Global authentication state management

### Document Management

- **UploadDialog**: Document upload with progress tracking
- **VerifyDialog**: Document verification by file or hash
- **ShareDialog**: Create and manage share links
- **DocumentsSection**: Document listing and management

### Wallet Integration

- **WalletConnect**: RainbowKit wallet connection component
- **RainbowKit Configuration**: Multi-chain wallet support

## API Integration

The frontend integrates with the LegalBox backend API:

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Document Endpoints

- `POST /api/documents/upload` - Upload document
- `GET /api/documents/wallet/:address` - Get documents by wallet
- `GET /api/documents/:id` - Get document details

### Share Endpoints

- `POST /api/share` - Create share link
- `GET /api/share/:id` - Access share link
- `DELETE /api/share/:id` - Revoke share link

### Verification Endpoints

- `POST /api/verify` - Verify document by file or hash

## Environment Variables

| Variable                               | Description                           | Required |
| -------------------------------------- | ------------------------------------- | -------- |
| `NEXT_PUBLIC_API_URL`                  | Backend API base URL                  | Yes      |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID              | Yes      |
| `NEXT_PUBLIC_POLL_INTERVAL`            | BlockDAG status polling interval (ms) | No       |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

1. Build the application: `npm run build`
2. Start the production server: `npm run start`
3. Set environment variables in your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@legalbox.com or join our Discord community.
