import { type Handle, on, ref, clientEntry } from "remix/ui";

import {
  optimizeImage,
  setLimit,
  waitReady,
  launchWorker,
} from "wasm-image-optimization/workers";

if (typeof window !== "undefined") {
  setLimit(8); // Web Worker limit
  launchWorker(); // Prepare Worker in advance.
}

const classNames = (...classNames: (string | undefined | false)[]) =>
  classNames.reduce(
    (a, b, index) => a + (b ? (index ? " " : "") + b : ""),
    "",
  ) as string | undefined;

const formats = ["none", "avif", "webp", "jpeg", "png"] as const;

interface AsyncImageProps {
  file: File;
  format: (typeof formats)[number];
  quality: number;
  speed: number;
  filter: boolean;
  size: [number, number];
  onFinished?: (p: {
    image: NonNullable<Awaited<ReturnType<typeof optimizeImage>>>;
    format: (typeof formats)[number];
    quality: number;
    speed: number;
    time: number;
  }) => void;
}

function AsyncImage(handle: Handle<AsyncImageProps>) {
  let time = 0;
  let image: Awaited<ReturnType<typeof optimizeImage>> | null | undefined =
    null;
  let src: string | null | undefined;
  const property: { isInit?: boolean } = {};
  return () => {
    const { file, format, quality, size, speed, filter, onFinished } =
      handle.props;
    if (!property.isInit) {
      property.isInit = true;
      const convert = async () => {
        image = null;
        // Wait for WebWorkers to become available.
        // If you don't wait, they will still be loaded in the queue, but the conversion time will no longer be accurately measured.
        await waitReady();
        const buffer = await file.arrayBuffer();
        const t = performance.now();
        image = await optimizeImage({
          image: buffer,
          format: format === "none" ? undefined : format,
          quality,
          speed,
          width: size[0] || undefined,
          height: size[1] || undefined,
        });
        time = performance.now() - t;
        if (image) {
          onFinished?.({ image, format, speed, quality, time });
        }
        src =
          image &&
          URL.createObjectURL(
            new Blob([image.data as BufferSource], {
              type: format === "none" ? file.type : `image/${format}`,
            }),
          );
        handle.update();
      };
      convert();
    }
    const filename =
      format === "none" ? file.name : file.name.replace(/\.\w+$/, `.${format}`);
    return (
      <div className="border border-gray-300 rounded-4 overflow-hidden relative w-64 h-64 grid">
        {image === undefined && <div>Error</div>}
        {src && image && (
          <>
            <a target="_blank" href={src}>
              <img
                className="flex-1 object-contain block overflow-hidden"
                src={src}
              />
            </a>
            <div className="bg-white/80 w-full z-10 text-right p-0 absolute bottom-0 font-bold">
              <div>{filename}</div>
              <div>{time?.toLocaleString()}ms</div>
              <div>
                {format !== "none" ? "Optimize" : "Original"}:{" "}
                {image.width.toLocaleString()}x{image.height.toLocaleString()} -{" "}
                {Math.ceil(image.data.length / 1024).toLocaleString()}KB
              </div>
            </div>
          </>
        )}
        {image === null && (
          <div className="m-auto animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent" />
        )}
      </div>
    );
  };
}

export const Page = clientEntry(
  "/src/routes/index.tsx#Page",
  function Page(handle: Handle) {
    let images: File[] = [];

    let quality = 80;
    let speed = 6;
    let size: [number, number] = [0, 0];
    let limitWorker = 10;
    let formatList = [...formats];
    let filter = true;
    let logs: string[] = [];
    let refInput: HTMLInputElement;
    let focus = false;

    return () => {
      const logText = logs.join("\n");
      const onFiles = (v: File[]) => {
        images = [...images, ...v];
        handle.update();
      };
      return (
        <div className="p-4">
          <div>
            <a
              className="text-blue-600 hover:underline"
              href="https://github.com/SoraKumo001/wasm-image-optimization-samples/tree/master/next-image-convert"
            >
              Source code
            </a>
          </div>
          <div className="flex">
            <input
              className="absolute size-0"
              type="file"
              multiple
              accept=".jpg,.png,.gif,.svg,.avif,.webp"
              mix={[
                ref((node: HTMLInputElement) => {
                  refInput = node;
                }),
                on<HTMLInputElement, "focus">("focus", () => {
                  focus = true;
                  handle.update();
                }),
                on<HTMLInputElement, "blur">("blur", () => {
                  focus = false;
                  handle.update();
                }),
                on<HTMLInputElement, "paste">("paste", (e) => {
                  e.preventDefault();
                  if (e.clipboardData?.files)
                    onFiles(Array.from(e.clipboardData.files));
                }),
                on<HTMLInputElement, "change">("change", (e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  if (target.files) onFiles(Array.from(target.files));
                }),
              ]}
            />
            <div
              className={classNames(
                "w-64 h-32 border-dashed border flex justify-center items-center cursor-pointer select-none m-2 rounded-4xl p-4",
                focus && "outline outline-blue-400",
              )}
              mix={[
                on<HTMLDivElement, "dragover">("dragover", (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }),
                on<HTMLDivElement, "dragenter">("dragenter", (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }),
                on<HTMLDivElement, "dblclick">("dblclick", () => {
                  refInput.click();
                }),
                on<HTMLDivElement, "click">("click", () => {
                  refInput.focus();
                }),
                on<HTMLDivElement, "drop">("drop", (e) => {
                  if (e.dataTransfer?.files)
                    onFiles(Array.from(e.dataTransfer.files));
                  e.preventDefault();
                }),
              ]}
            >
              Drop here, copy and paste or double-click to select the file.
            </div>
            <textarea
              className="border flex-1 border-gray-400 p-2 rounded bg-gray-50 font-mono text-nowrap"
              readOnly
              value={logText}
            />
          </div>
          <button
            className="text-blue-700 hover:text-white border border-blue-500 hover:bg-blue-600 rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
            mix={[
              on("click", () => {
                images = [];
                logs = [];
                handle.update();
              }),
            ]}
          >
            Clear
          </button>
          <label className="flex gap-2 items-center">
            <input
              type="number"
              className="border border-gray-300 rounded-4 p-1 w-16"
              value={size[0]}
              mix={[
                on<HTMLInputElement, "change">("change", (e) => {
                  const target = e.currentTarget;
                  size = [Math.max(0, Number(target.value)), size[1]];
                  handle.update();
                }),
              ]}
            />
            Width(0:Original)
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="number"
              className="border border-gray-300 rounded-4 p-1 w-16"
              value={size[1]}
              mix={[
                on<HTMLInputElement, "change">("change", (e) => {
                  const target = e.currentTarget;
                  size = [size[0], Math.max(0, Number(target.value))];
                  handle.update();
                }),
              ]}
            />
            Height(0:Original)
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="number"
              className="border border-gray-300 rounded-4 p-1 w-16"
              value={speed}
              mix={[
                on<HTMLInputElement, "change">("change", (e) => {
                  const target = e.currentTarget;
                  speed = Math.min(10, Math.max(0, Number(target.value)));
                  handle.update();
                }),
              ]}
            />
            Speed(0-10,Slower-Faster): Avif
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="number"
              className="border border-gray-300 rounded-4 p-1 w-16"
              value={quality}
              mix={[
                on<HTMLInputElement, "change">("change", (e) => {
                  const target = e.currentTarget;
                  quality = Math.min(100, Math.max(0, Number(target.value)));
                  handle.update();
                }),
              ]}
            />
            Quality(0-100): Avif, Jpeg, WebP
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="number"
              className="border border-gray-300 rounded-4 p-1 w-16"
              value={limitWorker}
              mix={[
                on<HTMLInputElement, "change">("change", (e) => {
                  const target = e.currentTarget;
                  limitWorker = Math.max(1, Number(target.value));
                  setLimit(limitWorker);
                  launchWorker();
                  handle.update();
                }),
              ]}
            />
            Web Workers(1-)
          </label>
          <label className="flex gap-2 items-center">
            <div className="border border-gray-300 rounded-4 p-1 w-16">
              <input
                type="checkbox"
                checked={filter}
                mix={[
                  on<HTMLInputElement, "change">("change", (e) => {
                    const target = e.currentTarget;
                    filter = target.checked;
                    handle.update();
                  }),
                ]}
              />
            </div>
            Resize filter
          </label>
          <div className="flex gap-2">
            {formats.map((format) => (
              <label key={format} className="flex gap-1 ">
                <input
                  type="checkbox"
                  checked={formatList.includes(format)}
                  mix={[
                    on<HTMLInputElement, "change">("change", (e) => {
                      const target = e.currentTarget;
                      const checked = target.checked;
                      if (checked) formatList = [...formatList, format];
                      else formatList = formatList.filter((f) => f !== format);
                      handle.update();
                    }),
                  ]}
                />
                {format}
              </label>
            ))}
          </div>
          <hr className="m-4" />
          <div className="flex flex-wrap gap-4">
            {images.flatMap((file, index) => (
              <div key={index} className="flex flex-wrap gap-4">
                {formats
                  .filter((f) => formatList.includes(f))
                  .map((format, index2) => (
                    <AsyncImage
                      key={format}
                      file={file}
                      format={format}
                      quality={quality}
                      speed={speed}
                      size={size}
                      filter={filter}
                      onFinished={(v) => {
                        logs = [
                          ...logs,
                          `${index}-${index2}-${format.padEnd(4)} ${file.name}(${
                            v.image.originalWidth
                          }x${v.image.originalHeight}) (${v.image.width}x${
                            v.image.height
                          }) Speed:${speed} Quality:${quality} ${Math.ceil(
                            v.image.data.length / 1024,
                          )
                            .toLocaleString()
                            .padStart(8)}KB ${v.time
                            .toLocaleString(undefined, {
                              minimumFractionDigits: 1,
                            })
                            .padStart(8)}ms`,
                        ].sort((a, b) => (a < b ? -1 : 1));
                        handle.update();
                      }}
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
      );
    };
  },
);
export default Page;
