import { BsShieldLock } from "react-icons/bs";
import { useAuth } from "../hooks/useAuth";
import AdminLogin from "./AdminLogin";
import Loader from "./Loader";

// This guard is a convenience, not the security boundary. Write access is
// enforced by the RLS policies in supabase/migrations/001_secure_admin_writes.sql,
// so bypassing this component in the browser still gets you nothing.
const RequireAdmin = ({ children }) => {
  const { loading, session, isAdmin, signOut } = useAuth();

  if (loading) return <Loader />;
  if (!session) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4">
        <div
          className="w-14 h-14 flex items-center justify-center rounded-glass-sm"
          style={{
            background: "color-mix(in srgb, var(--color-danger) 14%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-danger) 40%, transparent)",
          }}
        >
          <BsShieldLock className="text-danger text-xl" />
        </div>
        <h2 className="font-bold text-base text-text-primary">Not authorised</h2>
        <p className="text-xs text-text-muted text-center max-w-xs">
          This account is signed in but is not on the admin allow-list.
        </p>
        <button onClick={signOut} className="glass-btn mt-1 !text-xs">
          Sign out
        </button>
      </div>
    );
  }

  return children;
};

export default RequireAdmin;
