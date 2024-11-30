FROM python:3.12

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el proyecto
COPY . .

# Exponer el puerto del backend
EXPOSE 5000


CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "application:app"]

