"use client";

export default function Members({
  roomMembers,
}: {
  roomMembers: { room: string; name: string; userId: string }[];
}) {
  if (roomMembers.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center border-t-4 border-black">
        <div className="text-gray-700 italic font-semibold">
          No one’s here... yet 👻
        </div>
      </div>
    );
  }
  const room = roomMembers[0]?.room ?? "";
  const handleCopy = () => {
    navigator.clipboard.writeText(room);
  };

  return (
    <div className="w-full h-full flex flex-col border-t-4 border-black">
      {/* --- Top Room Info Bar --- */}
      <div className="flex items-center justify-between bg-yellow-300 border-b-4 border-black p-4 shadow-[3px_3px_0px_#000]">
        <div className="flex flex-col text-left">
          <h2 className="text-xl font-extrabold text-black drop-shadow-[2px_2px_0px_#fff]">
            🏠 Room: {room}
          </h2>
          <p className="text-sm font-semibold text-gray-700">
            Share this with your friends to join!
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="bg-pink-500 text-white font-bold px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
        >
          🔗
        </button>
      </div>

      {/* --- Members List --- */}
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="flex flex-col gap-3">
          {roomMembers.map((member, index) => (
            <li
              key={member.userId}
              className={`flex items-center gap-3 ${
                index % 2 === 0 ? "bg-yellow-300" : "bg-yellow-200"
              } border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_#000]`}
            >
              <div className="w-10 h-10 bg-pink-400 border-2 border-black rounded-full flex items-center justify-center font-bold text-white">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-black">{member.name}</span>
                <span className="text-xs text-gray-600">
                  ID: {member.userId.slice(0, 6)}...
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
