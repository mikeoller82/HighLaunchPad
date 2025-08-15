# 🔒 HighLaunchPad Development Repository

This is the **private development repository** for HighLaunchPad. All proprietary code, features, and development work happens here.

## 🚀 **Quick Start**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 **Repository Structure**

```
HighLaunchPad-dev/          # Private development repo (THIS ONE)
├── src/                    # All application code
├── scripts/                # Development scripts
│   └── sync-public.sh     # Sync docs to public repo
└── README-DEV.md          # This file

HighLaunchPad/             # Public marketing repo
├── README.md              # Public-facing documentation
├── .gitignore             # Hides all proprietary code
└── (docs only)            # No source code
```

## 🔄 **Development Workflow**

### **Daily Development**
1. Work in this repository (`HighLaunchPad-dev`)
2. Commit and push changes normally
3. All your code stays private

### **Updating Public Documentation**
When you want to update the public README or docs:

```bash
# Run the sync script
./scripts/sync-public.sh
```

This will:
- Copy README.md to the public repo
- Copy any documentation files
- Commit and push to GitHub automatically

## 🛡️ **Security Notes**

- ✅ **This repo**: Contains ALL your code (keep private)
- ✅ **Public repo**: Only README and docs (safe for GitHub)
- ✅ **Environment files**: Always ignored in both repos
- ✅ **API keys**: Never committed to either repo

## 📝 **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

## 🔗 **Repository Links**

- **Development (Private)**: `/home/mike/HighLaunchPad-dev` (THIS ONE)
- **Public Marketing**: `/home/mike/HighLaunchPad`
- **GitHub Public**: https://github.com/mikeoller82/HighLaunchPad

## 🎯 **Next Steps**

1. **Continue development** in this repository
2. **Create private GitHub repo** when ready (optional)
3. **Use sync script** to update public documentation
4. **Deploy from this repo** to production

---

**Remember**: This is your private development space. All the real work happens here! 🚀