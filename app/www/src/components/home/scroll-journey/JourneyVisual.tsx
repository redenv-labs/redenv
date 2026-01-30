import { EncryptionVisual } from "./EncryptionVisual";
import { GlobalVisual } from "./GlobalVisual";
import { StorageVisual } from "./StorageVisual";
import { TerminalVisual } from "./TerminalVisual";
import { UsageVisual } from "./UsageVisual";

export const JourneyVisual = ({ progress }: { progress: number }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center min-h-80">
      {/* Step 1 */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: progress < 0.2 ? 1 : 0,
          pointerEvents: progress < 0.2 ? "auto" : "none",
        }}
      >
        <TerminalVisual progress={progress} />
      </div>

      {/* Step 2 */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: progress >= 0.2 && progress < 0.4 ? 1 : 0,
          pointerEvents: progress >= 0.2 && progress < 0.4 ? "auto" : "none",
        }}
      >
        <EncryptionVisual progress={progress} />
      </div>

      {/* Step 3 */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: progress >= 0.4 && progress < 0.6 ? 1 : 0,
          pointerEvents: progress >= 0.4 && progress < 0.6 ? "auto" : "none",
        }}
      >
        <StorageVisual progress={progress} />
      </div>

      {/* Step 4 */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: progress >= 0.6 && progress < 0.8 ? 1 : 0,
          pointerEvents: progress >= 0.6 && progress < 0.8 ? "auto" : "none",
        }}
      >
        <GlobalVisual progress={progress} />
      </div>

      {/* Step 5 */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: progress >= 0.8 ? 1 : 0,
          pointerEvents: progress >= 0.8 ? "auto" : "none",
        }}
      >
        <UsageVisual progress={progress} />
      </div>
    </div>
  );
}
