# Next js intro -1

- React framework for building full-stack web applications, uses React Components to build user interfaces,
- Next.js provides you the following advantages over React
    1. Server side rendering - No SEO problems
    2. API routes - build both frontend and backend
    3. File based routing (no need for react-router-dom)
    4. Static site generation
    5. Maintained by the Vercel team
- Disadvantages -
    1. Can’t be distributed via a CDN, needs server to perform SSR (Expensive)
    2. Very opinionated, very hard to move out of it
- Create new project by running this command on terminal:

```bash
npx create-next-app@latest
```

- Next js has file based router. By default app dir represents “/” router. To create any other router create folder with any name and that name is your new route for ex. in app directory has directory named login so, route becomes “/login”.
- Every dir has page.tsx file that represent that route page. Also they layout file that used to make layout. In app directory layout file will include all it’s subfolder as it’s child. Same way if you want to add layout on specific routes only then create new folder and add layout.tsx file
- For ex. login and register has same layout then create new folder name auth add layout.tsx along with login and register dir. But here is the catch now your route for login and register is “./auth/login” and “./auth/register”.
- You can use create a new folder with `()` around the name. This folder is ignore by the router. For ex. in our case surround auth folder name with (auth). So now your route becomes “./login”.
- You should put your all components in a components dir use them in the app router rather than shoving everything in the route handler.
- Now adding onClick handler on button will throw error, because by default every page is render on server. To add interactivity on page mark you page at top with “use client”. So that component will (prerender) render on client.
- **When should you create `client components` ?**
    1. Whenever you get an error that tells you that you need to create a client component
    2. Whenever you’re using something that the server doesn’t understand (useEffect, useState, onClick…)
