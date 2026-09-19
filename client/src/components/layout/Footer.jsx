function Footer() {
  return (
    <footer
      className="
        flex
        h-9
        shrink-0
        items-center
        justify-center
        border-t
        border-zinc-800
        bg-black
        text-[14px]
        text-zinc-500
      "
    >
      Developed by

      <a
        href="https://github.com/jnkarim"
        target="_blank"
        rel="noopener noreferrer"
        className="
          ml-1
          font-semibold
          text-zinc-300
          transition
          hover:text-[#E8FF00]
        "
      >
        jnkarim
      </a>
    </footer>
  );
}

export default Footer;