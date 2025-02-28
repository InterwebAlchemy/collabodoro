export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center w-full py-4">
      <p className="text-xs text-gray-500">
        Powered by{" "}
        <a href="https://peerjs.com/" target="_blank" rel="noopener noreferrer">
          PeerJS
        </a>
      </p>
      <div className="flex flex-row items-center justify-center w-full text-xs text-gray-500 mt-4">
        <div className="rc-scout"></div>
      </div>
    </footer>
  );
}
