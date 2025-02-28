export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-center w-full p-0 md:p-4 pb-4">
      <div className="text-xs text-gray-500">
        Powered&nbsp;by&nbsp;
        <a
          className="underline hover:no-underline"
          href="https://peerjs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          PeerJS
        </a>
      </div>
      <div className="text-xs text-gray-500 mt-4 md:ml-auto md:mt-0 h-[10px]">
        <div className="rc-scout"></div>
      </div>
    </footer>
  );
}
