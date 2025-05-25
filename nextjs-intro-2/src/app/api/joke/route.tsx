//route.tsx
export async function GET() {
  return Response.json({
    id: 1,
    data: {
      content:
        "# Chuck Norris's show is called Walker: Texas Ranger, because Chuck Norris doesn't run.",
    },
  });
}
