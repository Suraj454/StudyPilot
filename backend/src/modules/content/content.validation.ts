
import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import { TopicSchema } from "./content.schema";

async function validateTopic() {
  const filePath =
    "content/javascript-react/topics/01-scope-hoisting-closures.yaml";

  const fileContent = await readFile(filePath, "utf-8");
  const parsedContent: unknown = parse(fileContent);

  const result = TopicSchema.safeParse(parsedContent);

  if (!result.success) {
    console.error("Topic validation failed:");
    console.error(result.error.format());
    process.exitCode = 1;
    return;
  }

  console.log("Topic validation successful!");
  console.log("Topic:", result.data.title);
}

validateTopic().catch((error: unknown) => {
  console.error("Unable to read or validate topic:", error);
  process.exitCode = 1;
});
