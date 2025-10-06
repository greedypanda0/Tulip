import RoomPage from "@/feature/room/room-page";
export default async function Room({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const { room } = await params;

  return <RoomPage room={room} />;
}
