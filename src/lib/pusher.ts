import Pusher from "pusher-js";

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || "your_pusher_key";
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

let pusherClient: Pusher | null = null;

function buildAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function getPusherClient(): Pusher | null {
  if (typeof window === "undefined") return null;
  if (!pusherKey || pusherKey === "your_pusher_key" || !apiUrl) return null;
  if (pusherClient) return pusherClient;

  pusherClient = new Pusher(pusherKey, {
    cluster: pusherCluster,
    forceTLS: true,
    authorizer: (channel: any) => ({
      authorize: (
        socketId: string,
        callback: (error: Error | null, data: any) => void,
      ) => {
        fetch(`${apiUrl}/pusher/auth`, {
          method: "POST",
          headers: buildAuthHeaders(),
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then(async (res) => {
            if (!res.ok) {
              throw new Error(`Pusher auth failed with status ${res.status}`);
            }
            return res.json();
          })
          .then((data) => callback(null, data))
          .catch((err: unknown) => {
            const error =
              err instanceof Error ? err : new Error("Pusher auth failed");
            callback(error, null);
          });
      },
    }),
  });

  return pusherClient;
}
