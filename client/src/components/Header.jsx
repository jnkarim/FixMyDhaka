import {
    Bell,
    CircleHelp,
    MapPinned,
} from "lucide-react";

function Header({
    onReportClick,
}) {
    return (
        <header
            className="
        relative
        z-50
        flex
        h-16
        items-center
        justify-between
        bg-[#214c8f]
        px-4
        text-white
        shadow-sm
        sm:px-6
      "
        >
            <div className="flex items-center gap-3">
                <div
                    className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border-2
            border-white/90
          "
                >
                    <MapPinned size={21} />
                </div>

                <div>
                    <h1 className="text-lg font-bold leading-none tracking-tight">
                        FixMyDhaka
                    </h1>

                    <p className="mt-1 text-[11px] text-blue-100">
                        Civic issue routing for Dhaka
                    </p>
                </div>
            </div>

            <nav className="flex items-center gap-2 sm:gap-5">
                <button
                    type="button"
                    onClick={onReportClick}
                    className="
            rounded-md
            bg-lime-400
            px-4
            py-2.5
            text-sm
            font-bold
            text-slate-900
            shadow-sm
            transition
            hover:bg-lime-300
            focus:outline-none
            focus:ring-2
            focus:ring-lime-200
          "
                >
                    Report a problem
                </button>

                <button
                    type="button"
                    className="
            hidden
            text-sm
            font-medium
            text-white/90
            transition
            hover:text-white
            md:block
          "
                >
                    All reports
                </button>

                <button
                    type="button"
                    className="
            hidden
            items-center
            gap-1.5
            text-sm
            font-medium
            text-white/90
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
            gap-1.5
            text-sm
            font-medium
            text-white/90
            transition
            hover:text-white
            lg:flex
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