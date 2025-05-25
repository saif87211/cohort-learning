# Next js intro -2 (Backend side)


### 📝 Table of Contents

 - [Benefits of both frontend and backend in next js:](#benefits-of-both-frontend-and-backend-in-next-js)
 - [Data fetching in next](#data-fetching-in-next)
 - [Loaders in next](#loaders-in-next)
 - [Api Routes in next](#api-routes-in-next)
 - [Better fetch](#better-fetch)
 - [Singleton Prisma](#singleton-prisma)
 - [Server action](#server-action)

### Benefits of both frontend and backend in next js:
- In single code base we can add both frontend & backend
- No cors issue, entire application will be hosted on single domain
- Ease of deployment
- In react we face the water fall problem. (For ex. blog website shown below)
    1. Browser send req to server (ex. www.somewebiste.com/blogs)
    2. sever returns empty html
    3. Browser parse html and comes to script tag then again send req to server for js file
    4. Server return js file and again sends req to fetch data for blogs

### Data fetching in next

- Let’s suppose our backend is somewhere else deployed. So how can we use that?
- In next js m we do data fetching at the server side. On server side we fetched the data and prerender page before returning it to the browser.
- For ex. as you can see in page.tsx made the simple asyn function to fetch user details.

```jsx
//app/page.tsx
async function getJoke() {
  try {
    const response = await fetch(
      "https://api.freeapi.app/api/v1/public/randomjokes/100"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
```

- Now thing is to convert our page export function to async function. (not possible in react). Call the function and render it’s details.

```jsx
//app/page.tsx
export default async function Home() {
  const jokeData = await getJoke();

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="text-2xl text-slate-500">{jokeData.data.content}</div>
    </div>
  );
}
```

### Loaders in next

- Next thing is to add loader when the page was loading. So in order to show loader when the page was loading(slow backend or data fetch take time), we need to add file called loader.tsx in the app dir. (For subsequent routes process will be same, for ex if you add another dir name user in app then route becomes “domain/user”, so to add loader simply add loading.tsx file in it.)
- In next js this is called as streaming. On server when the data is being fetched, next js will stream the loading state while page being rendered.

```jsx
//loading.tsx
export default function Loading() {
  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center text-lg text-slate-300">Loading...</div>
    </div>
  );
}
```

### Api Routes in next

- Next js allows us create frontend as well as backend in single codebase. Just like express we can also add routes as well.
- To create route create dir name “api” in app dir. Add another dir called “joke” in it. Add file route.ts. This page will be have all the code to handle request as well response.  Now our api routes will be “http://localhost:3000/api/joke”.
- Now to handle HTTP `GET`  request we need to create GET function as shown below. We have also return the response by using our next `Response` object.

```tsx
//route.tsx
export async function GET() {
  return Response.json({
    id: 1,
    data: {
      content: "# Chuck Norris's show is called Walker: Texas Ranger, because Chuck Norris doesn't run.",
    },
  });
}

```

- All you need to change the url of the our home page that was used to fetch the jokes(other backend). (This isn’t the best way, we will see next serer action).

```tsx
//page.tsx
async function getJoke() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/joke"
    );
    const data = await response.json();
    await delay(5000); // artificial delay for 5sec
    return data;
  } catch (error) {
    console.log(error);
  }
}
```

- Similarly you can use POST method to handle incoming http post req. As you can see to grab data from incoming req we can use next `NextRequest` object whihc we accept as the argument of http Post method.

```tsx
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();

    return NextResponse.json({ username: body.username, password: body.password })
}
```

- Working demo with prisma & postgres

```tsx
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  // should add zod validation here
  const user = await prisma.user.create({
    data: {
      username: body.username,
      password: body.password,
    },
  });

  console.log(user.id);

  return NextResponse.json({ message: "Signed up" });
}

export async function GET() {
  const user = await prisma.user.findFirst({});
  return Response.json({ name: user?.username, email: user?.username });
}
```

### Better fetch

- Previously to get the joke data we make request to our own server. Since the we have feature of Server sider render we can do that better way. Instead of joke lets render user details in the page.
- We can directly make the db req and render that result on the page. Here is the ex.

```tsx
//user/page.tsx
import { PrismaClient } from "@/generated/prisma/client";
const client = new PrismaClient();

async function getUserDetails() {
  try {
    const user = await client.user.findFirst({});
    return {
      name: user?.username,
      email: user?.username,
    };
  } catch (e) {
    console.log(e);
  }
}

export default async function Home() {
  const userData = await getUserDetails();

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center">
        <div className="border p-8 rounded">
          <div>Name: {userData?.name}</div>
          {userData?.email}
        </div>
      </div>
    </div>
  );
}
```

### Singleton Prisma

- Whenever we developing next js application, saving change will compile that application. The problem is on that every changes new next js prisma client instance was created. This leads to creation of multiple prisma clients , which consume more resource and cause unexpected behavior.
- To solve this problem we create single instance of prisma client instance.

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

//db.tsx
import client from "@/db"
```

### Server Action

- We have create post api end point to handle incoming post req. Bu next js take this also to next level by server action.
- Server action are async functions that are executed on server. They can be called in server and client component to handle form submission.
- To make server action function create dir name “action” in “app”  dir. Create file user.tsx. Now all you have make function that take username and password as args, save to db and return some response.
- We denote any funtion as server action by declration at top “user server”

```tsx
"use server";

import client from "@/db";

export async function signup(username: string, password: string) {
  // should add zod validation here
  const user = await client.user.create({
    data: {
      username: username,
      password: password,
    },
  });

  console.log(user.id);

  return "Signed up!";
}
```

- Now in sign up simply called that function whenever user submit the form.

```tsx
"use client";
import { signup } from "@/app/action/user";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const response = await signup(username, password);
    console.log(response);
    localStorage.setItem("token", response);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
          <input value={username} type="text" placeholder="Username" 
          onChange={(e) => setUsername(e.target.value)} 
          className="border-2 rounded-lg w-full h-12 px-4"/>
          <br/>
          <input value={password} type="text" placeholder="password" 
          onChange={(e) => setPassword(e.target.value)} 
          className="border-2 rounded-lg w-full h-12 px-4"/>
          <br/>
          <button className="bg-red-400 text-white rounded-md hover:bg-red-500 font-semibold px-4 py-3 w-full" onClick={handleSignUp}>Signup</button>
    </div>
  );
}
```