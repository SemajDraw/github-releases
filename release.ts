import { simpleGit, SimpleGit, SimpleGitOptions } from "simple-git";
import { format } from "date-fns";

/**
 * Tag Pattern
 * 
 * Examples: v1.0.10 | v1.0.10-beta | v1.0.10-alpha123 | v1.0.10-alpha.2
 */
const TagPattern = /^v\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+)?$/;


async function main() {
    const git = simpleGit();

    const { current } = await git.branch();
    if (current !== 'main') {
        console.log("Create release from main branch!");
        return;
    }

    console.log("Fetching remote...");
    await git.fetch();


    console.log("Retrieving tags...");

    const { all: tags } = await git.tags();

    console.log(tags)

    console.log("Tagged main <tag> and released!");
}

main();
