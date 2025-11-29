FROM mcr.microsoft.com/azureml/promptflow/promptflow-runtime:latest

COPY . /flow

# Instala requirements E a biblioteca de keyring alternativa
RUN pip install -r /flow/requirements.txt && \
    pip install keyrings.alt

ENV PYTHONUNBUFFERED=1

# Configurações para evitar warnings do keyring
ENV PYTHON_KEYRING_BACKEND=keyrings.alt.file.PlaintextKeyring

EXPOSE 8080

CMD ["python", "/flow/boot.py"]