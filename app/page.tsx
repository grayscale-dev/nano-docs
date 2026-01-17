"use client";

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import ApryseViewer from "../components/ApryseViewer";
import AppShell, { type DocRef, type ViewerSize } from "../components/AppShell";

const DEMO_DOC: DocRef = {
  id: "demo-contract",
  name: "Sample.pdf",
  url: "/sample.pdf",
  isDefault: true,
};

const ACCESS_PASSWORD = "nanorox!";

export default function HomePage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState(DEMO_DOC.id);
  const [docs, setDocs] = useState<DocRef[]>([DEMO_DOC]);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [viewerSize, setViewerSize] = useState<ViewerSize>("full");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerInstanceRef = useRef<any>(null);

  const uploadedDocsCount = docs.filter((doc) => !doc.isDefault).length;

  const activeDocFromCurrent = docs.find((doc) => doc.id === activeDocId);
  const activeDoc =
    activeDocFromCurrent ?? DEMO_DOC;
  const canApproveDocument = Boolean(activeDocFromCurrent);

  useEffect(() => {
    const stored = sessionStorage.getItem("nano-docs-auth");
    if (stored === "true") {
      setIsUnlocked(true);
    }
  }, []);

  useEffect(() => {
    const hasActiveInCurrent = docs.some((doc) => doc.id === activeDocId);
    if (!hasActiveInCurrent) {
      setActiveDocId(docs[0]?.id ?? DEMO_DOC.id);
    }
  }, [docs, activeDocId]);

  const handlePasswordSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (passwordInput === ACCESS_PASSWORD) {
      sessionStorage.setItem("nano-docs-auth", "true");
      setIsUnlocked(true);
      setPasswordInput("");
      setPasswordError(null);
      return;
    }
    setPasswordError("Incorrect password.");
  };

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

    setDocs((prev) => [...nextDocs, ...prev]);
    setActiveDocId(nextDocs[0].id);
    setIsActionsMenuOpen(false);
    event.target.value = "";
  };

  const handleRemoveDoc = async (id: string) => {
    const target = docs.find((doc) => doc.id === id);
    if (!target || target.isDefault) return;
    setDocs((prev) => prev.filter((doc) => doc.id !== id));
    if (activeDocId === id) {
      setActiveDocId(docs.find((doc) => doc.id !== id)?.id ?? DEMO_DOC.id);
    }
  };

  const handleClearAll = async () => {
    setDocs((prev) => prev.filter((doc) => doc.isDefault));
    setActiveDocId(DEMO_DOC.id);
    setIsActionsMenuOpen(false);
  };

  const handleOpenDocument = (
    id: string,
    _source: "current" | "deleted" | "previous" = "current"
  ) => {
    setActiveDocId(id);
  };

  const handleApproveDocument = () => {
    setDocs((prev) =>
      prev.map((doc) =>
        doc.id === activeDocId ? { ...doc, approved: true } : doc
      )
    );
  };

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-[#eef1f4] text-slate-900">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              Nano Docs
            </div>
            <h1 className="mt-2 text-lg font-semibold text-slate-900">
              Enter Password
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              This demo is protected. Please enter the access password.
            </p>
            <form className="mt-5 space-y-3" onSubmit={handlePasswordSubmit}>
              <label className="text-sm font-semibold text-slate-600">
                Password
                <input
                  type="password"
                  className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                  value={passwordInput}
                  onChange={(event) => {
                    setPasswordInput(event.target.value);
                    setPasswordError(null);
                  }}
                  placeholder="Enter password"
                  autoFocus
                />
              </label>
              {passwordError && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
                  {passwordError}
                </div>
              )}
              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <AppShell
        activeDoc={activeDoc}
        docs={docs}
        uploadedDocsCount={uploadedDocsCount}
        canApproveDocument={canApproveDocument}
        viewerSize={viewerSize}
        isActionsMenuOpen={isActionsMenuOpen}
        onToggleActionsMenu={() => setIsActionsMenuOpen((prev) => !prev)}
        onApproveDocument={handleApproveDocument}
        onOpenDocument={handleOpenDocument}
        onSelectDocFromActionsMenu={(id) => {
          handleOpenDocument(id, "current");
          setIsActionsMenuOpen(false);
        }}
        onRemoveDoc={handleRemoveDoc}
        onClearAll={handleClearAll}
        onUploadClick={handleUploadClick}
        onViewerSizeChange={setViewerSize}
        viewer={
          <ApryseViewer
            licenseKey={process.env.NEXT_PUBLIC_APRYSE_KEY}
            documentToLoad={activeDoc}
            onInstanceReady={(instance) => {
              viewerInstanceRef.current = instance;
            }}
          />
        }
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />
    </>
  );
}
