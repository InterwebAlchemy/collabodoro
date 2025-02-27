import { useState } from "react";
import { usePeer } from "../contexts/PeerContext";

interface ConnectionDiagnosticProps {
  className?: string;
}

/**
 * A diagnostic component for troubleshooting PeerJS connection issues
 */
export default function ConnectionDiagnostic({
  className = "",
}: ConnectionDiagnosticProps) {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [testResults, setTestResults] = useState<{
    [key: string]: boolean | null;
  }>({
    browserSupport: null,
    iceConnection: null,
    signaling: null,
  });
  const [testing, setTesting] = useState(false);

  const { peer, peerId, isPeerConnected, connectionError } = usePeer();

  const runConnectionTests = async () => {
    setTesting(true);
    const results = { ...testResults };

    // Test 1: Browser WebRTC support
    try {
      results.browserSupport = Boolean(
        window.RTCPeerConnection &&
          window.RTCSessionDescription &&
          navigator.mediaDevices
      );
    } catch (error) {
      console.error("Error checking browser support:", error);
      results.browserSupport = false;
    }

    setTestResults(results);

    // Test 2: ICE server connection
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          results.iceConnection = true;
          setTestResults({ ...results });
          pc.close();
        }
      };

      pc.onicecandidateerror = () => {
        results.iceConnection = false;
        setTestResults({ ...results });
        pc.close();
      };

      // Create a data channel to trigger ICE gathering
      pc.createDataChannel("test");

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Set a timeout for ICE gathering
      setTimeout(() => {
        if (results.iceConnection === null) {
          results.iceConnection = false;
          setTestResults({ ...results });
          pc.close();
        }
      }, 5000);
    } catch (error) {
      console.error("Error checking ICE server connection:", error);
      results.iceConnection = false;
      setTestResults({ ...results });
    }

    // Test 3: PeerJS signaling server connection
    results.signaling = Boolean(peer && peerId);
    setTestResults({ ...results });

    setTesting(false);
  };

  return (
    <div className={`mt-4 ${className}`}>
      <button
        onClick={() => setShowDiagnostics(!showDiagnostics)}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        {showDiagnostics ? "Hide" : "Show"} Connection Diagnostics
      </button>

      {showDiagnostics && (
        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
          <h4 className="font-medium mb-2">Connection Diagnostics</h4>

          <ul className="space-y-1 mb-3">
            <li className="flex justify-between">
              <span>PeerJS Initialized:</span>
              <span className={peer ? "text-green-600" : "text-red-600"}>
                {peer ? "Yes" : "No"}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Peer ID Assigned:</span>
              <span className={peerId ? "text-green-600" : "text-red-600"}>
                {peerId ? "Yes" : "No"}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Connection Status:</span>
              <span
                className={isPeerConnected ? "text-green-600" : "text-red-600"}
              >
                {isPeerConnected ? "Connected" : "Not Connected"}
              </span>
            </li>
            {connectionError && (
              <li className="flex justify-between">
                <span>Last Error:</span>
                <span className="text-red-600">{connectionError}</span>
              </li>
            )}
          </ul>

          <button
            onClick={runConnectionTests}
            disabled={testing}
            className="w-full py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 disabled:opacity-50"
          >
            {testing ? "Running Tests..." : "Run Connection Tests"}
          </button>

          {(testing || Object.values(testResults).some((v) => v !== null)) && (
            <div className="mt-3 space-y-1">
              <h5 className="font-medium">Test Results:</h5>
              <ul>
                <li className="flex justify-between">
                  <span>Browser WebRTC Support:</span>
                  {testResults.browserSupport === null ? (
                    <span className="text-gray-500">Testing...</span>
                  ) : (
                    <span
                      className={
                        testResults.browserSupport
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {testResults.browserSupport
                        ? "Supported"
                        : "Not Supported"}
                    </span>
                  )}
                </li>
                <li className="flex justify-between">
                  <span>ICE Server Connection:</span>
                  {testResults.iceConnection === null ? (
                    <span className="text-gray-500">Testing...</span>
                  ) : (
                    <span
                      className={
                        testResults.iceConnection
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {testResults.iceConnection ? "Working" : "Failed"}
                    </span>
                  )}
                </li>
                <li className="flex justify-between">
                  <span>PeerJS Signaling:</span>
                  {testResults.signaling === null ? (
                    <span className="text-gray-500">Testing...</span>
                  ) : (
                    <span
                      className={
                        testResults.signaling
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {testResults.signaling ? "Connected" : "Not Connected"}
                    </span>
                  )}
                </li>
              </ul>

              {!testResults.browserSupport && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
                  Your browser doesn&apos;t fully support WebRTC. Try using a
                  modern browser like Chrome, Firefox, or Edge.
                </div>
              )}

              {!testResults.iceConnection && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
                  ICE connection failed. This could be due to firewall or
                  network restrictions. Try using a different network.
                </div>
              )}

              {!testResults.signaling && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 rounded">
                  Could not connect to PeerJS signaling server. Check your
                  internet connection and try again.
                </div>
              )}
            </div>
          )}

          <div className="mt-3 text-gray-500">
            <p>Troubleshooting Tips:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>Ensure you&apos;re using a modern browser</li>
              <li>Check if your firewall is blocking WebRTC traffic</li>
              <li>Try disabling any VPN or proxy services</li>
              <li>Make sure both users are online and using the correct IDs</li>
              <li>Try refreshing the page and reconnecting</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
