function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJoke() {
  try {
    const response = await fetch("http://localhost:3000/api/joke");
    const data = await response.json();
    await delay(5000); // artificial delay for 5sec
    return data;
  } catch (error) {
    console.log(error);
  }
}

export default async function Home() {
  const jokeData = await getJoke();

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="text-2xl text-slate-500">{jokeData.data.content}</div>
    </div>
  );
}
