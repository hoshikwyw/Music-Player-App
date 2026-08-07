import { Link, NavLink } from "react-router-dom";
import { links } from "../assets/constants";
import { RiCloseLine } from "react-icons/ri";
import { useSidebar } from "../contexts/SidebarContext";

const NavLinks = ({ onNavigate }) => (
  <nav className="mt-6 flex flex-col gap-1">
    {links.map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        onClick={onNavigate}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
            isActive
              ? "text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {/* Active pill sits behind the content so the icon and label stay
                crisp over the tint. */}
            <span
              className={`absolute inset-0 rounded-full transition-opacity duration-200 ${
                isActive
                  ? "opacity-100 bg-primary/15 border border-primary/25"
                  : "opacity-0 group-hover:opacity-100 bg-glass"
              }`}
              style={
                isActive
                  ? { boxShadow: "inset 0 1px 0 0 var(--glass-highlight)" }
                  : undefined
              }
            />
            <item.icon className="relative w-[18px] h-[18px]" />
            <span className="relative">{item.name}</span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div
      className="w-9 h-9 rounded-glass-sm flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{
        background: "var(--glass-tint-strong)",
        border: "1px solid var(--glass-border)",
        boxShadow: "inset 0 1px 0 0 var(--glass-highlight)",
      }}
    >
      <img src="/favicon.svg" alt="" className="w-full h-full" />
    </div>
    <div className="min-w-0">
      <h1 className="font-bold text-base text-text-primary leading-tight tracking-tight truncate">
        Kayv Vibe
      </h1>
      <p className="text-[9px] text-text-muted font-mono tracking-[0.2em]">
        FEEL THE VIBE
      </p>
    </div>
  </div>
);

const SidebarBody = ({ onNavigate }) => (
  <>
    <Link to="/" onClick={onNavigate} className="block px-4 pt-5 pb-1">
      <Logo />
    </Link>
    <div className="px-2.5 flex-1 overflow-y-auto hide-scrollbar">
      <NavLinks onNavigate={onNavigate} />
    </div>
    <div className="px-4 py-3">
      <div className="glass-divider mb-3" />
      <p className="text-[9px] text-text-muted font-mono text-center tracking-[0.2em]">
        v1.0.0
      </p>
    </div>
  </>
);

const Sidebar = () => {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const close = () => setMobileOpen(false);

  return (
    <>
      {/* Desktop rail. Full height with a hairline right edge rather than a
          floating panel, so it never collides with the player dock. */}
      <aside className="md:flex hidden flex-col w-[210px] h-screen glass-2 flex-shrink-0 fixed top-0 left-0 z-20 !rounded-none !border-y-0 !border-l-0">
        <SidebarBody />
      </aside>

      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      {/* Transform rather than `left`: only transform is compositor-driven,
          so the drawer stays smooth on a mid-range phone. */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[250px] glass-3 z-40 md:hidden flex flex-col !rounded-none !border-y-0 !border-l-0 transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <Link to="/" onClick={close}>
            <Logo />
          </Link>
          <button
            onClick={close}
            aria-label="Close menu"
            className="glass-btn w-8 h-8 !p-0 flex-shrink-0"
          >
            <RiCloseLine className="text-text-primary text-lg" />
          </button>
        </div>
        <div className="px-2.5 flex-1 overflow-y-auto hide-scrollbar">
          <NavLinks onNavigate={close} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
