import Link from "next/link";
import { IconBrandGithub } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-center w-full p-0 md:p-4 pb-4">
      <div className="flex flex-row items-center gap-2 text-gray-500">
        <Link
          href="https://github.com/InterwebAlchemy/collabodoro"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center gap-1 underline text-gray-500 hover:text-foreground hover:no-underline"
        >
          <IconBrandGithub size={14} />
          <span className="text-xs">Source Code</span>
        </Link>
        |
        <div className="text-xs text-gray-500">
          Powered&nbsp;by&nbsp;
          <a
            className="underline hover:no-underline hover:text-foreground"
            href="https://peerjs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PeerJS
          </a>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-4 md:ml-auto md:mt-0 h-[10px]">
        <div className="rc-scout"></div>
      </div>
    </footer>
  );
}
