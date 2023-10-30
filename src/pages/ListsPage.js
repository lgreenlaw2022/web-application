import PageHeader from "../components/PageHeader";
import Body from "../components/Body";
import { useUser } from "../contexts/UserProvider";
import { Link } from "react-router-dom";

export default function ListsPage() {
	// Get user from useUser hook
	const { user } = useUser();

	return (
		<div>
			<PageHeader />
			{user === undefined ? (
				<div className="spinner-border" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			) : (
				<>
					{/* reroute user to login page if none is signed */}
					{user === null ? (
						<p>
							User not found. <Link to="/login">Login</Link>
						</p>
					) : (
						<Body write={true} />
					)}
				</>
			)}
		</div>
	);
}
