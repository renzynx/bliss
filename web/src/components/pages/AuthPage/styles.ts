import { createStyles } from "@mantine/core";

export const signInStyles = createStyles((theme) => ({
	container: {
		borderRadius: theme.radius.sm,
		padding: theme.spacing.lg,
	},
	btn: {
		width: "100%",
		backgroundColor: " #8b5cf6",
		color: "white",
		"&:hover": {
			backgroundColor: "#7c3aed",
		},
		padding: "0.5rem 1.7rem",
		borderRadius: "0.5rem",
		display: "flex",
		justifyContent: "center",
		gap: "0.5rem",
		":disabled": {
			backgroundColor: "gray",
			cursor: "not-allowed",
		},
		textAlign: "center",
	},
}));
