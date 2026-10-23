
import { useEffect, useRef, useState } from "react";

import {
  Upload,
  Download,
  Image as ImageIcon,
  Lock,
  Unlock,
  X,
  LoaderCircle,
} from "lucide-react";

import {
  processImage,
  readableSize,
} from "../utils/imageUtils.js";

// Image dimension presets
const presets = [
  ["Custom", null],
  ["HD 1280×720", [1280, 720]],
  ["Full HD 1920×1080", [1920, 1080]],
  ["Square 1080×1080", [1080, 1080]],
  ["Passport 35×45 mm @300 DPI", [413, 531]],
];

export default function ImageResizer() {
  // References
  const inputRef = useRef(null);

  // Image states
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Dimension states
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [ratio, setRatio] = useState(4 / 3);
  const [locked, setLocked] = useState(true);

  // Output settings
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.8);
  const [targetKB, setTargetKB] = useState("");

  // Processing states
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Output states
  const [output, setOutput] = useState(null);
  const [outputUrl, setOutputUrl] = useState("");

  // Drag and drop state
  const [drag, setDrag] = useState(false);

  // Selected preset
  const [selectedPreset, setSelectedPreset] = useState(0);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Cleanup output URL
  useEffect(() => {
    return () => {
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
      }
    };
  }, [outputUrl]);

  // Load selected image
  async function loadFile(selectedFile) {
    if (!selectedFile) return;

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError("Maximum file size is 25 MB.");
      return;
    }

    const url = URL.createObjectURL(selectedFile);

    try {
      const bitmap = await createImageBitmap(selectedFile);

      const imageWidth = bitmap.width;
      const imageHeight = bitmap.height;

      bitmap.close();

      setWidth(imageWidth);
      setHeight(imageHeight);
      setRatio(imageWidth / imageHeight);

      setFile(selectedFile);
      setPreview(url);

      setOutput(null);
      setOutputUrl("");

      setFormat(selectedFile.type);
      setSelectedPreset(0);
    } catch {
      URL.revokeObjectURL(url);
      setError("Could not read this image.");
    }
  }

  // Update width while maintaining aspect ratio
  function updateWidth(value) {
    const newWidth = Number(value);

    setWidth(value);
    setSelectedPreset(0);

    if (locked && newWidth > 0) {
      setHeight(
        Math.max(1, Math.round(newWidth / ratio))
      );
    }
  }

  // Update height while maintaining aspect ratio
  function updateHeight(value) {
    const newHeight = Number(value);

    setHeight(value);
    setSelectedPreset(0);

    if (locked && newHeight > 0) {
      setWidth(
        Math.max(1, Math.round(newHeight * ratio))
      );
    }
  }

  // Apply preset dimensions
  function applyPreset(preset, index) {
    setSelectedPreset(index);

    if (!preset) return;

    const [presetWidth, presetHeight] = preset;

    setWidth(presetWidth);
    setHeight(presetHeight);

    setRatio(presetWidth / presetHeight);
  }

  // Toggle aspect ratio lock
  function toggleAspectRatio() {
    if (!locked && Number(width) > 0 && Number(height) > 0) {
      setRatio(Number(width) / Number(height));
    }

    setLocked(!locked);
  }

  // Remove selected image
  function removeImage() {
    setFile(null);
    setPreview("");

    setOutput(null);
    setOutputUrl("");

    setError("");
    setSelectedPreset(0);
  }

  // Process and resize image
  async function resize() {
    if (!file) return;

    const w = Number(width);
    const h = Number(height);

    // Validate dimensions
    if (
      !Number.isInteger(w) ||
      !Number.isInteger(h) ||
      w < 1 ||
      h < 1 ||
      w > 10000 ||
      h > 10000
    ) {
      setError(
        "Width and height must be whole numbers from 1 to 10,000."
      );
      return;
    }

    // Maximum output size: 40 megapixels
    if (w * h > 40000000) {
      setError("Maximum output size is 40 megapixels.");
      return;
    }

    // Validate target size
    if (
      targetKB !== "" &&
      (
        !Number.isFinite(Number(targetKB)) ||
        Number(targetKB) <= 0
      )
    ) {
      setError("Target KB must be a positive number.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const blob = await processImage(file, {
        width: w,
        height: h,
        format,
        quality,
        targetKB:
          targetKB === ""
            ? null
            : Number(targetKB),
      });

      setOutput(blob);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(
        err.message || "Could not process image."
      );
    } finally {
      setBusy(false);
    }
  }

  // Output file extension
  const ext =
    format === "image/jpeg"
      ? "jpg"
      : format === "image/png"
        ? "png"
        : "webp";

  return (
    <div className="panel mx-auto max-w-4xl p-5 sm:p-8">

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          loadFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {!file ? (

        /* Upload Section */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            loadFile(e.dataTransfer.files?.[0]);
          }}
          className={`
            flex min-h-64 w-full flex-col
            items-center justify-center
            rounded-2xl border-2 border-dashed
            p-6 transition
            ${
              drag
                ? "border-blue-400 bg-blue-500/15"
                : "border-slate-600 bg-slate-900/60 hover:border-blue-500"
            }
          `}
        >
          <Upload
            className="mb-4 text-blue-400"
            size={42}
          />

          <strong className="text-xl">
            Click or drop an image here
          </strong>

          <span className="mt-2 text-sm text-slate-400">
            JPG, PNG, WebP · up to 25 MB
          </span>
        </button>

      ) : (

        /* Main Image Editor */
        <div className="grid gap-7 md:grid-cols-2">

          {/* Left: Image Preview */}
          <div>

            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold">
                Original image
              </h2>

              <button
                type="button"
                className="text-sm text-blue-400 hover:underline"
                onClick={() => inputRef.current?.click()}
              >
                Change image
              </button>
            </div>

            {/* Original image */}
            <div className="mt-3 flex min-h-56 items-center justify-center rounded-xl bg-slate-950/80 p-3">
              <img
                src={preview}
                alt="Original uploaded image"
                className="max-h-72 max-w-full rounded-lg object-contain"
              />
            </div>

            <p className="mt-3 break-all text-xs text-slate-400">
              {file.name} · {readableSize(file.size)}
            </p>

            {/* Resized output */}
            {outputUrl && output && (
              <div className="mt-5">

                <h3 className="mb-3 font-bold">
                  Resized preview
                </h3>

                <div className="flex min-h-40 items-center justify-center rounded-xl bg-slate-950 p-3">
                  <img
                    src={outputUrl}
                    alt="Resized output"
                    className="max-h-64 max-w-full object-contain"
                  />
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Output: {readableSize(output.size)}
                  {" · "}
                  {width} × {height} px
                </p>

                <a
                  className="btn mt-3 w-full"
                  href={outputUrl}
                  download={`photobhai-${Date.now()}.${ext}`}
                >
                  <Download size={18} />
                  Download image
                </a>

              </div>
            )}
          </div>

          {/* Right: Resize Settings */}
          <div className="space-y-5">

            {/* Settings header */}
            <div className="flex items-center justify-between">

              <h2 className="font-bold">
                Resize settings
              </h2>

              <button
                type="button"
                onClick={removeImage}
                title="Remove image"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>

            </div>

            {/* Preset dimensions */}
            <label className="field">
              Preset dimensions

              <select
                value={selectedPreset}
                onChange={(e) => {
                  const index = Number(e.target.value);
                  const preset = presets[index][1];

                  applyPreset(preset, index);
                }}
              >
                {presets.map(([label], index) => (
                  <option
                    key={label}
                    value={index}
                  >
                    {label}
                  </option>
                ))}
              </select>
            </label>

            {/* Width and Height */}
            <div className="grid grid-cols-2 gap-3">

              <label className="field">
                Width (px)

                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={width}
                  onChange={(e) =>
                    updateWidth(e.target.value)
                  }
                />
              </label>

              <label className="field">
                Height (px)

                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={height}
                  onChange={(e) =>
                    updateHeight(e.target.value)
                  }
                />
              </label>

            </div>

            {/* Aspect ratio lock */}
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-blue-300"
              onClick={toggleAspectRatio}
            >
              {locked ? (
                <Lock size={16} />
              ) : (
                <Unlock size={16} />
              )}

              {locked
                ? "Aspect ratio locked"
                : "Aspect ratio unlocked"}
            </button>

            {/* Output format */}
            <label className="field">
              Output format

              <select
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value)
                }
              >
                <option value="image/jpeg">
                  JPG
                </option>

                <option value="image/png">
                  PNG
                </option>

                <option value="image/webp">
                  WebP
                </option>
              </select>
            </label>

            {/* Image quality */}
            {format !== "image/png" && (
              <label className="field">

                Quality: {Math.round(quality * 100)}%

                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) =>
                    setQuality(Number(e.target.value))
                  }
                />

              </label>
            )}

            {/* Target size */}
            <label className="field">
              Target size in KB (optional)

              <input
                type="number"
                min="1"
                placeholder="e.g. 100"
                value={targetKB}
                onChange={(e) =>
                  setTargetKB(e.target.value)
                }
              />

              <span className="text-xs font-normal text-slate-500">
                Best effort for JPG/WebP.
                PNG ignores target KB.
                Small targets may not be achievable.
              </span>
            </label>

            {/* Resize button */}
            <button
              type="button"
              className="btn w-full"
              onClick={resize}
              disabled={busy}
            >
              {busy ? (
                <LoaderCircle
                  className="animate-spin"
                  size={18}
                />
              ) : (
                <ImageIcon size={18} />
              )}

              {busy
                ? "Processing…"
                : "Resize image"}
            </button>

          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

    </div>
  );
}
