'use client';

import { useAuctionStore } from "@/hooks/useAuctionStore";
import { useBidStore } from "@/hooks/useBidStore";
import { Auction, AuctionFinished, Bid } from "@/types";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef } from "react";
import AuctionCreatedToast from "../components/AuctionCreatedToast";
import toast from "react-hot-toast";
import { getDetailedViewData } from "../actions/auctionAction";
import AuctionFinishedToast from "../components/AuctionFinishedToast";
import { useSession } from "next-auth/react";

type Props = {
	children: React.ReactNode;
};

export default function SignalRProvider({ children }: Props) {
  const session = useSession();
  const user = session.data?.user;
  
	const connection = useRef<HubConnection | null>(null);
	const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
	const addBids = useBidStore((state) => state.addBid);
	const params = useParams<{ id: string }>();

  const handleAuctionFinished = useCallback((finishedAuction: AuctionFinished) => {
    const auction = getDetailedViewData(finishedAuction.auctionId);
    return toast.promise(auction, { 
      loading: 'Loading auction details',
      success: (auction) => <AuctionFinishedToast auction={auction} finishedAuction={finishedAuction} />,
      error: 'Error loading auction details'
     }, {success: {duration: 10000, icon: null}});
  }, [])

  const handleAuctionCreated = useCallback((auction: Auction) => {
    if(user?.username !== auction.seller) {
      return toast(<AuctionCreatedToast auction={auction}/>)
    }
  }, [user?.username])

  const handleBidPlaced = useCallback((bid: Bid) => {
    if(bid.bidStatus.includes("Accepted")) {
      setCurrentPrice(bid.auctionId, bid.amount);
    }
    if(params.id === bid.auctionId) {
      addBids(bid);
    }
  }, [setCurrentPrice, addBids, params.id]);

	useEffect(() => {
		if (!connection.current) {
			connection.current = new HubConnectionBuilder()
				.withUrl(process.env.NEXT_PUBLIC_NOTIFY_URL!)
				.withAutomaticReconnect()
				.build();

			connection.current
				.start()
				.then(() => console.log("SignalR Connected"))
				.catch((error) => console.log(error));

      connection.current.on('BidPlaced', handleBidPlaced);
      connection.current.on('AuctionCreated', handleAuctionCreated);
      connection.current.on('AuctionFinished', handleAuctionFinished);

      return () => {
        connection.current?.off('BidPlaced', handleBidPlaced);
        connection.current?.off('AuctionCreated', handleAuctionCreated);
        connection.current?.off('AuctionFinished', handleAuctionFinished);
      }
		}
	}, [setCurrentPrice, handleBidPlaced, handleAuctionCreated, handleAuctionFinished]);

	return children;
}
