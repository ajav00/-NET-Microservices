import { Auction, AuctionFinished } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { numberWithCommas } from '../lib/numberWithComma';

type Props = {
  finishedAuction: AuctionFinished;
	auction: Auction;
};

export default function AuctionFinishedToast({ auction, finishedAuction }: Props) {
	return (
		<Link
			href={`/auctions/details/${auction.id}`}
			className="flex flex-col items-center"
		>
			<div className="flex flex-row items-center gap-2">
				<Image
					src={auction.imageUrl}
					alt={`Image of ${auction.make} ${auction.model}`}
					height={80}
					width={80}
          className="rounded-lg w-auto h-auto"
				></Image>
        <div className="flex flex-col">
          <span>Auction for {auction.make} {auction.model} has ended</span>
          {
            finishedAuction.itemSold && finishedAuction.amount ? (
              <p>Congrats to {finishedAuction.winner} for winning $${numberWithCommas(finishedAuction.amount)}</p>
            ): (
              <p>This item was not sold</p>
            )
          }
        </div>
			</div>
		</Link>
	);
}
