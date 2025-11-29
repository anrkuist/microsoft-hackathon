import os
from azure.storage.blob import BlobServiceClient
import pypdf

def extract_text_from_pdf(pdf_bytes):
    reader = pypdf.PdfReader(pdf_bytes)
    text_pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        text_pages.append({"page": i+1, "text": text})
    return text_pages

def entrypoint():
    conn_str = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
    if not conn_str:
        raise ValueError("Missing environment variable AZURE_STORAGE_CONNECTION_STRING required to access blob storage")

    blob_service = BlobServiceClient.from_connection_string(conn_str)
    container = blob_service.get_container_client("pdfs")

    results = []
    for blob in container.list_blobs():
        pdf = container.download_blob(blob.name).readall()
        pages = extract_text_from_pdf(pdf)
        for p in pages:
            results.append({
                "candidate": blob.name.split("-")[0],
                "page": p["page"],
                "content": p["text"]
            })

    return results
