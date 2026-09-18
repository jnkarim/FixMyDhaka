import {
  Bell,
  CircleHelp,
  FileText,
} from "lucide-react";

import BrandLogo from "./BrandLogo";

function Header({
  onReportClick,
}) {
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
        px-4
        text-white
        shadow-[0_10px_35px_rgba(0,0,0,0.18)]
        sm:px-6
      "
    >
      <BrandLogo />

      <nav className="flex items-center gap-2 lg:gap-6">
        <button
          type="button"
          onClick={onReportClick}
          className="
            rounded-lg
            bg-[#E8FF00]
            px-4
            py-2.5
            text-sm
            font-extrabold
            text-black
            shadow-[0_0_22px_rgba(232,255,0,0.15)]
            transition
            duration-200
            hover:bg-[#F0FF54]
            hover:shadow-[0_0_30px_rgba(232,255,0,0.25)]
            active:scale-[0.98]
          "
        >
          Report a problem
        </button>

        <button
          type="button"
          className="
            hidden
            items-center
            gap-2
            text-sm
            font-medium
            text-zinc-400
            transition
            hover:text-white
            md:flex
          "
        >
          <FileText size={16} />
          All reports
        </button>

        <button
          type="button"
          className="
            hidden
            items-center
            gap-2
            text-sm
            font-medium
            text-zinc-400
            transition
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
            text-sm
            font-medium
            text-zinc-400
            transition
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