# Contributing to Apex Weather

Thank you for your interest in contributing to Apex Weather! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your browser/OS information

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature already exists
- Clearly describe the feature
- Explain why it would be useful
- Provide examples if possible

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/apex-weather.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run dev    # Test in development
   npm run build  # Ensure build works
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```
   
   Commit message format:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes

6. **Push to your fork**
   ```bash
   git push origin feature/YourFeatureName
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots for UI changes

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop typing

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Maintain consistent spacing
- Use existing color variables

### File Organization
```
src/
├── components/      # UI components
├── hooks/           # Custom React hooks
├── services/        # API & external services
├── types/           # TypeScript types
├── utils/           # Helper functions
└── interpretation/  # Weather logic
```

## 🧪 Testing

Before submitting:
- Test on multiple screen sizes
- Check browser console for errors
- Test with slow network (throttling)
- Verify accessibility (keyboard navigation)

## 📚 Documentation

If your changes require documentation:
- Update README.md if needed
- Add JSDoc comments for functions
- Update inline comments
- Document complex logic

## ✅ Checklist

Before submitting a PR:
- [ ] Code follows project style
- [ ] No console errors or warnings
- [ ] Tested on mobile and desktop
- [ ] TypeScript types are correct
- [ ] Comments added for complex code
- [ ] README updated (if needed)
- [ ] Commit messages are clear

## 🚫 What Not to Do

- Don't commit `node_modules/`
- Don't commit `.env` files
- Don't add unnecessary dependencies
- Don't make unrelated changes in one PR
- Don't include personal API keys

## 💬 Questions?

Feel free to:
- Open an issue for questions
- Start a discussion
- Reach out to the maintainer

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Give constructive feedback
- Focus on the code, not the person

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Credited in release notes
- Appreciated for their work!

---

Thank you for contributing to Apex Weather! 🌤️
