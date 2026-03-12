FROM mcr.microsoft.com/playwright:v1.50.1-jammy

# radni folder u containeru
WORKDIR /app

# kopiramo package fajlove prvo (zbog cache-a)
COPY package.json package-lock.json ./

# instalacija dependencies
RUN npm install

# kopiranje ostatka projekta
COPY . .

# pokretanje testova
CMD ["npx", "playwright", "test", "tests/contacts/addContact.spec.ts"]