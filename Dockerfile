# Utiliser une image Node.js pour construire le projet
FROM node:22 AS build-stage

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du backend
COPY backend/ ./backend/

# Se déplacer dans le répertoire backend et installer les dépendances
WORKDIR /app/backend
RUN npm install

# Revenir au répertoire de base et copier les fichiers du frontend
WORKDIR /app
COPY web501/ ./web501/

# Se déplacer dans le répertoire frontend et installer les dépendances
WORKDIR /app/web501
RUN npm install

# Compiler le frontend (build)
RUN npm run build

# Étape finale : Utiliser une image Node.js propre pour l'exécution
FROM node:22 AS production-stage

# Définir le répertoire de travail pour l'application
WORKDIR /app

# Copier les fichiers du backend depuis l'étape précédente
COPY --from=build-stage /app/backend ./backend

# Copier le dossier de build du frontend
COPY --from=build-stage /app/web501/dist ./public

# Installer uniquement les dépendances de production pour le backend
WORKDIR /app/backend
RUN npm install --production

# Exposer le port sur lequel l'application tourne
EXPOSE 3000

# Démarrer le serveur
CMD ["node", "server.js"]
