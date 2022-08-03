const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2), {
  string: ["input", "output"],
  alias: {
    i: "input",
    o: "output",
  },
});

if (!argv.input || !argv.output) {
  console.error(
    "Usage: node parser.js -i|--input <input_file> -o|--output <output_file>"
  );
  process.exit(1);
}

if (!fs.existsSync(argv.input)) {
  console.error(`File not found: ${argv.input}`);
  process.exit(1);
}

const contents = fs.readFileSync(argv.input).toString();
const lines = contents.split("\n");
const title = lines[0];
const times = lines.slice(1);

const obj = { name: title, departures: [] };
for (const time of times) {
  const t = time.trim();
  const colonIndex = t.indexOf(":");
  const spaceIndex = t.indexOf(" ");
  let hour = parseInt(t.substring(0, colonIndex));
  const minute = parseInt(t.substring(colonIndex + 1, spaceIndex));
  const modifier = t.substring(spaceIndex + 1);
  if (modifier === "AM") {
    if (hour === 12) {
      hour = 0;
    } else {
      // No adjustment
    }
  } else if (modifier === "PM") {
    if (hour === 12) {
      // No adjustment
    } else {
      hour += 12;
    }
  } else {
    console.error(`Invalid modifier ${modifier}`);
    process.exit(1);
  }
  obj.departures.push({ hour: hour, minute: minute });
}

fs.writeFileSync(argv.output, JSON.stringify(obj));
console.log(`Successfully wrote to ${argv.output}`);
