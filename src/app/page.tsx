"use client";

import { useState } from "react";
import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { useFetchVulnerability, calculateSummary } from "../hooks/handler";
import {
	VulnerabilityResultItem,
	FetchVulnerabilityReturn,
    InputFieldProps,
    CheckboxFieldProps,
    SummaryProps,
    SearchAndFilterProps
} from "../utils/types";

function Home() {
	const [targets, setTargets] = useState("");
	const [ports, setPorts] = useState("22");
	const [timeout, setTimeout] = useState(5);
	const [graceTimeCheck, setGraceTimeCheck] = useState("");
	const [useHelpRequest, setUseHelpRequest] = useState(false);
	const [dnsResolve, setDnsResolve] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("all");
	const {
		result,
		loading,
		error,
		fetchVulnerability,
	}: FetchVulnerabilityReturn = useFetchVulnerability({
		targets: targets.split("\n"),
		ports: ports.split(",").map(Number),
		timeout,
		graceTimeCheck,
		useHelpRequest,
		dnsResolve,
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await fetchVulnerability();
	};

	const data: VulnerabilityResultItem[] =
		result && result.length > 0 ? result[0].data : [];

	const filteredResults = data.filter((item) => {
		const matchesSearchTerm = [
			item.ip,
			item.port.toString(),
			item.status,
			item.message,
			item.hostname || "",
		].some((field) => field.includes(searchTerm));
		const matchesFilterType =
			filterType === "all" || item.status === filterType;
		return matchesSearchTerm && matchesFilterType;
	});

	const summary = calculateSummary(data || []);

	return (
		<div className="bg-custom-gray w-full min-h-screen p-8">
			<Header />
			<SocialLinks />
			<div className="bg-white p-8 rounded-3xl drop-shadow-2xl max-w-md mx-auto">
				<form onSubmit={handleSubmit} className="space-y-6">
					<InputField
						id="targets"
						label="Targets (IPs, Domains, or CIDR ranges)"
						value={targets}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setTargets(e.target.value)
						}
					/>
					<InputField
						id="ports"
						label="Ports (comma-separated):"
						value={ports}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setPorts(e.target.value)
						}
					/>
					<InputField
						id="timeout"
						label="Timeout:"
						type="number"
						value={timeout}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setTimeout(Number(e.target.value))
						}
					/>
					<CheckboxField
						label="Use HELP request"
						checked={useHelpRequest}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setUseHelpRequest(e.target.checked)
						}
					/>
					<CheckboxField
						label="Resolve DNS"
						checked={dnsResolve}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setDnsResolve(e.target.checked)
						}
					/>
					<div className="flex justify-center items-center">
						<button
							type="submit"
							className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
							disabled={loading}
						>
							{loading ? "Loading..." : "Check"}
						</button>
					</div>
				</form>
				{error && <p className="text-red-500 mt-4">{error}</p>}
				{data.length > 0 && (
					<div className="mt-4">
						<Summary summary={summary} />
						<SearchAndFilter
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							filterType={filterType}
							setFilterType={setFilterType}
						/>
						<div className="max-h-96 overflow-y-auto">
							{filteredResults.map((res, index) => (
								<ResultItem key={index} item={res} />
							))}
						</div>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
}

const Header = () => (
	<>
		<h1 className="text-3xl font-bold mb-2 text-center truncate bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
			Vulnerability Checker
		</h1>
		<h2 className="text-2xl font-bold mb-6 text-center truncate bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
			CVE-2024-6387
		</h2>
	</>
);

const SocialLinks = () => (
	<div className="flex justify-center space-x-4 mb-6">
		<Link
			href="https://github.com"
			target="_blank"
			rel="noopener noreferrer"
		>
			<FaGithub className="text-xl text-gray-700 hover:text-black transition duration-150 ease-in-out" />
		</Link>
		<Link
			href="https://discord.com"
			target="_blank"
			rel="noopener noreferrer"
		>
			<FaDiscord className="text-xl text-gray-700 hover:text-blue-600 transition duration-150 ease-in-out" />
		</Link>
		<Link
			href="https://twitter.com"
			target="_blank"
			rel="noopener noreferrer"
		>
			<FaTwitter className="text-xl text-gray-700 hover:text-blue-400 transition duration-150 ease-in-out" />
		</Link>
	</div>
);


const InputField: React.FC<InputFieldProps> = ({
	id,
	label,
	type = "text",
	value,
	onChange,
}) => (
	<div>
		<label
			htmlFor={id}
			className="block text-sm font-bold text-gray-700 mb-2"
		>
			{label}
		</label>
		<input
			id={id}
			type={type}
			value={value}
			onChange={onChange}
			className="border border-gray-300 p-2 w-full rounded-md focus:ring-blue-500 focus:border-blue-500"
		/>
	</div>
);

const CheckboxField: React.FC<CheckboxFieldProps> = ({
	label,
	checked,
	onChange,
}) => (
	<div className="flex items-center">
		<input
			id={label} // Tambahkan id di sini
			type="checkbox"
			checked={checked}
			onChange={onChange}
			className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
		/>
		<label
			htmlFor={label}
			className="ml-2 block text-sm text-gray-700 font-bold"
		>
			{label}
		</label>
	</div>
);


const Summary: React.FC<SummaryProps> = ({ summary }) => (
	<div className="mb-6 font-semibold bg-gray-50 p-4 rounded-2xl shadow-md">
		<p>Total Scanned: {summary.totalScanned}</p>
		<p>Closed: {summary.closed}</p>
		<p>Failed: {summary.failed}</p>
		<p>Unknown: {summary.unknown}</p>
		<p>Vulnerable: {summary.vulnerable}</p>
		<p>Not Vulnerable: {summary.notVulnerable}</p>
	</div>
);

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
	searchTerm,
	setSearchTerm,
	filterType,
	setFilterType,
}) => (
	<>
		<div className="mb-4">
			<input
				type="text"
				placeholder="Search..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="border border-gray-300 p-2 w-full rounded-md focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>
		<div className="mb-4">
			<label className="block text-sm font-bold text-gray-700 mb-2">
				Filter by Status
			</label>
			<select
				value={filterType}
				onChange={(e) => setFilterType(e.target.value)}
				className="border border-gray-300 p-2 w-full rounded-md focus:ring-blue-500 focus:border-blue-500"
			>
				<option value="all">All</option>
				<option value="open">Open</option>
				<option value="closed">Closed</option>
				<option value="failed">Failed</option>
				<option value="unknown">Unknown</option>
				<option value="vulnerable">Vulnerable</option>
				<option value="not_vulnerable">Not Vulnerable</option>
			</select>
		</div>
	</>
);

const ResultItem: React.FC<{ item: VulnerabilityResultItem }> = ({ item }) => (
	<div className="mb-4 p-4 bg-white shadow-md rounded-lg">
		<p>
			<strong>IP:</strong> {item.ip}
		</p>
		<p>
			<strong>Port:</strong> {item.port}
		</p>
		<p>
			<strong>Status:</strong> {item.status}
		</p>
		<p>
			<strong>Message:</strong> {item.message}
		</p>
		{item.hostname && (
			<p>
				<strong>Hostname:</strong> {item.hostname}
			</p>
		)}
	</div>
);

const Footer = () => (
	<div className="text-center mt-8 text-gray-600 text-sm">
		<p className="text-sm font-semibold mb-2">
			Created by
			<Link href="https://github.com/A3ST1CODE" className="text-bold text-blue-500 hover:underline">
				{" "}
				A3ST1CODE
			</Link>
		</p>
	</div>
);

export default Home;