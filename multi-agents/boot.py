import os
import subprocess
import keyring
from keyrings.alt.file import PlaintextKeyring
from promptflow.client import PFClient
from promptflow.entities import AzureOpenAIConnection, CognitiveSearchConnection

# Força o uso de armazenamento em arquivo
keyring.set_keyring(PlaintextKeyring())

# Load credentials from environment (see SENSITIVE_DATA_MIGRATION.md)
AOAI_KEY = os.environ.get("AZURE_OPENAI_API_KEY")
AOAI_BASE = os.environ.get("AZURE_OPENAI_ENDPOINT")
SEARCH_KEY = os.environ.get("AZURE_SEARCH_KEY")
SEARCH_BASE = os.environ.get("AZURE_SEARCH_ENDPOINT")
SEARCH_INDEX = os.environ.get("AZURE_SEARCH_INDEX", "json-vetorizado")

if not all([AOAI_KEY, AOAI_BASE, SEARCH_KEY, SEARCH_BASE]):
    print("!!! [BOOT] Missing critical environment variables: one or more of AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_SEARCH_KEY, AZURE_SEARCH_ENDPOINT is not set.")


def setup_connections():
    print(">>> [BOOT] Configurando conexões...")
    cli = PFClient()

    # OpenAI
    if AOAI_KEY and AOAI_BASE:
        try:
            aoai_conn = AzureOpenAIConnection(
                name="aoai_connection",
                api_key=AOAI_KEY,
                api_base=AOAI_BASE,
                api_type="azure",
                api_version="2024-02-15-preview"
            )
            cli.connections.create_or_update(aoai_conn)
            print(">>> [BOOT] OpenAI OK!")
        except Exception as e:
            print(f"!!! [BOOT] Erro OpenAI: {e}")
    else:
        print("!!! [BOOT] Skipping OpenAI connection because AZURE_OPENAI_API_KEY or AZURE_OPENAI_ENDPOINT is missing")

    # Search
    if SEARCH_KEY and SEARCH_BASE:
        try:
            search_conn = CognitiveSearchConnection(
                name="civicchatbotsearch",
                api_key=SEARCH_KEY,
                api_base=SEARCH_BASE
            )
            cli.connections.create_or_update(search_conn)
            print(">>> [BOOT] Search OK!")
        except Exception as e:
            print(f"!!! [BOOT] Erro Search: {e}")
    else:
        print("!!! [BOOT] Skipping Search connection because AZURE_SEARCH_KEY or AZURE_SEARCH_ENDPOINT is missing")


def start_server():
    print(">>> [BOOT] Iniciando servidor...")

    # PREPARA O AMBIENTE PARA O SERVIDOR
    env = os.environ.copy()
    # Only inject variables that are set in the environment
    if SEARCH_KEY:
        env["AZURE_SEARCH_KEY"] = SEARCH_KEY
    if SEARCH_BASE:
        env["AZURE_SEARCH_ENDPOINT"] = SEARCH_BASE
    if SEARCH_INDEX:
        env["AZURE_SEARCH_INDEX"] = SEARCH_INDEX
    if AOAI_KEY:
        env["AZURE_OPENAI_API_KEY"] = AOAI_KEY
    if AOAI_BASE:
        env["AZURE_OPENAI_ENDPOINT"] = AOAI_BASE

    # Inicia o processo com o ambiente enriquecido
    subprocess.run(
        ["pf", "flow", "serve", "--source", "/flow", "--port", "8080", "--host", "0.0.0.0"],
        env=env
    )


if __name__ == "__main__":
    setup_connections()
    start_server()