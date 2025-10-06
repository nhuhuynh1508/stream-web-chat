## Objective
Build a messaging app inspired by popular chat platforms.

## UI
[![Screenshot-2025-10-06-115358.png](https://i.postimg.cc/tgCLGSsn/Screenshot-2025-10-06-115358.png)](https://postimg.cc/0zFtpCd9)
[![Screenshot-2025-10-06-144134.png](https://i.postimg.cc/x8NVxMn1/Screenshot-2025-10-06-144134.png)](https://postimg.cc/8fGYsF72)

For the inspiration, I'm taking the Messenger as an example and design a mock one using Figma.
[Figma Mock Design](https://www.figma.com/design/Is1S7ydQgnJtN1Z4q9jYZ9/Untitled?node-id=0-1&p=f&t=EY3HVWFb1IFRUj4n-0)

## Tech Stack
This project is built using:

- **Next.js** – React-based framework for the frontend (I'm using App Router for this project)
- **Tailwind CSS** – CSS framework for styling
- **shadcn/ui** - An UI components library ([shadcn/ui](https://ui.shadcn.com/))
- **Stream Chat** – API for handling real-time messaging ([getstream.io](https://getstream.io/))
- **Lucide** - An icon library
- **Dicebear** - An avatar library ([Dicebear](https://www.dicebear.com/))
- **Emoji Mart** - An emoji library ([Emoji Mart](https://github.com/missive/emoji-mart))
- [React Markdown Editor](https://uiwjs.github.io/react-md-editor/) - Support Markdown formatting in messsages (users can type in Markdown directly in the input or using the toolbar)
This editor allows user to include link and add images using URL Link, also allow to preview the text and image (only the URL image) before sending.
[On mobile, if the editor is too small to type, press [![Screenshot-2025-10-06-134002.png](https://i.postimg.cc/V6x1qJ1P/Screenshot-2025-10-06-134002.png)](https://postimg.cc/7GnpDYfK) for fullscreen.

## Setup
Install all of the dependencies:
`npm install`

Create a `.env.local` file in the root of the project and add the following:

NEXT_PUBLIC_STREAM_API_KEY=your_public_api_key_here
STREAM_API_SECRET=your_secret_api_key_here

These can be obtained from your Stream dashboard ([getstream.io](https://getstream.io/))

## How to Run
To run the repository, open the terminal (I'm using VS Code) and type:
`npm run dev -- -p <port_number>` (port number is optional)

To test the real time chat, open another terminal and run the code on another port

## Deployment
I'm using Vercel to deploy this project: [stream-web-chat.vercel.app](https://stream-web-chat.vercel.app/)

## Functionalities
This project supports the following features:
- **Real-Time Chat** — Instant messaging using Stream Chat API.
- **User Management** — Add, search, and remove users
- **Responsive Design** — Fully responsive layout for both desktop and mobile screens

To improve user experience, I also include these: 
- **Online Status Indicator** — Shows whether a user is online or offline and show their last active time
- **Search Functionality** — Find users using a search bar

If I have more time to include, these are the features I will work on:
- Create a backend to include authentication and user management
- Include push notifications and dark mode
- Improve the responsive design on mobile screen
- Improve the preview attachments before sending and include download or remove option (as for now, attached images aren't supported to show on screen yet)
- Allow user to see if the messages are being sent or seen by other users
