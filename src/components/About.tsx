export default function About() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center py-2 p-4 gap-3">
      <div className="flex flex-col w-full max-w-[720px] h-full justify-center gap-3 align-left">
        <h1 className="text-2xl font-bold">About Collabodoro</h1>
        <p>
          Collabodoro is just like the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground hover:no-underline text-[var(--resting-color)]"
          >
            Pomodoro Technique
          </a>{" "}
          timers that you&apos;re used to, but it also allows you to share a
          synchronized timer session with anyone, anywhere.
        </p>
        <p>
          You can even share a session between your own devices so that you can
          walk away with your phone for a period of rest and get alerted when
          it&apos;s time to head back to your computer to work.
        </p>
        <p>
          The Config menu at the top of the page allows you to change the
          timer&apos;s settings, the application&apos;s color scheme, and enable
          features like notifications and sound effects to let you know when
          it&apos;s time to work or rest. Sound effects also let you know when
          someone joins or leaves a synchornized session.
        </p>
        <p>
          Timer settings are stored locally in your browser, so each device will
          keep track of your recent timer settings.
        </p>
        <p>
          Synchronized sessions are managed through{" "}
          <a
            href="https://peerjs.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground hover:no-underline text-[var(--resting-color)]"
          >
            Peer JS
          </a>
          , which is a peer-to-peer library that allows you to connect to other
          users via{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground hover:no-underline text-[var(--resting-color)]"
          >
            WebRTC
          </a>
          .
        </p>
        <p>
          Collabodoro is still in beta, so{" "}
          <a
            href="https://github.com/InterwebAlchemy/collabodoro/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground hover:no-underline text-[var(--resting-color)]"
          >
            please report any bugs or issues you encounter.
          </a>
        </p>
        <p>
          Built with love, coffee, and just a dash of Generative AI by{" "}
          <a
            href="https://interwebalchemy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground hover:no-underline text-[var(--resting-color)]"
          >
            Interweb Alchemy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
