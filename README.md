# Hey There! 👋

I'm **Satpal**, also known as **debuggersatpal** — welcome to my portfolio website!  

I'm a **self-taught developer** who enjoys **creating things** that live on the internet 📱💻  
I love building **modern web apps**, **Android applications**, and exploring the world of **Artificial Intelligence**.  
Turning ideas into **clean**, **functional**, and **beautiful digital experiences** is what I do best.

---

### 🧠 About Me
- 💻 Passionate about **Web Development**, **Android**, and **AI-powered apps**  
- ⚙️ Skilled in **Java**, **Kotlin**, **Flutter**, **React**, **MongoDB**, **Firebase...**, and exploring **Machine Learning APIs**  
- 🧩 I enjoy designing, debugging, and optimizing projects from UI to backend logic  
- 📚 Constantly learning new tools and improving every line of my code  

---

### 🔗 Connect With Me
- 🌐 [Portfolio Website](https://debuggersatpal.github.io)
- 💼 [LinkedIn](https://linkedin.com/in/debuggersatpal)
- 🐙 [GitHub](https://github.com/debuggersatpal)
- ✉️ Reach me at **debuggersatpal@gmail.com**

---

> _"I enjoy creating things that blend creativity with technology — from web to Android to AI."_  
Thanks for visiting! 😊



src/
├── components/
│   ├── layout/
│   │   ├── PortfolioShell.astro
│   │   ├── Header.astro
│   │   ├── ContentShell.astro
│   │   ├── Sidebar.astro
│   │   └── MainContent.astro
│   │
│   ├── profile/
│   │   ├── ProfileCard.astro
│   │   ├── SocialLinks.astro
│   │   └── ProfileDetails.astro
│   │
│   └── ui/
│       └── ThemeToggle.astro
│
├── data/
│   ├── profile.ts
│   └── navigation.ts
│
├── layouts/
│   └── BaseLayout.astro
│
└── pages/
    └── index.astro


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "G-M9DF878HV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


PXdV7NIRbobnf8pZ6zSuJWUdShn2