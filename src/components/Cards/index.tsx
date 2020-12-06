import Card from "@components/Card/index";
import { FC } from "react";

export interface ICards {
	paste: {
		id: string;
		title: string;
		description?: string;
		[key: string]: unknown;
	}[];
}

const Cards: FC<ICards> = ({ paste }) => {
	return (
		<div className="mt-6">
			<p className="mb-6 text-2xl text-black">Your files</p>
			<div className="grid grid-cols-2 grid-rows-1 gap-4 mb-6 lg:grid-cols-6">
				{paste.map((i, idx) => (
					<Card
						key={idx}
						name={i.title}
						link={`/explore?id=${encodeURIComponent(i.id)}`}
					/>
				))}
			</div>
		</div>
	);
};

export default Cards;
