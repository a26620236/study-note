# Use a Node 20 base image
FROM node:20-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Install pnpm and sentry-cli globally (cached in early layer)
RUN npm install -g pnpm@10

# Copy package.json & pnpm-lock.yaml files
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY apps/lumiture-ai/package.json apps/lumiture-ai/

# Envs

# Default is production, but can be overrided
ARG _NODE_ENV=production
ARG _NEXT_PUBLIC_NODE_ENV_NAME
ARG _NEXTAUTH_SECRET
ARG _NEXTAUTH_URL
ARG _API_BASE_URL
ARG _NEXT_PUBLIC_API_BASE_URL
ARG _NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME
ARG _NEXT_PUBLIC_WS_BASE_URL
ARG _GTAG_ID
ARG _GOOGLE_CLIENT_ID
ARG _GOOGLE_CLIENT_SECRET
ARG _MICROSOFT_CLIENT_ID
ARG _MICROSOFT_CLIENT_SECRET
ARG _GITHUB_CLIENT_ID
ARG _GITHUB_CLIENT_SECRET
ARG _SENTRY_AUTH_TOKEN
ARG _NEXT_PUBLIC_SENTRY_DSN

ENV NODE_ENV=${_NODE_ENV}
ENV NEXT_PUBLIC_NODE_ENV_NAME=${_NEXT_PUBLIC_NODE_ENV_NAME}
ENV NEXTAUTH_SECRET=${_NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${_NEXTAUTH_URL}
ENV API_BASE_URL=${_API_BASE_URL}
ENV NEXT_PUBLIC_API_BASE_URL=${_NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME=${_NEXT_PUBLIC_CLOUD_STORAGE_BUCKET_NAME}
ENV NEXT_PUBLIC_WS_BASE_URL=${_NEXT_PUBLIC_WS_BASE_URL}
ENV NEXT_PUBLIC_GTAG_ID=${_GTAG_ID}
ENV GOOGLE_CLIENT_ID=${_GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${_GOOGLE_CLIENT_SECRET}
ENV MICROSOFT_CLIENT_ID=${_MICROSOFT_CLIENT_ID}
ENV MICROSOFT_CLIENT_SECRET=${_MICROSOFT_CLIENT_SECRET}
ENV GITHUB_CLIENT_ID=${_GITHUB_CLIENT_ID}
ENV GITHUB_CLIENT_SECRET=${_GITHUB_CLIENT_SECRET}
ENV NEXT_PUBLIC_SENTRY_DSN=${_NEXT_PUBLIC_SENTRY_DSN}
ENV NEXT_PUBLIC_SENTRY_RELEASE=${_SENTRY_RELEASE}

# Install dependencies (pnpm install --frozen-lockfile makes sure the exact versions in the lockfile gets installed)
RUN if [ "${NODE_ENV}" = "development" ]; then pnpm install; else pnpm install --frozen-lockfile; fi

# Copy app files
COPY . .

# Build App (if production or staging)
RUN if [ "${NODE_ENV}" = "production" ] || [ "${NODE_ENV}" = "staging" ]; then pnpm nx run lumiture-ai:build; fi

EXPOSE 3000

# Run App base on which env
CMD if [ "${NODE_ENV}" = "development" ]; then pnpm nx run lumiture-ai:dev; else pnpm nx run lumiture-ai:start; fi
