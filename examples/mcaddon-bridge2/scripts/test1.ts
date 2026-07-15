// Connect to bridge1

import { connect, Packet, PacketData, PacketEvents } from "@lpsmods/mcaddon-bridge";
import { world } from "@minecraft/server";

function pingPong() {
  PacketEvents.receive.subscribe((event) => {
    if (event.id !== "ping") return;
    console.log("PING");
    event.response = "PONG";
  });
  Packet.sendSync("ping", new PacketData()).then((packet) => {
    console.log(packet.get("body"));
  });
}

world.afterEvents.worldLoad.subscribe(() => {
  // pingPong();
  connect("dev.lpsmods.example1").then(async (api) => {
    // console.warn(await api.get("integer"));
    // console.warn(await api.get("float"));
    // console.warn(await api.get("string"));
    // console.warn(await api.get("boolean"));

    // console.warn(await api.get("name"));
    // await api.set("name", "Bob");
    // console.warn(await api.get("name"));

    // console.warn(await api.get("fullName"));
    // await api.set("fullName", "Steve Black");
    // console.warn(await api.get("fullName"));

    // await api.call("greet", "Alex");

    const result = await api.call("sum", 1, 2);
    console.warn(result);
  });
});
