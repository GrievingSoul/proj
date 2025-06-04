AI Resume Analyser + Job Matcher
=======
# AI Resume Analyzer & Job Matcher (Techpro Version) 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-orange.svg)](#tech-stack)
[![PDF.js](https://img.shields.io/badge/PDF%20Parsing-PDF.js-red.svg)](#tech-stack)

Welcome to the Techpro AI Resume Analyzer & Job Matcher! 🎉 This web app helps you analyze your resume, find job matches, and explore simulated salary data. It features secure user authentication and a client-side simulated AI engine. Dive in and supercharge your job search! 💼

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works (Client-Side Simulation)](#how-it-works-client-side-simulation)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Future Scope (Potential)](#future-scope-potential)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

This project provides a user-friendly interface for:
 Securely logging in or registering your Techpro account. 🔐
 Uploading PDF resumes or pasting text directly. 📄
 Simulated conversions for DOC, images, and HTML to PDF. 🔄
 Receiving simulated AI analysis of your resume (skills, experience). 💡
 Getting AI-matched companies (simulated). 🏢
 Exploring simulated salary data. 💰
 Accessing customer care and an AI chatbot for help. 💬

It's a frontend demonstration with all core functions (AI simulations, data storage) handled client-side using localStorage.

---

## Key Features

 User Authentication: Login and Registration system ("Techpro") with localStorage session management. ✅
 Resume Input: Direct PDF upload via pdf.js or simply paste text. ⬆📋
 File Converters (Simulated): DOC/DOCX/TXT/ODT/RTF to PDF, JPG/PNG/GIF/BMP to PDF, HTML to PDF. ➡📁
 AI Analysis & Matching (Simulated): Skills detection, experience level estimation, job role theme identification, and matching with predefined companies. 🎯📈🤝
 Salary Insights (Simulated): View salary ranges for matched companies; input preferred companies for custom analysis. 📊💲
 User Interface: Responsive design with distinct login and main app views. Interactive elements like loading spinners and alerts. 💻📱
 Support Features: Floating Customer Care button and interactive Chatbot for assistance. 📞🤖

---

## How It Works (Client-Side Simulation)

The app's magic happens in your browser:

1.  Authentication: User data is stored and checked against localStorage. 🔒
2.  Resume Processing: PDFs are parsed using pdf.js to extract text; pasted text is used directly. 📖📝
3.  AI Simulation: JavaScript functions simulate:
     Skill Matching: Checks resume text against predefined skills. ✨
     Experience Level: Estimates based on keywords/years mentioned. ⏳
     Company Matching: Selects from predefined companies based on skills/themes. 🏢
     Salary Generation: Creates salary ranges based on experience and company tiers with variations. 💸
4.  File Conversion: This is simulated, providing dummy output/download links. ➡📁

---

## Tech Stack

 Frontend: HTML5, CSS3, JavaScript (ES6+) 🌐
 PDF Parsing: pdf.js library 📚
 Data Storage (Client-Side): localStorage 💾

(No backend is used; all operations are client-side.)

---

## Getting Started

Ready to try it?

1.  Clone the repository:
    bash
    git clone https://github.com/GrievingSoul/proj.git
    
2.  Navigate to the project directory:
    bash
    cd proj
    
3.  Open grokweb.html in your web browser. No server setup needed! 🎉

---

## Usage

1.  Register or Log In: Use the forms. A default user (user@example.com / TechproSecure123) is ready if needed. 👤
2.  Upload/Paste Resume: Use the PDF upload or paste text directly. ⬆✍
3.  Analyze: Click "Analyze & Match Jobs." ✨
4.  View Results: See initial analysis, then click "Next Page" for details and salary insights. ➡📊
5.  Use Support: Click floating buttons for Customer Care or Chatbot. 🤝

---

## Future Scope (Potential)

Big dreams for Techpro:
 Backend Integration: For secure auth, real file handling, and actual AI/ML models. 🚀
 Real AI Models: Integrating NLP (spaCy, NLTK) and ML frameworks (TensorFlow). 🧠
 Job Board Integration: Connecting to live job APIs. 🌐
 Enhanced UI/UX: More visualizations and user profiles. 📈
 Database: For persistent storage. 🗄

---

## Contributing

Contributions are welcome!
1.  Fork the repository. 🍴
2.  Create a new branch (git checkout -b feature/YourFeature). 🌿
3.  Make your changes. ✍
4.  Commit your changes (git commit -m 'Add some feature'). 💾
5.  Push to the branch (git push origin feature/YourFeature). 🚀
6.  Open a Pull Request. 🌟

---

## Contact

 Project Maintainer: Asgar Pasha
 Email: asgarx07@gmail.com
 Project Link:https://github.com/GrievingSoul/proj.git
