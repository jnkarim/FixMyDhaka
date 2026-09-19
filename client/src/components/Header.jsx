import {
  Bell,
  CircleHelp,
  FileText,
} from "lucide-react";

import {
  Link,
  NavLink,
} from "react-router-dom";

import BrandLogo from "./BrandLogo";

function Header() {
  return (
    <header
      className="
        relative
        z-[900]
        flex
        h-16
        shrink-0
        items-center
        justify-between
        border-b
        border-white/10
        bg-[#070707]
        px-5
        text-white
        sm:px-7
      "
    >
      <Link
        to="/"
        className="shrink-0"
      >
        <BrandLogo />
      </Link>

      <nav className="flex items-center gap-2 lg:gap-3">
        <NavLink
          to="/report"
          end
          className={({
            isActive,
          }) => `
            rounded-lg
            px-5
            py-2.5
            text-sm
            font-bold
            transition
            active:scale-[0.98]

            ${
              isActive
                ? "bg-white text-black"
                : "bg-[#E8FF00] text-black hover:bg-[#F1FF59]"
            }
          `}
        >
          Report a problem
        </NavLink>

        <NavLink
          to="/reports"
          end
          className={({
            isActive,
          }) => `
            hidden
            items-center
            gap-2
            rounded-lg
            px-3
            py-2
            text-sm
            font-medium
            transition
            md:flex

            ${
              isActive
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }
          `}
        >
          <FileText size={16} />

          All reports
        </NavLink>

        <button
          type="button"
          className="
            hidden
            items-center
            gap-2
            rounded-lg
            px-3
            py-2
            text-sm
            font-medium
            text-zinc-400
            transition
            hover:bg-white/5
            hover:text-white
            lg:flex
          "
        >
          <Bell size={16} />

          Local alerts
        </button>

        <button
          type="button"
          className="
            hidden
            items-center
            gap-2
            rounded-lg
            px-3
            py-2
            text-sm
            font-medium
            text-zinc-400
            transition
            hover:bg-white/5
            hover:text-white
            xl:flex
          "
        >
          <CircleHelp size={16} />

          Help
        </button>
      </nav>
    </header>
  );
}

export default Header;