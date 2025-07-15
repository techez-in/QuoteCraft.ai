# **App Name**: QuoteCraft AI

## Core Features:

- Input Form: A clean, intuitive form for users to input client, project, and service details.
- AI-Powered Quote Generation: Generative AI integration to produce a customized draft quote based on the details the user enters. The LLM will use the user details to decide which pieces of information it will include from the provided instructions to form its output; the business rules around quotation contents acts as a tool.
- Rich-Text Editor Integration: Display Gemini's response in a rich-text editor, allowing users to easily edit and refine the content.
- PDF Export: Enable users to download the customized quotation as a professional PDF document, complete with styling and formatting.
- Manage state of inputs: Simple state management to handle the data throughout the whole quotation process. Using only front-end storage of this temporary data.
- Loading state: Add loading indicators while awaiting AI response to show app is not broken.
- Dark mode toggle: Add toggle to switch between light and dark mode to improve user experience based on environment or taste.

## Style Guidelines:

- Primary color: Deep blue (#2E3192) to convey professionalism and trust.
- Background color: Light gray (#F5F7FA) for a clean and modern feel.
- Accent color: Teal (#008080) to add a touch of creativity and highlight important elements.
- Body font: 'Inter' (sans-serif) for clear, readable text. 
- Headline font: 'Space Grotesk' (sans-serif) for impactful headings, with 'Inter' for body.
- Use minimalist icons to represent different sections of the quotation and download options.
- Implement a responsive layout using Tailwind CSS for seamless use across devices.