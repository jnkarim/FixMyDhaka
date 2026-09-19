import {
  FileText,
  Menu,
  Plus,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import BrandLogo from "./BrandLogo";


function Header({
  onReportClick,
}) {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  const handleReportClick = () => {
    setMobileMenuOpen(false);

    if (onReportClick) {
      onReportClick();
    }
  };


  return (
    <header
      className="
        relative
        z-[1500]
        shrink-0
        border-b
        border-white/10
        bg-black
      "
    >
      <div
        className="
          flex
          h-[68px]
          items-center
          justify-between
          gap-4
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* LOGO */}
        <Link
          to="/"
          className="
            shrink-0
          "
        >
          <BrandLogo />
        </Link>


        {/* DESKTOP NAV */}
        <nav
          className="
            hidden
            items-center
            gap-2
            md:flex
          "
        >
          {onReportClick ? (
            <button
              type="button"
              onClick={
                handleReportClick
              }
              className="
                mr-2
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                bg-[#E8FF00]
                px-5
                text-sm
                font-black
                text-black
                transition
                hover:bg-[#F1FF59]
                active:scale-[0.98]
              "
            >
              <Plus
                size={16}
              />

              Report a problem
            </button>
          ) : (
            <Link
              to="/report"
              className="
                mr-2
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                bg-[#E8FF00]
                px-5
                text-sm
                font-black
                text-black
                transition
                hover:bg-[#F1FF59]
                active:scale-[0.98]
              "
            >
              <Plus
                size={16}
              />

              Report a problem
            </Link>
          )}


          <Link
            to="/reports"
            className="
              flex
              h-10
              items-center
              gap-2
              rounded-lg
              px-3
              text-sm
              font-semibold
              text-zinc-300
              transition
              hover:bg-zinc-900
              hover:text-white
            "
          >
            <FileText
              size={17}
            />

            All reports
          </Link>
        </nav>


        {/* MOBILE ACTIONS */}
        <div
          className="
            flex
            items-center
            gap-2
            md:hidden
          "
        >
          {onReportClick ? (
            <button
              type="button"
              onClick={
                handleReportClick
              }
              aria-label="Report a problem"
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-xl
                bg-[#E8FF00]
                px-3
                text-xs
                font-black
                text-black
              "
            >
              <Plus
                size={16}
              />

              Report
            </button>
          ) : (
            <Link
              to="/report"
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-xl
                bg-[#E8FF00]
                px-3
                text-xs
                font-black
                text-black
              "
            >
              <Plus
                size={16}
              />

              Report
            </Link>
          )}


          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (current) =>
                  !current
              )
            }
            aria-label="Toggle navigation"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-800
              bg-zinc-950
              text-white
            "
          >
            {mobileMenuOpen ? (
              <X
                size={19}
              />
            ) : (
              <Menu
                size={19}
              />
            )}
          </button>
        </div>
      </div>


      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div
          className="
            absolute
            left-0
            right-0
            top-full
            border-t
            border-zinc-800
            bg-black
            px-4
            py-3
            shadow-2xl
            md:hidden
          "
        >
          <Link
            to="/reports"
            onClick={() =>
              setMobileMenuOpen(
                false
              )
            }
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-semibold
              text-zinc-200
              transition
              hover:bg-zinc-900
              hover:text-white
            "
          >
            <FileText
              size={17}
            />

            All reports
          </Link>
        </div>
      )}
    </header>
  );
}


export default Header;