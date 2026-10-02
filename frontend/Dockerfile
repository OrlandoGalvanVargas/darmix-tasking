FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api
ARG VITE_API_MODE=auto
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_MODE=$VITE_API_MODE

RUN npm run build

FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]