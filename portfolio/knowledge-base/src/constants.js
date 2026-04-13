// Storage
export const STORE = "chase_knowledge_base_v1";
export const STORE_SEED_VERSION = "chase_knowledge_base_seed_version";
export const SEED_VERSION = 3;
export const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || null; } catch { return null; } };
export const save = (data) => { try { localStorage.setItem(STORE, JSON.stringify(data)); } catch {} };

// Seed bookmarks
export const SEED = [
  // --- Claude (1–9) ---
  { id: 1, title: "Claude Docs", url: "https://docs.anthropic.com", category: "Claude", description: "Official Anthropic documentation hub for Claude models and APIs" },
  { id: 2, title: "Claude Code", url: "https://docs.anthropic.com/en/docs/claude-code/overview", category: "Claude", description: "Claude's agentic coding tool for terminals and IDEs" },
  { id: 3, title: "Claude API", url: "https://docs.anthropic.com/en/api", category: "Claude", description: "REST API reference for integrating Claude into applications" },
  { id: 4, title: "Claude.ai", url: "https://claude.ai", category: "Claude", description: "Claude's main chat interface for conversation and reasoning tasks" },
  { id: 5, title: "Anthropic Console", url: "https://console.anthropic.com", category: "Claude", description: "Manage API keys, billing, usage, and Workbench playground" },
  { id: 6, title: "Anthropic Research", url: "https://www.anthropic.com/research", category: "Claude", description: "Anthropic's AI safety and capabilities research publications" },
  { id: 7, title: "Anthropic News", url: "https://www.anthropic.com/news", category: "Claude", description: "Official Anthropic blog and product announcements" },
  { id: 8, title: "Claude Status", url: "https://status.anthropic.com", category: "Claude", description: "Real-time Anthropic service health and incident history" },
  { id: 9, title: "Claude Cookbooks", url: "https://github.com/anthropics/claude-cookbooks", category: "Claude", description: "Official example notebooks and code recipes for Claude" },

  // --- ChatGPT (10–17) ---
  { id: 10, title: "ChatGPT", url: "https://chatgpt.com", category: "ChatGPT", description: "OpenAI's main AI chat interface" },
  { id: 11, title: "ChatGPT Help", url: "https://help.openai.com", category: "ChatGPT", description: "OpenAI help center for ChatGPT and API support" },
  { id: 12, title: "OpenAI Platform Docs", url: "https://platform.openai.com/docs", category: "ChatGPT", description: "Developer docs for OpenAI models, fine-tuning, and APIs" },
  { id: 13, title: "OpenAI Playground", url: "https://platform.openai.com/playground", category: "ChatGPT", description: "Interactive browser-based testing for OpenAI models" },
  { id: 14, title: "OpenAI Developer Forum", url: "https://community.openai.com", category: "ChatGPT", description: "Official developer community Q&A and discussion" },
  { id: 15, title: "OpenAI Blog", url: "https://openai.com/blog", category: "ChatGPT", description: "OpenAI research announcements and product updates" },
  { id: 16, title: "OpenAI Status", url: "https://status.openai.com", category: "ChatGPT", description: "Real-time OpenAI service health and incident history" },
  { id: 17, title: "OpenAI Cookbook", url: "https://cookbook.openai.com", category: "ChatGPT", description: "Official code examples and guides for OpenAI APIs" },

  // --- Gemini (18–25) ---
  { id: 18, title: "Gemini API Docs", url: "https://ai.google.dev/gemini-api/docs", category: "Gemini", description: "Official Gemini API reference and quickstarts" },
  { id: 19, title: "Google AI Studio", url: "https://aistudio.google.com", category: "Gemini", description: "Browser-based playground for prototyping with Gemini models" },
  { id: 20, title: "Gemini App", url: "https://gemini.google.com", category: "Gemini", description: "Google's main Gemini chat interface" },
  { id: 21, title: "Gemini App Help", url: "https://support.google.com/gemini", category: "Gemini", description: "Support docs for the Gemini consumer app" },
  { id: 22, title: "NotebookLM", url: "https://notebooklm.google.com", category: "Gemini", description: "Google's AI research assistant grounded in your uploaded sources" },
  { id: 23, title: "Google Colab", url: "https://colab.research.google.com", category: "Gemini", description: "Free hosted Jupyter notebooks with GPU access" },
  { id: 24, title: "Gemini Cookbook", url: "https://github.com/google-gemini/cookbook", category: "Gemini", description: "Official Gemini API example notebooks and guides" },
  { id: 25, title: "Google AI Blog", url: "https://blog.google/technology/ai", category: "Gemini", description: "Google's AI announcements, research, and product updates" },

  // --- Cursor (26–29) ---
  { id: 26, title: "Cursor Docs", url: "https://cursor.com/docs", category: "Cursor", description: "Official documentation for the Cursor AI code editor" },
  { id: 27, title: "Cursor Blog", url: "https://cursor.com/blog", category: "Cursor", description: "Cursor product announcements and engineering posts" },
  { id: 28, title: "Cursor Changelog", url: "https://cursor.com/changelog", category: "Cursor", description: "Running list of Cursor releases and feature updates" },
  { id: 29, title: "Cursor Forum", url: "https://forum.cursor.com", category: "Cursor", description: "Official Cursor community for support and discussion" },

  // --- Perplexity (30–34) ---
  { id: 30, title: "Perplexity", url: "https://perplexity.ai", category: "Perplexity", description: "AI-powered search engine with cited, conversational answers" },
  { id: 31, title: "Perplexity API Docs", url: "https://docs.perplexity.ai", category: "Perplexity", description: "API reference for Perplexity's Sonar search models" },
  { id: 32, title: "Perplexity Guides", url: "https://perplexity.ai/hub", category: "Perplexity", description: "Perplexity blog, product announcements, and guides" },
  { id: 33, title: "Perplexity Changelog", url: "https://perplexity.ai/changelog", category: "Perplexity", description: "Recent Perplexity product updates and new features" },
  { id: 34, title: "Perplexity Help Center", url: "https://perplexity.ai/help-center/en", category: "Perplexity", description: "Support docs for Perplexity accounts and features" },

  // --- Prompting (35–38) ---
  { id: 35, title: "Anthropic Prompt Engineering", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", category: "Prompting", description: "Anthropic's official guide to writing effective prompts for Claude" },
  { id: 36, title: "OpenAI Cookbook", url: "https://cookbook.openai.com", category: "Prompting", description: "Code examples and prompting recipes for OpenAI models" },
  { id: 37, title: "Google Prompting Guide 101", url: "https://services.google.com/fh/files/misc/gemini-for-google-workspace-prompting-guide-101.pdf", category: "Prompting", description: "Google's beginner-to-intermediate prompting guide for Gemini" },
  { id: 38, title: "Learn Prompting", url: "https://learnprompting.org", category: "Prompting", description: "Free open-source guide to prompt engineering across all major models" },

  // --- Learning (39–46) ---
  { id: 39, title: "Anthropic Courses", url: "https://github.com/anthropics/courses", category: "Learning", description: "Official Anthropic structured courses on Claude and the API" },
  { id: 40, title: "DeepLearning.AI Short Courses", url: "https://www.deeplearning.ai/short-courses", category: "Learning", description: "Free bite-sized AI courses from Andrew Ng and top AI labs" },
  { id: 41, title: "Hugging Face Learn", url: "https://huggingface.co/learn", category: "Learning", description: "Official courses on LLMs, agents, diffusion, and MCP from Hugging Face" },
  { id: 42, title: "Fast.ai", url: "https://course.fast.ai", category: "Learning", description: "Practical, code-first deep learning course; top-down teaching approach" },
  { id: 43, title: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course", category: "Learning", description: "Free Google course covering ML fundamentals with TensorFlow examples" },
  { id: 44, title: "Vercel AI SDK Docs", url: "https://ai-sdk.dev/docs/introduction", category: "Learning", description: "Official docs for building AI-powered apps with Vercel's AI SDK" },
  { id: 45, title: "LangChain Docs", url: "https://docs.langchain.com", category: "Learning", description: "Framework docs for building LLM-powered chains and agents" },
  { id: 46, title: "LlamaIndex Docs", url: "https://docs.llamaindex.ai", category: "Learning", description: "Docs for the LlamaIndex framework for RAG and data-connected LLM apps" },

  // --- Dev Tools (47–54) ---
  { id: 47, title: "Aider", url: "https://aider.chat", category: "Dev Tools", description: "AI pair programmer that edits code in your local git repo via CLI" },
  { id: 48, title: "Continue.dev", url: "https://continue.dev", category: "Dev Tools", description: "Open-source AI coding assistant extension for VS Code and JetBrains" },
  { id: 49, title: "MCP Docs", url: "https://modelcontextprotocol.io", category: "Dev Tools", description: "Official spec and guides for the Model Context Protocol standard" },
  { id: 50, title: "v0 by Vercel", url: "https://v0.app", category: "Dev Tools", description: "Vercel's AI tool for generating UI components from text prompts" },
  { id: 51, title: "Windsurf Docs", url: "https://docs.windsurf.com", category: "Dev Tools", description: "Documentation for Windsurf, Codeium's AI-powered code editor" },
  { id: 52, title: "Ollama", url: "https://ollama.com", category: "Dev Tools", description: "Run large language models locally on Mac, Linux, and Windows" },
  { id: 53, title: "LM Studio", url: "https://lmstudio.ai", category: "Dev Tools", description: "GUI app for downloading and running local LLMs with a chat interface" },
  { id: 54, title: "GitHub Copilot Docs", url: "https://docs.github.com/en/copilot", category: "Dev Tools", description: "Official docs for GitHub Copilot AI coding assistant setup and features" },

  // --- Community (55–62) ---
  { id: 55, title: "Simon Willison's Blog", url: "https://simonwillison.net", category: "Community", description: "Daily AI and developer news from a leading practitioner and OSS author" },
  { id: 56, title: "Latent Space", url: "https://www.latent.space", category: "Community", description: "The top AI engineering podcast and newsletter by swyx and Alessio" },
  { id: 57, title: "TLDR AI", url: "https://tldr.tech/ai", category: "Community", description: "Daily 5-minute newsletter covering the most important AI news" },
  { id: 58, title: "The Batch", url: "https://www.deeplearning.ai/the-batch", category: "Community", description: "Andrew Ng's weekly newsletter on AI research and industry trends" },
  { id: 59, title: "Chip Huyen's Blog", url: "https://huyenchip.com/blog", category: "Community", description: "In-depth writing on ML systems, AI engineering, and production ML" },
  { id: 60, title: "r/ClaudeAI", url: "https://www.reddit.com/r/ClaudeAI", category: "Community", description: "Reddit community for Claude users and developers" },
  { id: 61, title: "r/LocalLLaMA", url: "https://www.reddit.com/r/LocalLLaMA", category: "Community", description: "Reddit's largest community for running and discussing local LLMs" },
  { id: 62, title: "Hacker News", url: "https://news.ycombinator.com", category: "Community", description: "Tech-focused link aggregator; consistently surfaces important AI news" },

  // --- GitHub (63–70) ---
  { id: 63, title: "GitHub", url: "https://github.com", category: "GitHub", description: "The world's largest code hosting platform for version control and collaboration" },
  { id: 64, title: "GitHub Docs", url: "https://docs.github.com/en", category: "GitHub", description: "Official documentation for all GitHub features, APIs, and workflows" },
  { id: 65, title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", category: "GitHub", description: "CI/CD workflow documentation: syntax, runners, triggers, and reference" },
  { id: 66, title: "GitHub CLI", url: "https://cli.github.com", category: "GitHub", description: "Command-line tool for GitHub: PRs, issues, repos, workflows from the terminal" },
  { id: 67, title: "GitHub Skills", url: "https://skills.github.com", category: "GitHub", description: "Interactive hands-on learning courses using real repos and GitHub Actions" },
  { id: 68, title: "GitHub Blog", url: "https://github.blog", category: "GitHub", description: "Engineering posts, product announcements, and security research from GitHub" },
  { id: 69, title: "GitHub Status", url: "https://www.githubstatus.com", category: "GitHub", description: "Real-time and historical service health across all GitHub systems" },
  { id: 70, title: "GitHub Marketplace", url: "https://github.com/marketplace", category: "GitHub", description: "Actions, apps, and integrations to extend GitHub workflows" },

  // --- Swift (71–78) ---
  { id: 71, title: "Swift.org", url: "https://www.swift.org", category: "Swift", description: "Official Swift language home: downloads, documentation, and community" },
  { id: 72, title: "Swift Evolution", url: "https://www.swift.org/swift-evolution", category: "Swift", description: "Accepted and active proposals for Swift language changes by version" },
  { id: 73, title: "Swift Forums", url: "https://forums.swift.org", category: "Swift", description: "Official Swift community forums for evolution, server, and language discussion" },
  { id: 74, title: "Swift Blog", url: "https://www.swift.org/blog", category: "Swift", description: "Official Swift release announcements and monthly \"What's New\" posts" },
  { id: 75, title: "Swift Package Index", url: "https://swiftpackageindex.com", category: "Swift", description: "Apple-backed index of Swift packages with compatibility and build status" },
  { id: 76, title: "swiftlang GitHub Org", url: "https://github.com/swiftlang", category: "Swift", description: "Open-source home of the Swift compiler, stdlib, and official tooling" },
  { id: 77, title: "Swift on Server", url: "https://www.swift.org/documentation/server", category: "Swift", description: "Official Swift Server Workgroup guides for Linux deployment and production" },
  { id: 78, title: "Vapor", url: "https://vapor.codes", category: "Swift", description: "The most widely used Swift web framework for server-side Swift development" },

  // --- Apple Developer (79–87) ---
  { id: 79, title: "Apple Developer Account", url: "https://developer.apple.com/account", category: "Apple Developer", description: "Manage your Apple Developer Program membership, certificates, and provisioning" },
  { id: 80, title: "SwiftUI Documentation", url: "https://developer.apple.com/documentation/swiftui", category: "Apple Developer", description: "Apple's full SwiftUI API reference with declarative UI examples" },
  { id: 81, title: "Xcode Documentation", url: "https://developer.apple.com/documentation/xcode", category: "Apple Developer", description: "Official Xcode IDE docs: build settings, debugging, Instruments, and testing" },
  { id: 82, title: "Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines", category: "Apple Developer", description: "Apple's design standards for iOS, macOS, watchOS, and visionOS" },
  { id: 83, title: "App Store Connect", url: "https://appstoreconnect.apple.com", category: "Apple Developer", description: "Manage app submissions, metadata, pricing, and TestFlight builds" },
  { id: 84, title: "WWDC Sessions", url: "https://developer.apple.com/videos", category: "Apple Developer", description: "Archive of all Apple WWDC and Tech Talk session videos" },
  { id: 85, title: "TestFlight", url: "https://developer.apple.com/testflight", category: "Apple Developer", description: "Beta testing platform for distributing pre-release iOS and macOS apps" },
  { id: 86, title: "Apple Developer Forums", url: "https://developer.apple.com/forums", category: "Apple Developer", description: "Official Apple developer Q&A community for platform questions" },
  { id: 87, title: "Swift Documentation", url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language", category: "Apple Developer", description: "The canonical Swift language reference book, always current" },

  // --- iOS Dev (88–94) ---
  { id: 88, title: "Hacking with Swift", url: "https://www.hackingwithswift.com", category: "iOS Dev", description: "Paul Hudson's encyclopedic iOS site: 100 Days of SwiftUI, SwiftUI by Example" },
  { id: 89, title: "Swift by Sundell", url: "https://www.swiftbysundell.com", category: "iOS Dev", description: "In-depth articles on Swift patterns, architecture, and SwiftUI best practices" },
  { id: 90, title: "Point-Free", url: "https://www.pointfree.co", category: "iOS Dev", description: "Advanced Swift video series; creators of The Composable Architecture (TCA)" },
  { id: 91, title: "Kodeco", url: "https://www.kodeco.com", category: "iOS Dev", description: "Structured SwiftUI learning paths, books, and tutorials from Ray Wenderlich" },
  { id: 92, title: "Use Your Loaf", url: "https://useyourloaf.com", category: "iOS Dev", description: "Precise, practical iOS/Swift articles on layout, Foundation, and Xcode" },
  { id: 93, title: "WWDC Notes", url: "https://wwdcnotes.com", category: "iOS Dev", description: "Community-written summaries for every WWDC session, preserving removed talks" },
  { id: 94, title: "TCA (GitHub)", url: "https://github.com/pointfreeco/swift-composable-architecture", category: "iOS Dev", description: "The Composable Architecture: leading opinionated iOS architecture library" },

  // --- Web Dev (95–101) ---
  { id: 95, title: "React Docs", url: "https://react.dev", category: "Web Dev", description: "Official React documentation, fully rewritten with hooks-first interactive examples" },
  { id: 96, title: "MDN Web Docs", url: "https://developer.mozilla.org", category: "Web Dev", description: "The authoritative HTML, CSS, and JavaScript reference from Mozilla" },
  { id: 97, title: "JavaScript.info", url: "https://javascript.info", category: "Web Dev", description: "Deep guide to modern JavaScript from fundamentals to advanced async patterns" },
  { id: 98, title: "web.dev", url: "https://web.dev", category: "Web Dev", description: "Google's platform for Core Web Vitals, performance, PWA, and accessibility" },
  { id: 99, title: "CSS-Tricks", url: "https://css-tricks.com", category: "Web Dev", description: "Comprehensive CSS almanac with the best Flexbox and Grid guides available" },
  { id: 100, title: "Can I Use", url: "https://caniuse.com", category: "Web Dev", description: "Browser support tables for every web platform feature and API" },
  { id: 101, title: "Bundlephobia", url: "https://bundlephobia.com", category: "Web Dev", description: "Check npm package bundle sizes before installing to protect app performance" },

  // --- Coding (102–106) ---
  { id: 102, title: "Exercism", url: "https://exercism.org", category: "Coding", description: "82-language coding tracks with mentor feedback; great for Swift and JS" },
  { id: 103, title: "Codewars", url: "https://www.codewars.com", category: "Coding", description: "Kata-style coding challenges ranked by difficulty with community solutions" },
  { id: 104, title: "Advent of Code", url: "https://adventofcode.com", category: "Coding", description: "Annual December puzzle series with archives; excellent for Swift practice" },
  { id: 105, title: "Project Euler", url: "https://projecteuler.net", category: "Coding", description: "800+ math-heavy programming problems for deepening algorithmic thinking" },
  { id: 106, title: "Grind 75", url: "https://www.techinterviewhandbook.org/grind75", category: "Coding", description: "Customizable curated LeetCode problem set; better ROI than Blind 75" },

  // --- Design (107–115) ---
  { id: 107, title: "Refactoring UI", url: "https://www.refactoringui.com", category: "Design", description: "The essential design book for developers: hierarchy, spacing, color, typography" },
  { id: 108, title: "Nielsen Norman Group", url: "https://www.nngroup.com/articles", category: "Design", description: "1,100+ free research-backed UX articles; the gold standard for interaction design" },
  { id: 109, title: "Figma Learn", url: "https://help.figma.com", category: "Design", description: "Official Figma courses and tutorials from beginner to advanced; free" },
  { id: 110, title: "Coolors", url: "https://coolors.co", category: "Design", description: "The fastest color palette generator; spacebar to iterate, includes contrast checker" },
  { id: 111, title: "WebAIM Contrast Checker", url: "https://webaim.org/resources/contrastchecker", category: "Design", description: "Instant WCAG 2.1 AA/AAA contrast ratio checking for any color pair" },
  { id: 112, title: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge", category: "Design", description: "Typography theory and type-pairing guidance alongside Google's free font library" },
  { id: 113, title: "Mobbin", url: "https://mobbin.com", category: "Design", description: "400,000+ searchable real iOS and web app screenshots for UI pattern research" },
  { id: 114, title: "Dribbble", url: "https://dribbble.com", category: "Design", description: "Designer portfolio community for visual style and UI aesthetic exploration" },
  { id: 115, title: "Figma Design Systems", url: "https://www.figma.com/resource-library/design-system-examples", category: "Design", description: "Curated real-world design system examples from Figma's resource library" },

  // --- Architecture (116–119) ---
  { id: 116, title: "Refactoring Guru", url: "https://refactoring.guru", category: "Architecture", description: "Visual language-agnostic guide to all 23 GoF design patterns and refactoring" },
  { id: 117, title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", category: "Architecture", description: "The most-referenced free guide to large-scale system design with diagrams" },
  { id: 118, title: "ByteByteGo", url: "https://blog.bytebytego.com", category: "Architecture", description: "Weekly visual system design deep dives from Alex Xu (System Design Interview author)" },
  { id: 119, title: "Awesome Software Architecture", url: "https://github.com/mehdihadeli/awesome-software-architecture", category: "Architecture", description: "Curated articles, videos, and resources on architecture patterns and principles" },

  // --- Job Search (120–141) ---
  { id: 120, title: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs", category: "Job Search", description: "The largest professional job network; essential for recruiter visibility and networking" },
  { id: 121, title: "Wellfound", url: "https://wellfound.com", category: "Job Search", description: "Startup-focused job board with 150K+ tech roles and salary transparency" },
  { id: 122, title: "Dice", url: "https://www.dice.com", category: "Job Search", description: "Tech-only job board with high signal for engineering and data science roles" },
  { id: 123, title: "Built In", url: "https://builtin.com", category: "Job Search", description: "Tech company profiles with full benefit, culture, and stack details plus job listings" },
  { id: 124, title: "We Work Remotely", url: "https://weworkremotely.com", category: "Job Search", description: "Top remote-first job board, heavily weighted toward software engineering roles" },
  { id: 125, title: "aijobs.ai", url: "https://aijobs.ai", category: "Job Search", description: "Leading specialized board for AI, ML, and data science roles" },
  { id: 126, title: "Teal HQ", url: "https://www.tealhq.com", category: "Job Search", description: "All-in-one job tracker, resume builder, and JD keyword matcher" },
  { id: 127, title: "Jobscan", url: "https://www.jobscan.co", category: "Job Search", description: "ATS optimization tool that scores your resume against a job description" },
  { id: 128, title: "LeetCode", url: "https://leetcode.com", category: "Job Search", description: "Industry-standard coding practice platform with 3,000+ problems and company tags" },
  { id: 129, title: "NeetCode", url: "https://neetcode.io", category: "Job Search", description: "Curated NeetCode 150 problem list with best-in-class video explanations" },
  { id: 130, title: "AlgoMonster", url: "https://algo.monster", category: "Job Search", description: "Pattern-based algorithm learning with interactive content; structured alternative to grinding" },
  { id: 131, title: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org", category: "Job Search", description: "Free comprehensive guide covering coding, system design, and behavioral interviews" },
  { id: 132, title: "ByteByteGo System Design", url: "https://bytebytego.com", category: "Job Search", description: "Alex Xu's animated system design video explainers and newsletter" },
  { id: 133, title: "Hello Interview", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction", category: "Job Search", description: "FAANG hiring manager-built system design crash course" },
  { id: 134, title: "Levels.fyi", url: "https://www.levels.fyi", category: "Job Search", description: "The most trusted source for real total compensation data at tech companies" },
  { id: 135, title: "Glassdoor", url: "https://www.glassdoor.com", category: "Job Search", description: "Salary data, company reviews, and interview experience reports" },
  { id: 136, title: "Blind", url: "https://www.teamblind.com", category: "Job Search", description: "Anonymous verified-employee community for candid salary data and company intel" },
  { id: 137, title: "MentorCruise", url: "https://mentorcruise.com", category: "Job Search", description: "Platform to find paid mentors who are senior engineers at top companies" },
  { id: 138, title: "Crunchbase", url: "https://www.crunchbase.com", category: "Job Search", description: "Funding rounds, investor data, and growth metrics for startup research" },
  { id: 139, title: "Pragmatic Engineer", url: "https://newsletter.pragmaticengineer.com", category: "Job Search", description: "Gergely Orosz's newsletter on tech company internals and engineering culture" },
  { id: 140, title: "Kaggle", url: "https://www.kaggle.com", category: "Job Search", description: "ML competition platform that doubles as a portfolio builder for data science roles" },
  { id: 141, title: "Interviewing.io", url: "https://interviewing.io", category: "Job Search", description: "Anonymous mock technical interviews with FAANG-level senior engineers" },

  // --- GMAT (142–153) ---
  { id: 142, title: "GMAT Official Site", url: "https://www.mba.com/exams/gmat-exam", category: "GMAT", description: "The official GMAT Focus Edition registration, score reports, and exam info" },
  { id: 143, title: "GMAT Official Prep", url: "https://www.mba.com/exams/gmat-exam/prep-for-the-exam", category: "GMAT", description: "Official GMAT prep hub with free practice exams 1 and 2 and strategy guides" },
  { id: 144, title: "GMAT Official Guide 2025-2026", url: "https://www.mba.com/exam-prep/gmat-official-guide-2025-2026-ebook-and-online-question-bank", category: "GMAT", description: "Latest official guide with 975+ authentic Focus Edition questions" },
  { id: 145, title: "Target Test Prep", url: "https://gmat.targettestprep.com", category: "GMAT", description: "Highly rated GMAT prep platform with AI assist and deep analytics" },
  { id: 146, title: "Manhattan Prep GMAT", url: "https://www.manhattanprep.com/gmat", category: "GMAT", description: "2,300+ practice questions with adaptive study calendar and bite-sized lessons" },
  { id: 147, title: "Magoosh GMAT", url: "https://gmat.magoosh.com", category: "GMAT", description: "Budget-friendly prep with 200+ video lessons, fully updated for Focus Edition" },
  { id: 148, title: "GMAT Club", url: "https://gmatclub.com", category: "GMAT", description: "The largest GMAT community with forums, free mock tests, and score tools" },
  { id: 149, title: "GMAT Club Free Mocks", url: "https://gmatclub.com/gmat-focus-tests", category: "GMAT", description: "Free adaptive GMAT Focus Edition mock tests mirroring the official interface" },
  { id: 150, title: "r/GMAT", url: "https://www.reddit.com/r/GMAT", category: "GMAT", description: "Active Reddit community for score reports, study strategy, and resource recommendations" },
  { id: 151, title: "e-GMAT Study Plan", url: "https://e-gmat.com/blogs/gmat-focus-study-plan", category: "GMAT", description: "Free structured GMAT Focus Edition study plan with section strategy" },
  { id: 152, title: "GMAT Club Score Calculator", url: "https://gmatclub.com/forum/gmat-focus-score-calculator-418782.html", category: "GMAT", description: "Free tool to convert section scores to total Focus Edition score with percentiles" },
  { id: 153, title: "GMAT Club Error Log", url: "https://gmatclub.com/blog/gmat-club-error-log-the-best-tool-for-gmat-preparation", category: "GMAT", description: "Free error log tool that auto-saves timed practice and tracks question patterns" },

  // --- Tools (154–155) ---
  { id: 154, title: "Sunsama", url: "https://sunsama.com", category: "Tools", description: "Daily planning tool that pulls from Linear, GitHub, and calendars into one view" },
  { id: 155, title: "Linear", url: "https://linear.app", category: "Tools", description: "Fast, opinionated project and issue tracker built for software teams" },

  // --- My Projects (156–169) ---
  { id: 156, title: "Wellness Tracker", url: "https://wellnes-tracker.vercel.app", category: "My Projects", description: "Personal wellness check-in and habit tracker web app" },
  { id: 157, title: "Job Search HQ", url: "https://job-search-hq.vercel.app", category: "My Projects", description: "Job search pipeline and application tracker web app" },
  { id: 158, title: "App Forge", url: "https://app-forge-fawn.vercel.app", category: "My Projects", description: "App idea generator and product planning tool web app" },
  { id: 159, title: "Knowledge Base", url: "https://knowledge-base-beta-five.vercel.app", category: "My Projects", description: "This bookmark manager and personal knowledge base" },
  { id: 160, title: "RollerTask Tycoon (iOS)", url: "https://github.com/iamchasewhittaker/roller-task-tycoon", category: "My Projects", description: "Task management iOS app with gamification elements" },
  { id: 161, title: "YNAB Clarity (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/ynab-clarity-ios", category: "My Projects", description: "iOS app for YNAB budget review and category funding" },
  { id: 162, title: "Spend Clarity", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/spend-clarity", category: "My Projects", description: "Python CLI tool for enriching YNAB transactions from Gmail receipts" },
  { id: 163, title: "ClarityUI (Swift pkg)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-ui", category: "My Projects", description: "Shared SwiftUI component library used across the Clarity iOS app suite" },
  { id: 164, title: "Clarity Check-in (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-checkin-ios", category: "My Projects", description: "Daily wellness check-in iOS app with mood, meds, and scripture tracking" },
  { id: 165, title: "Clarity Triage (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-triage-ios", category: "My Projects", description: "iOS app for capacity planning: tasks, ideas, and wins" },
  { id: 166, title: "Clarity Time (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-time-ios", category: "My Projects", description: "iOS app for time session tracking and scripture streak" },
  { id: 167, title: "Clarity Budget (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-budget-ios", category: "My Projects", description: "iOS app for dual-scenario budget planning and wants tracking" },
  { id: 168, title: "Clarity Growth (iOS)", url: "https://github.com/iamchasewhittaker/apps/tree/main/portfolio/clarity-growth-ios", category: "My Projects", description: "iOS app for tracking 7 growth areas with streaks and progress" },
  { id: 169, title: "AI Dev Mastery", url: "https://github.com/iamchasewhittaker/apps/tree/main/projects/ai-dev-mastery", category: "My Projects", description: "AI developer course viewer app" },
];

// Inline styles (replaces Tailwind classes)
export const s = {
  root: { minHeight: "100vh", background: "#09090b", color: "#f4f4f5", padding: 16, fontFamily: "system-ui, -apple-system, sans-serif" },
  container: { maxWidth: 896, margin: "0 auto" },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 30, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 },
  headerSub: { fontSize: 14, color: "#a1a1aa" },

  // Search row
  searchRow: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  searchWrap: { position: "relative", flex: 1, minWidth: 200 },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#71717a" },
  searchInput: { width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: 8, paddingLeft: 40, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 14, color: "#f4f4f5", outline: "none", boxSizing: "border-box" },
  addBtn: { background: "#f4f4f5", color: "#18181b", borderRadius: 8, padding: "8px 16px", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" },

  // Category pills
  pillRow: { display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 },
  pill: { padding: "4px 12px", borderRadius: 9999, fontSize: 12, whiteSpace: "nowrap", border: "1px solid #27272a", background: "#18181b", color: "#d4d4d8", cursor: "pointer" },
  pillActive: { background: "#f4f4f5", color: "#18181b", borderColor: "#f4f4f5" },

  // Add/Edit form
  formCard: { background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: 16, marginBottom: 16 },
  formInput: { width: "100%", background: "#09090b", border: "1px solid #27272a", borderRadius: 4, padding: "8px 12px", fontSize: 14, color: "#f4f4f5", outline: "none", marginBottom: 8, boxSizing: "border-box" },
  formActions: { display: "flex", gap: 8 },
  formBtnSave: { background: "#10b981", color: "#09090b", borderRadius: 4, padding: "6px 12px", fontSize: 14, fontWeight: 500, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
  formBtnCancel: { background: "#27272a", color: "#d4d4d8", borderRadius: 4, padding: "6px 12px", fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },

  // Bookmark list
  listWrap: { display: "flex", flexDirection: "column", gap: 16 },
  listWrapInner: { border: "1px solid #27272a", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" },
  listRow: { display: "flex", alignItems: "center", gap: 12, padding: 12 },
  listRowBorder: { borderBottom: "1px solid #27272a" },
  categoryBadge: { fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#27272a", color: "#d4d4d8", whiteSpace: "nowrap" },
  linkArea: { flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" },
  linkTitle: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 },
  linkIcon: { color: "#71717a", flexShrink: 0 },
  actionBtn: { padding: 6, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "#a1a1aa", display: "flex", alignItems: "center" },

  // Bookmark row additions
  descText: { fontSize: 12, color: "#71717a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 },
  visitsBadge: { fontSize: 11, color: "#52525b", whiteSpace: "nowrap", minWidth: 28, textAlign: "right" },
  starBtn: { padding: 6, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center" },

  // Status pills
  statusPill: { fontSize: 11, padding: "2px 7px", borderRadius: 9999, fontWeight: 500, whiteSpace: "nowrap" },

  // Group headers
  groupWrap: { marginBottom: 16 },
  groupHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", cursor: "pointer", borderRadius: "8px 8px 0 0", background: "#18181b", border: "1px solid #27272a", userSelect: "none" },
  groupHeaderLeft: { display: "flex", alignItems: "center", gap: 10 },
  groupTitle: { fontSize: 15, fontWeight: 600, color: "#f4f4f5" },
  groupCount: { fontSize: 12, color: "#71717a", background: "#27272a", padding: "1px 8px", borderRadius: 9999 },
  groupChevron: { color: "#71717a", flexShrink: 0, transition: "transform 0.2s" },
  pinnedHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", cursor: "default", borderRadius: "8px 8px 0 0", background: "#18181b", border: "1px solid #facc15", borderBottom: "1px solid #27272a", userSelect: "none" },
  pinnedTitle: { fontSize: 15, fontWeight: 600, color: "#facc15" },

  // Detail panel (expanded row)
  detailPanel: { padding: "12px 16px", background: "#0d0d0f", borderTop: "1px solid #27272a", display: "flex", flexDirection: "column", gap: 12 },
  detailRow: { display: "flex", alignItems: "center", gap: 12 },
  detailLabel: { fontSize: 12, color: "#71717a", width: 80, flexShrink: 0 },
  detailMeta: { fontSize: 11, color: "#52525b" },
  notesArea: { width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: 4, padding: "8px 12px", fontSize: 13, color: "#f4f4f5", outline: "none", resize: "vertical", minHeight: 72, boxSizing: "border-box", fontFamily: "system-ui, -apple-system, sans-serif" },
  progressWrap: { flex: 1, display: "flex", alignItems: "center", gap: 10 },
  progressTrack: { flex: 1, height: 6, background: "#27272a", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", background: "#10b981", borderRadius: 3, transition: "width 0.2s" },
  progressLabel: { fontSize: 12, color: "#a1a1aa", width: 36, textAlign: "right" },
  statusBtns: { display: "flex", gap: 6 },
  statusBtn: { fontSize: 12, padding: "3px 10px", borderRadius: 9999, border: "1px solid #27272a", background: "transparent", cursor: "pointer", color: "#71717a" },
  statusBtnActive: { border: "none", cursor: "pointer", fontSize: 12, padding: "3px 10px", borderRadius: 9999 },
  expandBtn: { padding: 6, borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "#52525b", display: "flex", alignItems: "center" },

  // Footer + empty
  footer: { fontSize: 12, color: "#52525b", marginTop: 16, textAlign: "center" },
  empty: { fontSize: 14, color: "#71717a", textAlign: "center", padding: "32px 0" },
};

// CSS for hover effects (can't do inline)
export const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
input:focus { border-color: #52525b !important; }
.kb-row:hover { background: #18181b; }
.kb-row .kb-actions { opacity: 0; transition: opacity 0.15s; }
.kb-row:hover .kb-actions { opacity: 1; }
.kb-add:hover { background: #fff; }
.kb-save:hover { background: #34d399; }
.kb-cancel:hover { background: #3f3f46; }
.kb-pill:hover { border-color: #3f3f46; }
.kb-act:hover { background: #27272a; color: #f4f4f5; }
.kb-del:hover { color: #f87171 !important; }
.kb-group-header:hover { background: #1c1c1f !important; }
.kb-star { color: #52525b; }
.kb-star:hover { color: #facc15; }
.kb-star.pinned { color: #facc15; }
.kb-expand:hover { color: #a1a1aa; }
.kb-status-btn:hover { opacity: 0.85; }
input[type=range] { accent-color: #10b981; cursor: pointer; }
textarea:focus { border-color: #52525b !important; }
`;
