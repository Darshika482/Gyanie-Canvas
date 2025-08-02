# DataSense Resume Builder

A modern, feature-rich resume builder application built with React, TypeScript, and Tailwind CSS. Create professional resumes with multiple templates, real-time editing, and PDF export capabilities.

## 🚀 Features

- **Multiple Resume Templates**: Choose from 8+ professional templates
- **Real-time Editor**: WYSIWYG editing with live preview
- **PDF Export**: Generate high-quality PDF resumes
- **AI-Powered**: AI-assisted resume creation and optimization
- **LinkedIn Integration**: Import profile data from LinkedIn
- **ATS-Friendly**: Optimized for Applicant Tracking Systems
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Beautiful, intuitive interface with Tailwind CSS

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Dashboard/          # Dashboard components
│   │   ├── Editor/            # Resume editor components
│   │   ├── Forms/             # Form components
│   │   ├── Layout/            # Layout components
│   │   ├── Modals/            # Modal components
│   │   └── Templates/         # Resume templates
│   ├── data/                  # Default content and templates
│   ├── store/                 # State management
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── landing-page/              # Landing page application
├── server/                    # PDF generation server
├── scripts/                   # Build and utility scripts
└── examples/                  # Sample files
```

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Zustand
- **PDF Generation**: Puppeteer, jsPDF
- **Styling**: Tailwind CSS, CSS Modules
- **Development**: ESLint, Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Darshika482/Datasense_Resume.git
cd Datasense_Resume
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Templates

The application includes 8 professional resume templates:

1. **Modern Template** - Clean, contemporary design
2. **Elegant Template** - Sophisticated layout
3. **Creative Template** - Unique, artistic design
4. **Single Column Template** - Traditional single-column layout
5. **Double Column Template** - Two-column layout
6. **Multi Column Template** - Multi-column grid layout
7. **Timeline Template** - Chronological layout
8. **Ivy League Template** - Academic/professional design

## 🔧 Configuration

### PDF Generation

The application supports multiple PDF generation methods:

- **Client-side**: Using jsPDF for basic PDF generation
- **Server-side**: Using Puppeteer for high-quality PDFs
- **Python Integration**: Python-based PDF generation

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_PDF_SERVER_URL=your_pdf_server_url
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue on GitHub or contact the development team.

## 🎯 Roadmap

- [ ] Advanced AI resume optimization
- [ ] More template designs
- [ ] Resume sharing and collaboration
- [ ] Mobile app version
- [ ] Integration with job boards
- [ ] Resume analytics and tracking

---

Built with ❤️ by the DataSense team 