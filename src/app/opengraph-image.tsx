import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Aashar CK: full-stack and AI engineer in Dubai, available immediately";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const portrait = await readFile(join(process.cwd(), "public/work/aashar-og.jpg"), "base64");
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#000", color: "#fff" }}>
      <div
        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 56, width: 640 }}
      >
        <div style={{ fontSize: 26, opacity: 0.75 }}>FULL-STACK &amp; AI ENGINEER · DUBAI</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, letterSpacing: -6, lineHeight: 0.9 }}>Aashar CK</div>
          <div style={{ fontSize: 30, marginTop: 28, lineHeight: 1.3, opacity: 0.85 }}>
            Paste a job description: an AI agent checks it against my record and cites every source.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 24 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#33d17a", marginRight: 12 }} />
          AVAILABLE IMMEDIATELY
        </div>
      </div>
      <img src={`data:image/jpeg;base64,${portrait}`} width={560} height={630} style={{ objectFit: "cover" }} alt="" />
    </div>,
    size,
  );
}
