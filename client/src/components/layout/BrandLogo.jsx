import {
  MapPin,
} from "lucide-react";

function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          relative
          h-11
          w-11
          shrink-0
          overflow-hidden
          rounded-[14px]
          border
          border-[#E8FF00]/40
          bg-[#050505]
          shadow-[0_0_24px_rgba(232,255,0,0.18)]
        "
      >
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[47%]
            bg-[#E8FF00]
          "
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin
            size={24}
            strokeWidth={2.7}
            className="text-white drop-shadow-lg"
          />
        </div>

        <div
          className="
            absolute
            right-1.5
            top-1.5
            h-1.5
            w-1.5
            rounded-full
            bg-[#E8FF00]
            shadow-[0_0_8px_#E8FF00]
          "
        />
      </div>

      <div className="leading-none">
        <div className="flex items-baseline">
          <span className="text-[19px] font-black tracking-[-0.045em] text-white">
            FixMy
          </span>

          <span className="text-[19px] font-black tracking-[-0.045em] text-[#E8FF00]">
            Dhaka
          </span>
        </div>

        <p className="mt-1.5 text-[10px] font-medium tracking-wide text-zinc-500">
          Smart civic issue routing
        </p>
      </div>
    </div>
  );
}

export default BrandLogo;