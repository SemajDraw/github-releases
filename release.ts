import { simpleGit } from "simple-git";
import yargs from "yargs"


/**
 * Setup steps
 * 1. Create an initial tag e.g. v0.0.0
 *  - git tag -a v0.0.0 -m Init
 *  - git push --tags
 */

/**
 * Tag Pattern
 * 
 * Examples: v1.0.10 | v1.0.10-beta | v1.0.10-alpha123 | v1.0.10-alpha.2
 */
const TagPattern = /^v(\d+)\.(\d+)\.(\d)+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+)?$/;

interface Argv {
    patch?: boolean;
    minor?: boolean;
    major?: boolean;
    alpha?: boolean;
    beta?: boolean;
}

// Consume command line args
const argv = yargs
    .option("patch", {
        alias: "p",
        description: "Patch version release",
        type: 'boolean',
        demandOption: false,
        default: false
    })
    .option("minor", {
        alias: "min",
        description: "Minor version release",
        type: 'boolean',
        demandOption: false,
        default: false
    })
    .option("major", {
        alias: "maj",
        description: "Major version release",
        type: 'boolean',
        demandOption: false,
        default: false
    })
    .option("alpha", {
        alias: "A",
        description: "Alpha version release",
        type: 'boolean',
        demandOption: false,
        default: false
    })
    .option("beta", {
        alias: "B",
        description: "Beta version release",
        type: 'boolean',
        demandOption: false,
        default: false
    })
    .check((argv) => {
        if (!argv.patch && !argv.minor && !argv.major) {
            throw new Error("Specify release type \nFor more information see --help");
        }
        return true;
    })
    .help()
    .alias("help", "h").argv as Argv;


const { patch, minor, major, alpha, beta } = argv


async function main() {
    const git = simpleGit();

    const { current } = await git.branch();
    if (current !== 'main') {
        console.log("Release must be created from main branch!");
        return;
    }

    console.log("Fetching remote...");
    await git.fetch();


    console.log("Retrieving latest tag...");
    const { latest } = await git.tags();

    if (!latest) throw new Error("Latest tag not found.");


    const matches = latest.match(TagPattern)

    if (!matches) throw new Error("Could not parse latest version number");

    let majorVersion = parseInt(matches[1], 10)
    let minorVersion = parseInt(matches[2], 10)
    let patchVersion = parseInt(matches[3], 10)

    if (major) majorVersion += 1
    if (minor) minorVersion += 1
    if (patch) patchVersion += 1

    const tag = `v${majorVersion}.${minorVersion}.${patchVersion}`

    if (!tag.match(TagPattern)) throw new Error(`Tag ${tag} is invalid!`);

    await git.addAnnotatedTag(tag, `Release ${tag}`)

    console.log(`Release tagged ${tag}`);
    console.log("Run 'git push --tags' to publish release")
}

main();
