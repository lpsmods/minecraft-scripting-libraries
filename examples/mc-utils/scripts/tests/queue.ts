import { Queue } from "@lpsmods/mc-utils";
import { UnitTestMap } from "@lpsmods/mc-utils";

const queue = new Queue<string>();
queue.run(function* (job) {
  // Process item.
  console.warn(job.item);

  // Mark as complete.
  job.queue.done();
});

export default (units: UnitTestMap) => {
  units.set("queue", (ctx, message) => {
    queue.put(message ?? "apple");
  });
};
