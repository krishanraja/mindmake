import { blogPosts } from "@/data/blogPosts";
import { answers } from "@/lib/answers";
import { asQuestion } from "@/lib/answerFormat";
import { mergeIdeas } from "@/lib/ideaFormat";

/**
 * The one list `/blog` shows: every quick tip and every longer read, newest
 * first. `scripts/lib/ideas-loader.mjs` builds the same list for `llms.txt`
 * from the same two sources and the same merge.
 */
export const ideas = mergeIdeas(blogPosts, answers, asQuestion);

export type { Idea, IdeaKind, IdeaSubject } from "@/lib/ideaFormat";
