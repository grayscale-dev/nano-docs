"use client";

import { type ReactNode } from "react";

export type DocRef = {
  id: string;
  name: string;
  file?: Blob;
  url?: string;
  isDefault?: boolean;
  uploadedAt?: number;
  approved?: boolean;
};

export type ViewerSize =
  | "full"
  | "tablet-portrait"
  | "tablet-landscape"
  | "phone-portrait"
  | "phone-landscape";

type AppShellProps = {
  activeDoc: DocRef;
  docs: DocRef[];
  uploadedDocsCount: number;
  canApproveDocument: boolean;
  viewerSize: ViewerSize;
  isActionsMenuOpen: boolean;
  onToggleActionsMenu: () => void;
  onApproveDocument: () => void;
  onOpenDocument: (
    id: string,
    source?: "current" | "deleted" | "previous"
  ) => void;
  onSelectDocFromActionsMenu: (id: string) => void;
  onRemoveDoc: (id: string) => void;
  onClearAll: () => void;
  onUploadClick: () => void;
  onViewerSizeChange: (size: ViewerSize) => void;
  viewer: ReactNode;
};

const viewerSizeClasses: Record<ViewerSize, string> = {
  full: "h-full w-full",
  "tablet-portrait": "h-[1024px] w-[768px]",
  "tablet-landscape": "h-[768px] w-[1024px]",
  "phone-portrait": "h-[812px] w-[375px]",
  "phone-landscape": "h-[375px] w-[812px]",
};

function CheckIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 6.5L4.8 8.8L9.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AppShell({
  activeDoc,
  docs,
  uploadedDocsCount,
  canApproveDocument,
  viewerSize,
  isActionsMenuOpen,
  onToggleActionsMenu,
  onApproveDocument,
  onOpenDocument,
  onSelectDocFromActionsMenu,
  onRemoveDoc,
  onClearAll,
  onUploadClick,
  onViewerSizeChange,
  viewer,
}: AppShellProps) {
  const isFullViewer = viewerSize === "full";

  const renderDocumentList = (
    docs: DocRef[],
    emptyMessage: string,
    openSource: "current" | "deleted" | "previous" = "current"
  ) => {
    if (docs.length === 0) {
      return <div className="py-2 text-sm text-slate-400">{emptyMessage}</div>;
    }
    return (
      <div className="flex flex-col divide-y divide-slate-200">
        {docs.map((doc) => {
          const isActive = doc.id === activeDoc.id;
          return (
            <button
              key={doc.id}
              className={`flex w-full items-center justify-between gap-3 py-2 text-left text-sm ${
                isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-900"
              }`}
              onClick={() => onOpenDocument(doc.id, openSource)}
            >
              <div className="flex min-w-0 items-center gap-2">
                {doc.approved && (
                  <span className="text-emerald-500/60">
                    <CheckIcon />
                  </span>
                )}
                <span className={`truncate ${isActive ? "font-semibold" : ""}`}>
                  {doc.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <main className="flex max-h-screen min-h-screen flex-col overflow-hidden bg-[#eef1f4] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="relative flex w-full flex-wrap items-center gap-3 px-4 py-2 sm:flex-nowrap sm:py-3">
          <div className="flex items-center gap-3">
            <img
              src="/icononly_transparent_nobuffer.png"
              alt="Nano Docs logo"
              className="h-8 w-auto"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Nano Docs</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Demo
              </span>
            </div>
          </div>
          <div className="order-3 flex w-full min-w-0 flex-col items-center text-center sm:absolute sm:left-1/2 sm:top-1/2 sm:w-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:flex-row sm:justify-center sm:gap-2">
            <span className="max-w-[50vw] truncate text-sm font-semibold text-slate-900 sm:max-w-none">
              {activeDoc.name}
            </span>
          </div>
          <div className="order-2 ml-auto flex items-center justify-end gap-2 text-xs font-semibold text-slate-600 sm:order-none sm:flex-nowrap">
            <button
              className="hidden rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 sm:inline-flex"
              onClick={onClearAll}
            >
              Reset Demo
            </button>
            <div className="hidden items-center gap-2 text-xs font-semibold text-slate-600 sm:flex">
              <select
                className="rounded-md border border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700"
                value={viewerSize}
                onChange={(event) =>
                  onViewerSizeChange(event.target.value as ViewerSize)
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
                onClick={onToggleActionsMenu}
              >
                Actions
              </button>
              {isActionsMenuOpen && (
                <div className="absolute right-0 top-11 z-20 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    <span>Documents</span>
                    {uploadedDocsCount > 0 && (
                      <button
                        className="text-[10px] font-semibold text-slate-400 hover:text-slate-600"
                        onClick={onClearAll}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
              <div className="mt-2 flex flex-col gap-2">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-xs"
                  >
                        <button
                          className="flex items-center gap-2 truncate text-left font-semibold text-slate-700"
                          onClick={() => onSelectDocFromActionsMenu(doc.id)}
                        >
                          {doc.approved && (
                            <span className="text-emerald-500">
                              <CheckIcon />
                            </span>
                          )}
                          <span className="truncate">{doc.name}</span>
                        </button>
                        {doc.isDefault ? (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                            Demo
                          </span>
                        ) : (
                          <button
                            className="text-[10px] font-semibold text-slate-400 hover:text-slate-600"
                            onClick={() => onRemoveDoc(doc.id)}
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
                      onClick={onUploadClick}
                    >
                      Upload PDFs
                    </button>
                    <button
                      className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600"
                      onClick={onClearAll}
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

      <div className="relative flex flex-1 min-h-0 flex-row">
        <aside className="flex w-[300px] shrink-0 flex-col border-r border-slate-200 bg-white text-[16px]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 px-4 py-4">
            <div>
              <div className="text-[12px] font-semibold text-slate-500">
                DOCUMENTS
              </div>
              <div className="text-[11px] text-slate-400">
                Manage uploaded PDFs
              </div>
            </div>
            <button
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-800"
              onClick={onUploadClick}
            >
              Upload
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-5">
              {renderDocumentList(docs, "No documents yet", "current")}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-[#eef1f4]">
          <section className="flex-1 min-h-0">
            <div
              className={`flex h-full w-full overflow-auto bg-[#eef1f4] ${
                isFullViewer
                  ? "items-stretch justify-stretch"
                  : "items-center justify-center"
              }`}
            >
              <div
                className={`${viewerSizeClasses[viewerSize]} relative min-h-0 min-w-0 overflow-hidden bg-white ${
                  isFullViewer
                    ? ""
                    : "rounded-2xl border border-slate-300 shadow-sm"
                }`}
              >
                {viewer}
              </div>
            </div>
          </section>
          <div className="fixed bottom-4 right-4 flex items-center gap-2">
            <button
              className={`flex items-center gap-4 rounded-full px-10 py-5 text-base font-semibold uppercase tracking-[0.25em] shadow-lg transition ${
                canApproveDocument
                  ? "bg-emerald-500 text-white hover:bg-emerald-400"
                  : "cursor-not-allowed bg-slate-200 text-slate-400"
              }`}
              onClick={onApproveDocument}
              disabled={!canApproveDocument}
            >
              <span className="text-xl">
                <CheckIcon />
              </span>
              {activeDoc.approved ? "Approved" : "Approve Document"}
            </button>
          </div>
        </div>

      </div>

    </main>
  );
}
