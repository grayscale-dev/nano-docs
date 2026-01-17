"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import ApryseViewer from "../components/ApryseViewer";
import AppShell, { type DocRef, type ViewerSize } from "../components/AppShell";

const DEMO_DOC: DocRef = {
  id: "demo-contract",
  name: "Sample.pdf",
  url: "/sample.pdf",
  isDefault: true,
};

export default function HomePage() {
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
    const hasActiveInCurrent = docs.some((doc) => doc.id === activeDocId);
    if (!hasActiveInCurrent) {
      setActiveDocId(docs[0]?.id ?? DEMO_DOC.id);
    }
  }, [docs, activeDocId]);

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
