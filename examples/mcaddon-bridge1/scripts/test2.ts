// Exercise every public channel from bridge1 against bridge2.
import { BridgeRemoteError, BridgeVersionError, connect, Packet, PacketEvents } from "@lpsmods/mcaddon-bridge";
import { system, world } from "@minecraft/server";

const REMOTE_ID = "dev.lpsmods.example2";

function assertEqual<T>(actual: T, expected: T, channel: string): void {
  if (actual !== expected) throw new Error(`${channel}: expected ${String(expected)}, got ${String(actual)}`);
}

async function assertRemoteError(action: () => Promise<unknown>, message: string, channel: string): Promise<void> {
  try {
    await action();
  } catch (err) {
    if (err instanceof BridgeRemoteError && err.message.includes(message)) return;
    throw new Error(`${channel}: unexpected error: ${String(err)}`);
  }
  throw new Error(`${channel}: expected a remote error`);
}

function waitTicks(ticks: number): Promise<void> {
  return new Promise((resolve) => system.runTimeout(resolve, ticks));
}

PacketEvents.receive.subscribe((event) => {
  if (event.packet.channel !== "integration" || event.packet.target !== "example1") return;
  event.response = { source: "example1", value: event.packet.value };
});

async function run(): Promise<void> {
  const api = await connect(REMOTE_ID, { version: "^1.0.0", timeoutTicks: 100 });
  assertEqual(api.isConnected, true, "connect state");
  assertEqual(api.remoteVersion, "1.0.0", "version negotiation");

  assertEqual(await api.get<number>("integer"), 1, "get integer");
  assertEqual(await api.get<number>("float"), 0.5, "get float");
  assertEqual(await api.get<string>("string"), "Hello, World!", "get string");
  assertEqual(await api.get<boolean>("boolean"), true, "get boolean");

  assertEqual(await api.has("name"), true, "has existing");
  assertEqual(await api.has("missing"), false, "has missing");

  await api.set("name", "Alex2");
  assertEqual(await api.get<string>("name"), "Alex2", "set writable value");
  await api.set("fullName", "Alex ExampleTwo");
  assertEqual(await api.get<string>("fullName"), "Alex ExampleTwo", "setter/getter");
  await assertRemoteError(() => api.set("integer", 9), "not writable", "readonly rejection");

  assertEqual(await api.call<number>("mul", 6, 7), 42, "sync call");
  assertEqual(await api.call<string>("greet", "Alex"), "Hello, Alex, from example2!", "string call");
  assertEqual(await api.call<string>("asyncEcho", "ping"), "example2:ping", "async call");
  await assertRemoteError(() => api.call("fail"), "intentional failure", "thrown call");
  await assertRemoteError(() => api.get("missing"), "not found", "missing property");

  try {
    await connect(REMOTE_ID, { version: "^2.0.0", timeoutTicks: 100 });
    throw new Error("version mismatch: expected rejection");
  } catch (err) {
    if (!(err instanceof BridgeVersionError)) throw err;
  }

  const packet = await Packet.sendSync<{ source: string; value: number }>(
    "example1:integration",
    { channel: "integration", target: "example2", value: 21 },
    { timeoutTicks: 100 },
  );
  assertEqual(packet.source, "example2", "packet response source");
  assertEqual(packet.value, 21, "packet response value");

  // Stagger the two UI requests so both packs can exercise the docs channel.
  await waitTicks(20);
  const player = world.getAllPlayers()[0];
  if (player) await api.docs(player);

  api.disconnect();
  assertEqual(api.isConnected, false, "disconnect state");
  console.log(`Test2 passed all channels${player ? "" : " (docs skipped: no player)"}!`);
}

world.afterEvents.worldLoad.subscribe(() => {
  run().catch((err) => console.error(`Test2 failed: ${String(err)}`));
});
