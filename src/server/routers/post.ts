import { router, publicProcedure } from "../trpc";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "~/server/prisma";

const defaultPostSelect = {
	id: true,
	title: true,
	text: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.PostSelect;

export const postRouter = router({
	list: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(),
			}),
		)
		.query(async ({ input }) => {
			const limit = input.limit ?? 50;
			const { cursor } = input;

			const items = await prisma.post.findMany({
				select: defaultPostSelect,
				take: limit + 1,
				where: {},
				cursor: cursor
					? {
							id: cursor,
						}
					: undefined,
				orderBy: {
					createdAt: "desc",
				},
			});
			let nextCursor: typeof cursor | undefined = undefined;
			if (items.length > limit) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const nextItem = items.pop()!;
				nextCursor = nextItem.id;
			}

			return {
				items: items.reverse(),
				nextCursor,
			};
		}),
	byId: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ input }) => {
			const { id } = input;
			const post = await prisma.post.findUnique({
				where: { id },
				select: defaultPostSelect,
			});
			if (!post) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `No post with id '${id}'`,
				});
			}
			return post;
		}),
	add: publicProcedure
		.input(
			z.object({
				id: z.string().uuid().optional(),
				title: z.string().min(1).max(32),
				text: z.string().min(1),
			}),
		)
		.mutation(async ({ input }) => {
			const post = await prisma.post.create({
				data: input,
				select: defaultPostSelect,
			});
			return post;
		}),
});
