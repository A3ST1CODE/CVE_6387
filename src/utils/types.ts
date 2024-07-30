export interface VulnerabilityResultItem {
	ip: string;
	port: number;
	status: string;
	message: string;
	hostname?: string;
}

export interface FetchVulnerabilityParams {
	targets: string[];
	ports: number[];
	timeout: number;
	graceTimeCheck: string;
	useHelpRequest: boolean;
	dnsResolve: boolean;
}

export interface FetchVulnerabilityReturn {
	result: FetchVulnerabilityResult[] | null;
	loading: boolean;
	error: string | null;
	fetchVulnerability: () => Promise<void>;
}

export interface FetchVulnerabilityResult {
	id: string;
	status: "closed" | "failed" | "unknown" | "vulnerable" | "not_vulnerable";
	data: VulnerabilityResultItem[];
}

export interface Summary {
	totalScanned: number;
	closed: number;
	failed: number;
	unknown: number;
	vulnerable: number;
	notVulnerable: number;
}

export interface InputFieldProps {
	id: string;
	label: string;
	type?: string;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CheckboxFieldProps {
	label: string;
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SummaryProps {
	summary: {
		totalScanned: number;
		closed: number;
		failed: number;
		unknown: number;
		vulnerable: number;
		notVulnerable: number;
	};
}

export interface SearchAndFilterProps {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	filterType: string;
	setFilterType: React.Dispatch<React.SetStateAction<string>>;
}