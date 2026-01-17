"use client";

import { useEffect, useRef, useState } from "react";

type ApryseViewerProps = {
  licenseKey?: string;
  documentToLoad?: {
    id: string;
    name: string;
    file?: Blob;
    url?: string;
  };
  onInstanceReady?: (instance: any) => void;
};

export default function ApryseViewer({
  licenseKey,
  documentToLoad,
  onInstanceReady,
}: ApryseViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);
  const lastLoadedIdRef = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isActive = true;
    let onDocumentLoaded: (() => void) | null = null;

    async function init() {
      if (!viewerRef.current || instanceRef.current) return;

      const WebViewer = (await import("@pdftron/webviewer")).default;

      viewerRef.current.innerHTML = "";
      const instance = await WebViewer(
        {
          path: "/webviewer",
          licenseKey,
        },
        viewerRef.current
      );
      if (!isActive) {
        instance?.UI?.dispose?.();
        return;
      }
      const { documentViewer } = instance.Core;
      onDocumentLoaded = () => {
        instance.UI.setZoomLevel(1);
        instance.UI.setActiveTabInPanel({
          tabPanel: "leftPanel",
          tabName: "thumbnailsPanel",
        });
        instance.UI.openElements(["leftPanel", "thumbnailsPanel"]);
        if (isActive) setIsReady(true);
      };
      documentViewer.addEventListener("documentLoaded", onDocumentLoaded);
      instanceRef.current = instance;
      onInstanceReady?.(instance);
      setIsInitialized(true);
    }

    init();

    return () => {
      isActive = false;
      if (onDocumentLoaded && instanceRef.current?.Core?.documentViewer) {
        instanceRef.current.Core.documentViewer.removeEventListener(
          "documentLoaded",
          onDocumentLoaded
        );
      }
      instanceRef.current?.UI?.dispose?.();
      instanceRef.current = null;
      setIsInitialized(false);
      if (viewerRef.current) viewerRef.current.innerHTML = "";
    };
  }, [licenseKey]);

  useEffect(() => {
    if (!isInitialized || !instanceRef.current || !documentToLoad) return;
    if (lastLoadedIdRef.current === documentToLoad.id) return;

    setIsReady(false);
    lastLoadedIdRef.current = documentToLoad.id;
    const source = documentToLoad.file ?? documentToLoad.url;
    if (!source) return;

    instanceRef.current.UI.loadDocument(source, {
      filename: documentToLoad.name,
    });
  }, [documentToLoad, isInitialized]);

  return (
    <div className="relative h-full w-full min-h-0 border border-slate-200 bg-white">
      {!isReady && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-100/90 p-6">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-500" />
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Loading PDF
          </div>
        </div>
      )}
      <div
        ref={viewerRef}
        className={`h-full w-full transition-opacity ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
