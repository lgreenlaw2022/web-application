import PageHeader from "../components/PageHeader";
import Body from "../components/Body";

export default function ListsPage() {
    return (
        <div>
            <PageHeader />
            {user === undefined ?
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            :
                <>
                    {user === null ?
                        <p>User not found.</p>
                    :
                    <Body user_id={user.user_id} write={true}/>
                    }
                </>
            }
        </div>
    );
}
