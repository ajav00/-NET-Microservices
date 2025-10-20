import { useController, UseControllerProps } from "react-hook-form";

type Props = {
	label: string;
	type?: string;
	showLabel?: string;
} & UseControllerProps;

import React from "react";
import { HelperText, Label, TextInput } from "flowbite-react";

export default function Input(props: Props) {
	const { field, fieldState } = useController({ ...props });
	return (
		<div className="mb-3 block">
			{props.showLabel && (
				<div className="mb-2 block">
					<Label htmlFor="{field.name}">{props.label}</Label>
				</div>
			)}
			<TextInput
				{...field}
				{...props}
				value={field.value || ""}
				type={props.type || "text"}
				placeholder="{props.label}"
				color={
					fieldState.error ? "failure" : !fieldState.isDirty ? "" : "success"
				}
			/>
			<HelperText color="failure">
				{fieldState.error?.message as string}
			</HelperText>
		</div>
	);
}
