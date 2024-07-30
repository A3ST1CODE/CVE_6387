import { useState } from "react";
import {
	FetchVulnerabilityParams,
	FetchVulnerabilityResult,
	FetchVulnerabilityReturn,
	VulnerabilityResultItem,
	Summary,
} from "../utils/types";

export const useFetchVulnerability = (
	params: FetchVulnerabilityParams
): FetchVulnerabilityReturn => {
	const [result, setResult] = useState<FetchVulnerabilityResult[] | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchVulnerability = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch("/api/check-vulnerability", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(params),
			});
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data: FetchVulnerabilityResult[] = await response.json();
			setResult(data);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred");
			}
		} finally {
			setLoading(false);
		}
	};

	return { result, loading, error, fetchVulnerability };
};

export function calculateSummary(data: VulnerabilityResultItem[]): Summary {
    return {
        totalScanned: data.length,
        closed: data.filter((item) => item.status === "closed").length,
        failed: data.filter((item) => item.status === "failed").length,
        unknown: data.filter((item) => item.status === "unknown").length,
        vulnerable: data.filter((item) => item.status === "vulnerable").length,
        notVulnerable: data.filter((item) => item.status === "not_vulnerable").length,
    };
}