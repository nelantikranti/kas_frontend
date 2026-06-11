export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Opens Gmail compose in a new tab (no credentials required). User attaches the downloaded PDF. */
export function openGmailCompose(opts: {
  to: string;
  subject: string;
  body: string;
}) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: opts.to,
    su: opts.subject,
    body: opts.body,
  });
  window.open(`https://mail.google.com/mail/?${params.toString()}`, "_blank", "noopener,noreferrer");
}

export async function sharePdfViaGmail(opts: {
  pdfBlob: Blob;
  filename: string;
  to: string;
  subject: string;
  body: string;
  onDownloaded?: () => void;
}) {
  downloadBlob(opts.pdfBlob, opts.filename);
  opts.onDownloaded?.();
  openGmailCompose({ to: opts.to, subject: opts.subject, body: opts.body });
}
