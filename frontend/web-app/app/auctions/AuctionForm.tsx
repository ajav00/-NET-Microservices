"use client";

import { Button, Spinner } from "flowbite-react";
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import Input from "../components/Input";
import DateInput from "../components/DateInput";
import { createAuction, updateAuction } from "../actions/auctionAction";
import toast from "react-hot-toast";
import { Auction } from "@/types";

type Props = {
	auction?: Auction
};

export default function AuctionForm({auction}: Props) {
	const router = useRouter();
	const pathname = usePathname();

	const {
		control,
		handleSubmit,
		setFocus,
		reset,
		formState: { isSubmitting, isValid, isDirty },
	} = useForm({
    mode: "onTouched",
  });

	useEffect(() => {
		if(auction){
			const {make, model, color, year, imageUrl, auctionEnd} = auction;
			reset({make, model, color, year, imageUrl, auctionEnd});
		}
		setFocus("make");
	}, [setFocus, auction, reset]);

	async function onSubmit(data: FieldValues) {
		try {
			let id = '';
			let res;
			if(pathname === '/auctions/create'){
				res = await createAuction(data);
				id = res.id;
			}
			else{
				if(auction){
					res = await updateAuction(id, data);
					id = res.id;
				}
			}
			if(res.error){
				throw res.error;
			}
			router.push(`/auctions/details/${res.id}`);
		} catch (error: unknown) {
			const errorMessage = error && typeof error === 'object' && 'message' in error 
				? (error as {status: number, message: string}).message 
				: 'An error occurred';
			const errorStatus = error && typeof error === 'object' && 'status' in error 
				? (error as {status: number, message: string}).status 
				: 'Unknown';
			toast.error(errorStatus + ": " + errorMessage);
		}
	}

	return (
		<form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
			<Input
				label="Make"
				name="make"
				control={control}
				rules={{ required: "Make is required" }}
			/>
			<Input
				label="Model"
				name="model"
				control={control}
				rules={{ required: "Model is required" }}
			/>
			<Input
				label="Color"
				name="color"
				control={control}
				rules={{ required: "Color is required" }}
			/>

			<div className="grid grid-cols-2 gap-3">
				<Input
					label="Year"
					name="year"
          type="number"
					control={control}
					rules={{ required: "Year is required" }}
				/>
				<Input
					label="Mileage"
					name="mileage"
          type="number"
					control={control}
					rules={{ required: "Mileage is required" }}
				/>
			</div>
			{
				pathname === '/auctions/create' && 
				<>
					<Input
						label="Image"
						name="image"
						control={control}
						rules={{ required: "Image is required" }}
					/>
					<div className="grid grid-cols-2 gap-3">
						<Input
							label="Reserve price (enter 0 for no reserve)"
							name="reservePrice"
							type="number"
							control={control}
							rules={{ required: "Reserve price is required" }}
						/>
						<DateInput
							name="auctionEnd"
							label="Auction end date"
							control={control}
							showTimeSelect
							dateFormat='dd MMMM yyyy h:mm aa'
							rules={{ required: "Auction end date is required" }}
						/>
					</div>
				</>
			}
			

			<div className="flex justify-between">
				<Button outline color="alternative" onClick={() => router.push("/")}>
					Cancel
				</Button>
				<Button
					outline
					color="green"
					disabled={!isValid || !isDirty || isSubmitting}
					type="submit"
				>
					{isSubmitting && <Spinner size="sm1" />}
					Submit
				</Button>
			</div>
		</form>
	);
}
