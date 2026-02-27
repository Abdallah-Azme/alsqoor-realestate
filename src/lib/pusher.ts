import Pusher from "pusher-js";

// These values should ideally come from env variables
// If they are missing, the component should handle it gracefully or use defaults for development
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || "your_pusher_key";
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1";

export const pusher = new Pusher(pusherKey, {
  cluster: pusherCluster,
  forceTLS: true,
  authorizer: (channel: any) => {
    return {
      authorize: (
        socketId: string,
        callback: (error: any, data: any) => void,
      ) => {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/pusher/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            callback(null, data);
          })
          .catch((err) => {
            callback(err, null);
          });
      },
    };
  },
});
