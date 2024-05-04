/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as trpcNext from "@trpc/server/adapters/next";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
	// session: Session | null
}

export async function createContextInner(_opts: CreateContextOptions) {
	return {};
}

export type Context = Awaited<ReturnType<typeof createContextInner>>;

export async function createContext(
	opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
	return await createContextInner({});
}
