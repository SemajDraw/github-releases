import { simpleGit, SimpleGit, SimpleGitOptions } from "simple-git";
import { format } from "date-fns";

/**
 * Tag Pattern
 * 
 * Examples: v1.0.10 | v1.0.10-beta | v1.0.10-alpha123 | v1.0.10-alpha.2
 */
const TagPattern = /^v\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+)?$/;

const INITIAL_RELEASE = 'v0.0.1'

type LatestTag = { name: string | null, suffix: number };

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
    // const latestTag: LatestTag = tags
    //     .flatMap((tag) => {
    //         const match = tag.match(TagPattern);
    //         if (match && match.groups && tag.startsWith(baseTagName)) {
    //             return [{ name: tag, suffix: match.groups.suffix.charCodeAt(0) }];
    //         } else {
    //             return [];
    //         }
    //     })
    //     .reduce(
    //         (max: LatestTag, cur: LatestTag): LatestTag => cur.suffix > max.suffix ? cur : max,
    //         { name: null, suffix: 0 }
    //     );

    // let nextSuffix = "a";
    // if (!latestTag.name) {
    //     console.log("First release of the week");
    // } else {
    //     console.log(`Last release this week: ${latestTag.name}`);
    //     if (latestTag.suffix >= codeZ) {
    //         console.log('ERROR: Suffix "z" reached. Aborting.')
    //         return;
    //     }

    //     nextSuffix = String.fromCharCode(latestTag.suffix + 1);
    // }

    // const tagName = `${baseTagName}${nextSuffix}`;
    // console.log(`Next release: ${tagName}`);

    // await git.addAnnotatedTag(tagName, `Release ${year}w${week}${nextSuffix}`);

    console.log("Release tagged!");
    console.log("Run 'git push --tags' to finalize");
}

main();
