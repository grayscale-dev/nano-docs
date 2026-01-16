"use client";

import { type ChangeEvent, useMemo, useRef, useState } from "react";
import ApryseViewer from "../components/ApryseViewer";

type UploadedDoc = {
  id: string;
  name: string;
  file: File;
  uploadedAt: number;
};

type ViewerDoc = {
  id: string;
  name: string;
  file?: File;
  url?: string;
  isDefault?: boolean;
};

type ViewerSize =
  | "full"
  | "tablet-portrait"
  | "tablet-landscape"
  | "phone-portrait"
  | "phone-landscape";

const DEMO_DOC: ViewerDoc = {
  id: "demo-contract",
  name: "Sample.pdf",
  url: "/sample.pdf",
  isDefault: true,
};

export default function HomePage() {
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [activeDocId, setActiveDocId] = useState(DEMO_DOC.id);
  const [isOpenMenuOpen, setIsOpenMenuOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [viewerSize, setViewerSize] = useState<ViewerSize>("full");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allDocs = useMemo<ViewerDoc[]>(
    () => [DEMO_DOC, ...uploadedDocs.map((doc) => ({ ...doc }))],
    [uploadedDocs]
  );

  const activeDoc =
    allDocs.find((doc) => doc.id === activeDocId) ?? DEMO_DOC;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const nextDocs = files
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        file,
        uploadedAt: Date.now(),
      }));

    if (!nextDocs.length) return;

    setUploadedDocs((prev) => [...nextDocs, ...prev]);
    setActiveDocId(nextDocs[0].id);
    setIsOpenMenuOpen(false);
    setIsActionsMenuOpen(false);
    event.target.value = "";
  };

  const handleRemoveDoc = (id: string) => {
    setUploadedDocs((prev) => prev.filter((doc) => doc.id !== id));
    if (activeDocId === id) {
      setActiveDocId(DEMO_DOC.id);
    }
  };

  const handleClearAll = () => {
    setUploadedDocs([]);
    setActiveDocId(DEMO_DOC.id);
    setIsOpenMenuOpen(false);
    setIsActionsMenuOpen(false);
  };

  const viewerSizeClasses: Record<ViewerSize, string> = {
    full: "h-full w-full",
    "tablet-portrait": "h-[1024px] w-[768px]",
    "tablet-landscape": "h-[768px] w-[1024px]",
    "phone-portrait": "h-[812px] w-[375px]",
    "phone-landscape": "h-[375px] w-[812px]",
  };
  const isFullViewer = viewerSize === "full";

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#e6e8ec] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center gap-3 px-4 py-2 sm:flex-nowrap sm:py-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Nano Docs</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Demo
              </span>
            </div>
          </div>
          <div className="order-3 flex w-full min-w-0 flex-col items-center text-center sm:order-none sm:w-auto sm:flex-1 sm:flex-row sm:justify-center sm:gap-2">
            <span className="max-w-[50vw] truncate text-sm font-semibold text-slate-900 sm:max-w-none">
              {activeDoc.name}
            </span>
          </div>
          <div className="order-2 ml-auto flex items-center justify-end gap-2 text-xs font-semibold text-slate-600 sm:order-none sm:flex-nowrap">
            <div className="relative hidden sm:block">
              <button
                className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
                onClick={() => setIsOpenMenuOpen((prev) => !prev)}
              >
                Open
              </button>
              {isOpenMenuOpen && (
                <div className="absolute right-0 top-11 z-20 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    <span>Open Files</span>
                    {uploadedDocs.length > 0 && (
                      <button
                        className="text-[10px] font-semibold text-slate-400 hover:text-slate-600"
                        onClick={handleClearAll}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    {allDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-xs"
                      >
                        <button
                          className="truncate text-left font-semibold text-slate-700"
                          onClick={() => {
                            setActiveDocId(doc.id);
                            setIsOpenMenuOpen(false);
                          }}
                        >
                          {doc.name}
                        </button>
                        {doc.isDefault ? (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                            Demo
                          </span>
                        ) : (
                          <button
                            className="text-[10px] font-semibold text-slate-400 hover:text-slate-600"
                            onClick={() => handleRemoveDoc(doc.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              className="hidden rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white sm:inline-flex"
              onClick={handleUploadClick}
            >
              Upload PDFs
            </button>
            <button
              className="hidden rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 sm:inline-flex"
              onClick={handleClearAll}
            >
              Reset Demo
            </button>
            <div className="hidden items-center gap-2 text-xs font-semibold text-slate-600 sm:flex">
              <select
                className="rounded-md border border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700"
                value={viewerSize}
                onChange={(event) =>
                  setViewerSize(event.target.value as ViewerSize)
                }
              >
                <option value="full">Full size</option>
                <option value="tablet-portrait">Tablet portrait</option>
                <option value="tablet-landscape">Tablet landscape</option>
                <option value="phone-portrait">Phone portrait</option>
                <option value="phone-landscape">Phone landscape</option>
              </select>
            </div>
            <div className="relative sm:hidden">
              <button
                className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
                onClick={() => setIsActionsMenuOpen((prev) => !prev)}
              >
                Actions
              </button>
              {isActionsMenuOpen && (
                <div className="absolute right-0 top-11 z-20 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    <span>Documents</span>
                    {uploadedDocs.length > 0 && (
                      <button
                        className="text-[10px] font-semibold text-slate-400 hover:text-slate-600"
                        onClick={handleClearAll}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    {allDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-xs"
                      >
                        <button
                          className="truncate text-left font-semibold text-slate-700"
                          onClick={() => {
                            setActiveDocId(doc.id);
                            setIsActionsMenuOpen(false);
                          }}
                        >
                          {doc.name}
                        </button>
                        {doc.isDefault ? (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                            Demo
                          </span>
                        ) : (
                          <button
                            className="text-[10px] font-semibold text-slate-400 hover:text-slate-600"
                            onClick={() => handleRemoveDoc(doc.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="flex-1 rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                      onClick={handleUploadClick}
                    >
                      Upload PDFs
                    </button>
                    <button
                      className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600"
                      onClick={handleClearAll}
                    >
                      Reset Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 flex-col">
        <section className="flex-1 min-h-0">
          <div
            className={`flex h-full w-full rounded-md border border-slate-300 bg-slate-100/40 ${
              isFullViewer
                ? "items-stretch justify-stretch"
                : "items-center justify-center"
            }`}
          >
            <div
              className={`${viewerSizeClasses[viewerSize]} min-h-0 min-w-0 overflow-hidden rounded-md bg-white shadow-sm`}
            >
              <ApryseViewer
                licenseKey={process.env.NEXT_PUBLIC_APRYSE_KEY}
                documentToLoad={activeDoc}
              />
            </div>
          </div>
        </section>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />
    </main>
  );
}
