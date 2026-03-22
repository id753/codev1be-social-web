# 🌍 Подорожники
### Платформа для мандрівників, де можна поділитися історіями подорожей, знайти натхнення та приєднатися до спільноти однодумців ✈️
## [Live Project](https://codev1be-social-web.vercel.app/)
⚠️ Note: The server is on a free plan, so it may take 30-50s to wake up 🚀 on the first load.
## [Backend Code](https://github.com/id753/codev1be-social-api)

## My Key Deliverables

### Backend: 
Developed secure private endpoints for user profile management, implementing robust data validation with Celebrate/Joi and JWT-based authentication. Designed and integrated a dual-stage email verification system and a password reset flow using Nodemailer and SMTP to ensure secure data updates.
     
     router.get('/me', authenticate, getCurrentUser);
     router.patch('/me', authenticate, celebrate(updateUserSchema), updateUser);
     router.post('/auth/request-reset-email',celebrate(requestResetEmailSchema),requestResetEmail,);
     router.post('/auth/reset-password',celebrate(resetPasswordSchema),resetPassword,);

### Frontend:
Engineered a dynamic, SEO-friendly StoryPage utilizing Next.js dynamic routing. Implemented complex data fetching with integrated loading states and a responsive UI that adapts content density (2-3 articles) across mobile, tablet, and desktop views. Developed an interactive 'Save to Favorites' feature with real-time state synchronization via backend API integration.

    route: /stories/[storyId]

## 📖 Про проєкт

Подорожники — це багатосторінковий веб-застосунок для людей, які живуть подорожами 🌄

Платформа дозволяє:

📝 Публікувати та читати історії мандрівників
🔖 Зберігати улюблені статті до свого профілю
👥 Знайомитися з іншими мандрівниками
✍️ Створювати та редагувати власні історії
🔐 Реєструватися та авторизуватися

🎯 Мета проєкту

Створити адаптивний MVP-застосунок, який:

✅ Реалізує публічні та приватні маршрути
🔗 Працює з бекендом через API
🔐 Має систему авторизації
📄 Підтримує серверну пагінацію
💾 Має систему збереження статей
🎨 Відповідає UI Kit та макету

## 🗂️ Структура сторінок

| 📄 Сторінка | 🔗 Маршрут |
|-------------|------------|
| 🏠 Головна | `/` |
| 📝 Реєстрація | `/auth/register` |
| 🔐 Вхід | `/auth/login` |
| 📚 Історії | `/stories` |
| 📖 Окрема історія | `/stories/[storyId]` |
| ➕ Створення історії | `/stories/create` |
| ✏️ Редагування історії | `/stories/[storyId]/edit` |
| 🌍 Мандрівники | `/travellers` |
| 👤 Профіль мандрівника | `/travellers/[travellerId]` |
| ⭐ Мій профіль / Збережені | `/profile` |
| ⚙️ Редагування профілю | `/profile/edit` |



🛠️ Технології
⚙️ Ядро

Next.js 15 — App Router, SSR

React — побудова UI

🎨 Стилізація

CSS Modules

modern-normalize

Mobile First (min-width)

🧠 Стейт-менеджмент

Redux / Zustand

🔄 Робота з API

TanStack Query (React Query)

кешування

інвалідація

background refetch

🧾 Форми

Formik

Yup — валідація

🔐 Авторизація

Реалізовано:

✅ Реєстрацію
✅ Вхід
🛡 Захист приватних сторінок
🪟 Модальні підтвердження
🔔 Toast-повідомлення

📦 Основні компоненти

Layout (Header + Footer + main)

PopularStories

TravellersStories

TravellersList

StoryDetails

ConfirmModal

AuthNavModal

AddStoryForm

PageToggle

🚀 Запуск проєкту
npm install
npm run dev
npm run build
npm start


🌐 Продакшн версія:
https://codev1be-social-web.vercel.app/

📁 Структура проєкту

/
├── app/
├── components/
├── hooks/
├── lib/
├── types/
└── public/

Додаток підтримує:

🌞 Світлу тему
🌙 Темну тему

Колірна схема зберігається через глобальний стан або CSS-змінні.

📌 Особливості реалізації

⚡ Серверна пагінація
🚀 Префетч даних
♻️ Інвалідація кешу після мутацій
⏳ Лоадери під час запитів
🪟 Модалки з Escape + backdrop
🧭 Динамічні маршрути
📱 Бургер-меню для мобільних

✨ Ключові функції

🔐 Публічні та приватні маршрути
📄 Серверна пагінація
⭐ Збереження статей
🔔 Toast-повідомлення
⏳ Індикатори завантаження
📱 Адаптивна навігація

👥 Команда CodeV1be

Проєкт розроблений командою в рамках навчального курсу 💻

📄 Ліцензія

© 2026 Подорожники. Усі права захищені.
