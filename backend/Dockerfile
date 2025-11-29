# Imagem leve do Python
FROM python:3.11-slim

# Diretório de trabalho
WORKDIR /app

# Instala dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código (main.py)
COPY . .

# Expõe a porta 8000
EXPOSE 8000

# Inicia o servidor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]