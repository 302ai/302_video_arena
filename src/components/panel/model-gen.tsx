import VideoGenTop from "./model-gen/video-top";
import { VideoGenBottom } from "./model-gen/video-bottom";

export default function ModelGen() {
  return (
    <div className="flex size-full flex-col gap-4">
      <div className="@container">
        <div className="rounded-lg border bg-card text-card-foreground">
          <div className="grid gap-4 p-4">
            <VideoGenTop />
            <VideoGenBottom />
          </div>
        </div>
      </div>
    </div>
  );
}
