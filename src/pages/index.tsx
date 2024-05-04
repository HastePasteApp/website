import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";
import type { inferProcedureInput } from "@trpc/server";
import Link from "next/link";
import { Fragment } from "react";
import type { AppRouter } from "~/server/routers/_app";

const IndexPage: NextPageWithLayout = () => {
	const utils = trpc.useUtils();
	const postsQuery = trpc.post.list.useInfiniteQuery(
		{
			limit: 5,
		},
		{
			getNextPageParam(lastPage) {
				return lastPage.nextCursor;
			},
		},
	);

	const addPost = trpc.post.add.useMutation({
		async onSuccess() {
			await utils.post.list.invalidate();
		},
	});

	return (
		<div className="flex flex-col bg-gray-800 py-8">
			<h1 className="text-4xl font-bold">
				Welcome to your tRPC with Prisma starter!
			</h1>
			<p className="text-gray-400">
				If you get stuck, check{" "}
				<Link className="underline" href="https://trpc.io">
					the docs
				</Link>
				, write a message in our{" "}
				<Link className="underline" href="https://trpc.io/discord">
					Discord-channel
				</Link>
				, or write a message in{" "}
				<Link
					className="underline"
					href="https://github.com/trpc/trpc/discussions"
				>
					GitHub Discussions
				</Link>
				.
			</p>

			<div className="flex flex-col py-8 items-start gap-y-2">
				<div className="flex flex-col"></div>
				<h2 className="text-3xl font-semibold">
					Latest Posts
					{postsQuery.status === "pending" && "(loading)"}
				</h2>

				<button
					className="bg-gray-900 p-2 rounded-md font-semibold disabled:bg-gray-700 disabled:text-gray-400"
					onClick={() => postsQuery.fetchNextPage()}
					disabled={
						!postsQuery.hasNextPage || postsQuery.isFetchingNextPage
					}
				>
					{postsQuery.isFetchingNextPage
						? "Loading more..."
						: postsQuery.hasNextPage
							? "Load More"
							: "Nothing more to load"}
				</button>

				{postsQuery.data?.pages.map((page, index) => (
					<Fragment key={page.items[0]?.id || index}>
						{page.items.map((item) => (
							<article key={item.id}>
								<h3 className="text-2xl font-semibold">
									{item.title}
								</h3>
								<Link
									className="text-gray-400"
									href={`/post/${item.id}`}
								>
									View more
								</Link>
							</article>
						))}
					</Fragment>
				))}
			</div>

			<hr />

			<div className="flex flex-col py-8 items-center">
				<h2 className="text-3xl font-semibold pb-2">Add a Post</h2>

				<form
					className="py-2 w-4/6"
					onSubmit={async (e) => {
						e.preventDefault();
						const $form = e.currentTarget;
						const values = Object.fromEntries(new FormData($form));
						type Input = inferProcedureInput<
							AppRouter["post"]["add"]
						>;
						const input: Input = {
							title: values.title as string,
							text: values.text as string,
						};
						try {
							await addPost.mutateAsync(input);

							$form.reset();
						} catch (cause) {
							console.error({ cause }, "Failed to add post");
						}
					}}
				>
					<div className="flex flex-col gap-y-4 font-semibold">
						<input
							className="focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
							id="title"
							name="title"
							type="text"
							placeholder="Title"
							disabled={addPost.isPending}
						/>
						<textarea
							className="resize-none focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
							id="text"
							name="text"
							placeholder="Text"
							disabled={addPost.isPending}
							rows={6}
						/>

						<div className="flex justify-center">
							<input
								className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
								type="submit"
								disabled={addPost.isPending}
							/>
							{addPost.error && (
								<p style={{ color: "red" }}>
									{addPost.error.message}
								</p>
							)}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default IndexPage;
