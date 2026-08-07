import { useState } from "react";
import { BsShieldLock } from "react-icons/bs";
import { useAuth } from "../hooks/useAuth";

const AdminLogin = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setError("");

    const { error: signInError } = await signIn(email, password);

    setPending(false);
    if (signInError) setError(signInError.message);
    // On success the auth listener updates the session and this unmounts.
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="retro-card p-6 sm:p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-5">
          <BsShieldLock className="text-primary text-xl" />
          <h2 className="text-lg font-bold text-text-primary">Admin Access</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="retro-input text-sm"
            required
            autoFocus
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="retro-input text-sm"
            required
          />
          {error && <p className="text-xs text-danger font-semibold">{error}</p>}
          <button type="submit" className="retro-btn text-sm" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
