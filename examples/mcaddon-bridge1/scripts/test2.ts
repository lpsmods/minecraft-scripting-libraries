// Connect to bridge2

import { connect } from "@lpsmods/mcaddon-bridge";
import { world } from "@minecraft/server";

world.afterEvents.worldLoad.subscribe(() => {
  //   connect("com.example").then((api) => {
  //     console.log("Connected missing!");
  //   });
  connect("dev.lpsmods.example2").then(async (api) => {
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

    const result = await api.call("mul", 1, 2);
    console.warn(result);
  });
});
