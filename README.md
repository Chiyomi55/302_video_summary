# 🎥🤖 Welcome to 302.AI's AI Audio and Video Summary! 🚀✨

[中文](README_zh.md) | [English](README.md) | [日本語](README_ja.md)

Open-source version of the [AI Audio and Video Summary](https://302.ai/tools/videosum/) from [302.AI](https://302.ai).
You can directly log in to 302.AI for a zero-code, zero-configuration online2ence.
Alternatively, customize this project to suit your needs, integrate 302.AI's API KEY, and deploy it yourself.

## ✨ About 302.AI ✨
[302.AI](https://302.ai) is a pay-as-you-go AI application platform, bridging the gap between AI capabilities and practical implementation.
1. 🧠 Comprehensive AI capabilities: Incorporates the latest in language, image, audio, and video models from leading AI brands.
2. 🚀 Advanced application development: We build genuine AI products, not just simple chatbots.
3. 💰 No monthly fees: All features are pay-per-use, fully accessible, ensuring low entry barriers with high potential.
4. 🛠 Powerful admin dashboard: Designed for teams and SMEs - managed by one, used by many.
5. 🔗 API access for all AI features: All tools are open-source and customizable (in progress).
6. 💡 Powerful development team: Launching 2-3 new applications weekly with daily product updates. Interested developers are welcome to contact us.

## Project Features
1. 🎥 Automatically generate video summaries, easily upload your video to complete.
2. 🌐 Support videos from multiple platforms: YouTube, TikTok, Bilibili, Douyin, MP4, etc.
3. 🌎 Supports subtitle translation: choose between Chinese, English, or Japanese.
4. 📄 Download various subtitle formats: supports VTT, SRT, TXT formats.
5. ✍️ Provides brief summary services for quick extraction of video highlights.
6. 📚 Offers detailed summary services for in-depth analysis of video content.
7. 🤖 AI Q&A interaction, intelligently answering video-related questions.
8. 🌏 Internationalization support: seamless switching between Chinese, English, and Japanese.
9. 🌙 Easily switch to dark mode for a more comfortable eye experience.
10. 🔗 Share summary feature, conveniently share wonderful content with friends.

With AI Audio and Video Summary, anyone can efficiently obtain video information! 🎉🎥 Let's explore the new world of AI-driven information acquisition together! 🌟🚀

## Tech Stack
- Next.js 14
- Tailwind CSS
- Shadcn UI
- markmap
- Vercel AI SDK

## Development & Deployment
1. Clone the project `git clone https://github.com/302ai/302_video_summary`
2. Install dependencies `pnpm install`
3. Configure the 302 API KEY as per .env.example
4. Run the project `pnpm dev`
5. Build and deploy `docker build -t video-summary . && docker run -p 3000:3000 video-summary`

## UI Preview
![Interface Preview](docs/preview.png)
